# ApexMoto Backend (Node.js + Express)

## 1) Add backend to your project

From repo root:

```bash
cd backend
cp .env.example .env
npm install
npm run start
```

Default backend URL is:
- `http://localhost:4000`

## 2) Set your website link (important)

In `backend/.env`, set your frontend website URL so browser requests are allowed by CORS:

```env
FRONTEND_URL=http://localhost:3000
```

For production, use your real site URL (example):

```env
FRONTEND_URL=https://your-site.vercel.app
```

## 3) Connect frontend to specific backend link

In your frontend app env file (example `apexmoto-platform-build/.env.local`):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

Then call APIs using this base URL.

## Endpoints

- `GET /`
- `GET /health`
- `GET /api/products` | `GET /api/products/:id` | `POST /api/products` | `PUT /api/products/:id` | `DELETE /api/products/:id`
- `GET /api/shops` | `GET /api/shops/:id` | `POST /api/shops` | `PUT /api/shops/:id` | `DELETE /api/shops/:id`
- `GET /api/bikes` | `GET /api/bikes/:id` | `POST /api/bikes` | `PUT /api/bikes/:id` | `DELETE /api/bikes/:id`
