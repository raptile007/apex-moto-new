# apex-moto-new
A high-performance, full-stack e-commerce platform for premium motorcycle parts, featuring a real-time custom bike builder, interactive mechanic map, and a dedicated admin dashboard.

## 🔗 Quick Links
- **Local Development**: [http://localhost:3000](http://localhost:3000)
- **GitHub Repository**: [https://github.com/raptile007/apex-moto-new](https://github.com/raptile007/apex-moto-new)


## Backend setup (Node.js API)

1. Start backend:
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run start
   ```
2. Set your website link in `backend/.env`:
   - Local: `FRONTEND_URL=http://localhost:3000`
   - Production: `FRONTEND_URL=https://your-site.vercel.app`
3. Set frontend API link in `apexmoto-platform-build/.env.local`:
   - `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`
