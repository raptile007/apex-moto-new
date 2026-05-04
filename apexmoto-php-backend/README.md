# ApexMoto PHP + MySQL Backend

Production-style backend for bike spare parts e-commerce.

## Folder Structure

- `public/index.php` - single entry point
- `routes/api.php` - REST routing + business logic
- `config/database.php` - PDO connection
- `middleware/auth.php` - user/admin guards
- `core/helpers.php` - JSON + validation helpers
- `sql/schema.sql` - MySQL schema

## Setup

1. Create DB tables:
   ```bash
   mysql -u root -p < sql/schema.sql
   ```
2. Copy env and set DB credentials:
   ```bash
   cp .env.example .env
   ```
3. Run server:
   ```bash
   php -S localhost:8080 -t public
   ```

## API Endpoints

### Auth
- `POST /register`
- `POST /login`

### Products
- `GET /products?page=1&limit=20&bike=KTM-Duke-390&category=Brakes&q=pad`
- `GET /products/:id`
- `POST /products` (admin, requires header `X-User-Id`)
- `PUT /products/:id` (admin)
- `DELETE /products/:id` (admin)

### Cart
- `POST /cart/add`
- `GET /cart`
- `DELETE /cart/remove`

### Orders
- `POST /orders`
- `GET /orders/user`
- `GET /admin/orders` (admin)

## Security and correctness
- Passwords hashed with `password_hash`.
- SQL injection prevention via PDO prepared statements.
- Order placement uses DB transaction + row locks (`FOR UPDATE`) to keep inventory accurate.
