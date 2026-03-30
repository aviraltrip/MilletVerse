# MilletVerse

Full‑stack MERN app for millet-based dietary intelligence: encyclopedia + recipes + expert portal + health logging + maps + Gemini-powered tools.

## Features

- **Auth & roles**: JWT auth with role-based access (`user`, `expert`, `admin`)
- **Millet Encyclopedia**: millet profiles with nutrition + GI/GL
- **Recipes**: searchable/filterable recipe library (expert + community)
- **Expert Directory + Expert Portal**: browse experts; experts can publish recipes (with optional image upload)
- **Health logging**: daily check-in and trend charts
- **Maps**: store locator + cultivation map (React Leaflet)
- **Admin panel**: manage users and experts
- **AI tools (Gemini)**:
  - Clinical note interpreter (`/doctor-note`)
  - AI recipe generator (`/ai-recipe`)

## Tech stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios, Recharts, React Leaflet
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- **Services**: Cloudinary (recipe image uploads), Google Gemini (AI endpoints)

## Monorepo layout

```
milletverse/
├─ frontend/               # Vite React app
└─ backend/                # Express API
```

## Prerequisites

- Node.js 18+ (Node 20+ recommended)
- MongoDB (local or Atlas)
- Optional: Cloudinary account (for recipe image uploads)
- Optional: Gemini API key (for AI features)

## Local setup (Windows / PowerShell)

### Install dependencies

```bash
cd d:\milletverse

cd backend
npm install

cd ..\frontend
npm install
```

### Backend environment variables

Create `backend/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/milletverse

JWT_SECRET=change_me
JWT_REFRESH_SECRET=change_me_too

# Optional (recipe image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional (AI features)
GEMINI_API_KEY=your_google_gemini_api_key
```

### Seed the database (optional)

```bash
cd d:\milletverse\backend
node seed.js
```

### Run the app

Backend (API on `http://localhost:5000`):

```bash
cd d:\milletverse\backend
npm run dev
```

Frontend (web on `http://localhost:5173`):

```bash
cd d:\milletverse\frontend
npm run dev
```

## Production Deployment

MilletVerse is optimized for a decoupled deployment: **Backend on Render** and **Frontend on Vercel**.

### 1. Backend (Render)

1. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET` & `JWT_REFRESH_SECRET`: Secure random strings.
   - `ADMIN_EMAIL` & `ADMIN_PASSWORD`: Your initial admin credentials.
   - `ALLOWED_ORIGINS`: Your Vercel frontend URL (e.g., `https://millet-verse-ui.vercel.app`).
   - `CLOUDINARY_URL` / `GEMINI_API_KEY`: (Optional) For images and AI.
2. **Build Settings**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2. Frontend (Vercel)

1. **Environment Variables**:
   - `VITE_API_BASE_URL`: Your Render backend URL + `/api` (e.g., `https://millet-verse-api.onrender.com/api`).
2. **Build Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Routing**: The included `vercel.json` ensures that client-side routing (React Router) works correctly in production.

## Notes & Security

- **Secure Cookies**: In production (`NODE_ENV=production`), the app uses `SameSite=None` and `Secure` cookies to allow the frontend (Vercel) to communicate with the backend (Render).
- **NoSQL Injection**: The backend uses `express-mongo-sanitize` to protect against malicious query patterns.
- **Rate Limiting**: API routes are rate-limited to 200 requests per 15-minute window.

