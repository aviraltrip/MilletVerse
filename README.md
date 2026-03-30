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

## Notes

- **Recipe image upload** requires Cloudinary env vars. If not set, recipe creation still works but image upload will fail.
- The frontend uses `/api` as the base URL; in dev, ensure your Vite proxy (or deployment) routes `/api` to the backend.
