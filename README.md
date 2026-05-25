# MilletVerse

MilletVerse is a full-stack MERN application for millet-based wellness tools: encyclopedia, recipes, expert directory, health logging, maps, and AI-assisted clinical note interpretation.

## Features

- JWT authentication with role-based access: `user`, `expert`, and `admin`
- Millet encyclopedia with nutrition, GI/GL, and cultivation insights
- Recipe library with expert-submitted recipes and optional Cloudinary image upload
- Expert directory and expert portal
- Health log submission and trend tracking
- Maps for store locator and cultivation regions
- Admin dashboard for managing users, experts, and content
- AI tools powered by OpenRouter (Gemini-compatible models)
- Twilio SMS notifications for prescription updates and user alerts

## Tech stack

- **Frontend**: React, Vite, Tailwind CSS, React Router, Axios, Recharts, React Leaflet
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **External services**: OpenRouter for AI, Cloudinary for optional image uploads, and Twilio for SMS notifications

## Repository structure

```
milletverse/
├─ backend/                # Express API and server code
└─ frontend/               # React + Vite frontend
```

## Prerequisites

- Node.js 18+ (Node 20+ recommended)
- MongoDB (local or Atlas)
- Optional: Cloudinary account for image uploads
- Optional: OpenRouter API key for AI features

## Local setup

### Install dependencies

```powershell
cd d:\milletverse
npm install --prefix backend
npm install --prefix frontend
```

### Backend environment variables

Copy `backend/env.example` to `backend/.env` and update values.

Required values:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/milletverse
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Optional values:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ALLOWED_ORIGINS=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENROUTER_API_KEY=your_openrouter_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=your_twilio_phone_number
# OPENROUTER_MODEL=google/gemini-2.5-flash
```

### Seed the database (optional)

```powershell
cd d:\milletverse\backend
node seed.js
```

### Run the app

Backend:

```powershell
cd d:\milletverse\backend
npm run dev
```

Frontend:

```powershell
cd d:\milletverse\frontend
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend API runs on `http://localhost:5000`.

## Production deployment

This project is designed as a decoupled frontend/backend application.

### Backend

Recommended environment variables:

- `NODE_ENV=production`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- `ALLOWED_ORIGINS` (comma-separated frontend URLs)
- `OPENROUTER_API_KEY` for AI features
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` for SMS notifications
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` for optional recipe image uploads

Render settings:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`

### Frontend

Vercel settings:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_BASE_URL` to your deployed backend API base URL (for example `https://your-backend.onrender.com/api`)

## Notes

- AI features are powered by OpenRouter and default to the Gemini-compatible model `google/gemini-2.5-flash`.
- Cloudinary is optional and only needed when using recipe image uploads.
- If `ADMIN_EMAIL` or `ADMIN_PASSWORD` are omitted, the server falls back to default values in `backend/controllers/authController.js`.
- CORS is controlled via `ALLOWED_ORIGINS`.
- The backend uses security middleware including `helmet`, `compression`, rate limiting, and MongoDB sanitization.

