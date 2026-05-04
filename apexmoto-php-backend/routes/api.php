<?php
function route_request(string $method, string $uri): void {
    if ($uri === '/health') { json_response(['ok' => true]); return; }

    if ($method === 'POST' && $uri === '/register') register_user();
    elseif ($method === 'POST' && $uri === '/login') login_user();
    elseif ($method === 'GET' && $uri === '/products') list_products();
    elseif ($method === 'POST' && $uri === '/products') create_product();
    elseif (preg_match('#^/products/(\d+)$#', $uri, $m) && $method === 'GET') get_product((int)$m[1]);
    elseif (preg_match('#^/products/(\d+)$#', $uri, $m) && $method === 'PUT') update_product((int)$m[1]);
    elseif (preg_match('#^/products/(\d+)$#', $uri, $m) && $method === 'DELETE') delete_product((int)$m[1]);
    elseif ($method === 'POST' && $uri === '/cart/add') cart_add();
    elseif ($method === 'GET' && $uri === '/cart') cart_get();
    elseif ($method === 'DELETE' && $uri === '/cart/remove') cart_remove();
    elseif ($method === 'POST' && $uri === '/orders') create_order();
    elseif ($method === 'GET' && $uri === '/orders/user') user_orders();
    elseif ($method === 'GET' && $uri === '/admin/orders') admin_orders();
    else json_response(['error' => 'Not found'], 404);
}

function register_user(): void {
    $in = get_json_input();
    $miss = validate_required($in, ['name','email','password']);
    if ($miss) { json_response(['error' => 'Missing fields', 'fields' => $miss], 422); return; }
    if (!filter_var($in['email'], FILTER_VALIDATE_EMAIL)) { json_response(['error' => 'Invalid email'], 422); return; }
    $stmt = db()->prepare('INSERT INTO users (name,email,password) VALUES (?,?,?)');
    $stmt->execute([$in['name'], strtolower($in['email']), password_hash($in['password'], PASSWORD_BCRYPT)]);
    json_response(['message' => 'Registered'], 201);
}

function login_user(): void {
    $in = get_json_input();
    $stmt = db()->prepare('SELECT id,password,role FROM users WHERE email = ?');
    $stmt->execute([strtolower($in['email'] ?? '')]);
    $u = $stmt->fetch();
    if (!$u || !password_verify($in['password'] ?? '', $u['password'])) { json_response(['error' => 'Invalid credentials'], 401); return; }
    json_response(['user_id' => (int)$u['id'], 'role' => $u['role']]);
}

function list_products(): void {
    $bike = $_GET['bike'] ?? null; $category = $_GET['category'] ?? null; $q = $_GET['q'] ?? null;
    $page = max(1, (int)($_GET['page'] ?? 1)); $limit = min(50, max(1, (int)($_GET['limit'] ?? 20))); $offset = ($page-1)*$limit;
    $sql = 'SELECT DISTINCT p.* FROM products p'; $where=[]; $params=[];
    if ($bike) { $sql .= ' JOIN product_bike_map pbm ON pbm.product_id=p.id JOIN bikes b ON b.id=pbm.bike_id'; $where[]='CONCAT(b.brand,"-",REPLACE(b.model," ","-")) = ?'; $params[]=$bike; }
    if ($category) { $where[]='p.category = ?'; $params[]=$category; }
    if ($q) { $where[]='p.name LIKE ?'; $params[]='%'.$q.'%'; }
    if ($where) $sql .= ' WHERE '.implode(' AND ', $where);
    $sql .= ' ORDER BY p.id DESC LIMIT ? OFFSET ?'; $params[]=$limit; $params[]=$offset;
    $stmt = db()->prepare($sql); $stmt->execute($params);
    json_response(['page'=>$page,'limit'=>$limit,'items'=>$stmt->fetchAll()]);
}

