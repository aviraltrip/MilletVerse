# MilletVerse 🌾

A comprehensive, full-stack MERN health-tech aggregator designed to promote millet-based diets, connect consumers with certified culinary experts, and leverage AI to provide personalized therapeutic nutrition paths.

## 🚀 Features

### Core Modules
*   **Authentication & Roles:** JWT-based secure login with Role-Based Access Control (`user`, `expert`, `admin`).
*   **Encyclopedia:** A beautifully crafted database of ancient millets (Sorghum, Pearl, Finger, etc.) detailing their health benefits, GI metrics, and nutritional breakdown.
*   **Expert Directory & Portal:** 
    *   Public directory for discovering certified millet nutritionists.
    *   Dedicated portal for experts to submit exclusive therapeutic recipes.
    *   Expert profiles showcasing their specific approved recipes.
*   **Dynamic Recipes:** Filterable, searchable repository of millet recipes focusing on specific conditions (Diabetes, PCOD, etc.).
*   **Health Tracking & Visualizations:** Daily wellness check-in logging energy, digestion, weight, and blood sugar, visualized dynamically using Recharts.
*   **Geospatial Insights (Maps):** Dual-mode interactive maps (Store Locator for Hubli via Haversine distance & State-level cultivation visualizations) powered by React-Leaflet.
*   **Admin Management System:** Robust Admin Login and Panel. Secure admin authentication with restricted access for managing experts (reviewing registrations), users, and platform data.

### AI Integrations 🧠 (Powered by Google Gemini SDK)
*   **Clinical Note Interpreter:** Paste doctor prescriptions to extract structured therapeutic targets mapped to specific millet diets.
*   **Custom Recipe Generator:** AI drafts completely novel recipes based on available ingredients and user health constraints.

## 🛠️ Technology Stack
*   **Frontend:** React (Vite), Tailwind CSS v4, React Router, Axios, Recharts, React-Leaflet, jspdf.
*   **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT (cookie-based session management), Bcrypt.
*   **Services:** Cloudinary (for image uploads), Google Gemini SDK (for AI capabilities).

---

## 💻 Local Setup Instructions

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local server running or a cloud Atlas Cluster)
*   Cloudinary Account (Free)
*   Google Gemini API Key (Free)

### 1. Clone & Install Dependencies
\`\`\`bash
cd d:\milletverse
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
\`\`\`

### 2. Environment Variables
Create a \`.env\` file in the `server` directory:

\`\`\`env
PORT=5000
# Important: Use 127.0.0.1 instead of localhost if you encounter connection issues
MONGO_URI=mongodb://127.0.0.1:27017/milletverse 
JWT_SECRET=your_super_secret_jwt_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GEMINI_API_KEY=your_google_gemini_api_key
\`\`\`

### 3. Database Seeding
To populate the database with initial millets, conditions, experts, and recipes smoothly:

\`\`\`bash
cd server
node seed.js
\`\`\`
*Note: This script adds a demo `admin@milletverse.com` (password: password123) and sample experts/users.*

### 4. Running the Application
Open two separate terminal windows:

**Terminal 1 (Backend - Port 5000):**
\`\`\`bash
cd server
npm start
\`\`\`

**Terminal 2 (Frontend - Port 5173):**
\`\`\`bash
cd client
npm run dev
\`\`\`

Visit `http://localhost:5173` to explore MilletVerse!

---
## 👷 Project Structure

\`\`\`
d:\milletverse\
├── client                 # Vite React Frontend
│   ├── src
│   │   ├── api            # Axios instance configuration
│   │   ├── components     # Reusable UI (Navbar, MilletCard, RecipeModal)
│   │   ├── data           # Static Map Data (stores, cultivation)
│   │   └── pages          # Full pages (Onboarding, AdminDashboard, etc.)
│   └── package.json
└── server                 # Express Backend
    ├── controllers        # Core business logic (aiController, adminController, etc.)
    ├── middleware         # JWT Verification, Role validations
    ├── models             # Mongoose Schemas
    ├── routes             # API Endpoints
    ├── server.js          # App entrypoint
    ├── seed.js            # Initial data hydration script
    └── package.json
\`\`\`

Built with ❤️ for a sustainable and healthier future!