function get_product(int $id): void { $s=db()->prepare('SELECT * FROM products WHERE id=?'); $s->execute([$id]); $p=$s->fetch(); if(!$p){json_response(['error'=>'Not found'],404);return;} json_response($p); }
function create_product(): void { require_admin(); $in=get_json_input(); $m=validate_required($in,['name','category','price','stock']); if($m){json_response(['error'=>'Missing fields','fields'=>$m],422);return;} db()->prepare('INSERT INTO products (name,category,price,stock,image) VALUES (?,?,?,?,?)')->execute([$in['name'],$in['category'],$in['price'],$in['stock'],$in['image']??null]); $id=(int)db()->lastInsertId(); if(!empty($in['bike_ids'])&&is_array($in['bike_ids'])){ $st=db()->prepare('INSERT INTO product_bike_map (product_id,bike_id) VALUES (?,?)'); foreach($in['bike_ids'] as $bid){$st->execute([$id,(int)$bid]);}} json_response(['id'=>$id],201); }
function update_product(int $id): void { require_admin(); $in=get_json_input(); db()->prepare('UPDATE products SET name=?, category=?, price=?, stock=?, image=? WHERE id=?')->execute([$in['name'],$in['category'],$in['price'],$in['stock'],$in['image']??null,$id]); if(isset($in['bike_ids'])&&is_array($in['bike_ids'])){db()->prepare('DELETE FROM product_bike_map WHERE product_id=?')->execute([$id]);$st=db()->prepare('INSERT INTO product_bike_map (product_id,bike_id) VALUES (?,?)');foreach($in['bike_ids'] as $bid){$st->execute([$id,(int)$bid]);}} json_response(['message'=>'Updated']); }
function delete_product(int $id): void { require_admin(); db()->prepare('DELETE FROM products WHERE id=?')->execute([$id]); json_response(['message'=>'Deleted']); }

function cart_add(): void { $u=require_user(); $in=get_json_input(); $m=validate_required($in,['product_id','quantity']); if($m){json_response(['error'=>'Missing fields','fields'=>$m],422);return;} db()->prepare('INSERT INTO cart (user_id,product_id,quantity) VALUES (?,?,?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)')->execute([$u['id'],(int)$in['product_id'],(int)$in['quantity']]); json_response(['message'=>'Added']); }
function cart_get(): void { $u=require_user(); $s=db()->prepare('SELECT c.product_id,c.quantity,p.name,p.price,p.image,p.stock FROM cart c JOIN products p ON p.id=c.product_id WHERE c.user_id=?'); $s->execute([$u['id']]); json_response(['items'=>$s->fetchAll()]); }
function cart_remove(): void { $u=require_user(); $in=get_json_input(); db()->prepare('DELETE FROM cart WHERE user_id=? AND product_id=?')->execute([$u['id'],(int)($in['product_id']??0)]); json_response(['message'=>'Removed']); }

function create_order(): void {
    $u=require_user(); $pdo=db();
    $pdo->beginTransaction();
    try {
        $items=$pdo->prepare('SELECT c.product_id,c.quantity,p.price,p.stock FROM cart c JOIN products p ON p.id=c.product_id WHERE c.user_id=? FOR UPDATE');
        $items->execute([$u['id']]); $rows=$items->fetchAll();
        if(!$rows){ throw new Exception('Cart is empty'); }
        $total=0.0;
        foreach($rows as $r){ if((int)$r['stock'] < (int)$r['quantity']){ throw new Exception('Insufficient stock for product '.$r['product_id']); } $total += $r['price']*$r['quantity']; }
        $pdo->prepare('INSERT INTO orders (user_id,total_price,status) VALUES (?,?,?)')->execute([$u['id'],$total,'pending']);
        $oid=(int)$pdo->lastInsertId();
        $oi=$pdo->prepare('INSERT INTO order_items (order_id,product_id,quantity,unit_price) VALUES (?,?,?,?)');
        $us=$pdo->prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
        foreach($rows as $r){ $oi->execute([$oid,$r['product_id'],$r['quantity'],$r['price']]); $us->execute([$r['quantity'],$r['product_id']]); }
        $pdo->prepare('DELETE FROM cart WHERE user_id=?')->execute([$u['id']]);
        $pdo->commit();
        json_response(['order_id'=>$oid,'total_price'=>$total],201);
    } catch (Throwable $e) {
        $pdo->rollBack();
        json_response(['error'=>$e->getMessage()],422);
    }
}

function user_orders(): void { $u=require_user(); $s=db()->prepare('SELECT * FROM orders WHERE user_id=? ORDER BY id DESC'); $s->execute([$u['id']]); json_response(['items'=>$s->fetchAll()]); }
function admin_orders(): void { require_admin(); $s=db()->query('SELECT o.*, u.email FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.id DESC'); json_response(['items'=>$s->fetchAll()]); }
