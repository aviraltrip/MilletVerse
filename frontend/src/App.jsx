import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Encyclopedia from './pages/Encyclopedia';
import Recipes from './pages/Recipes';
import ExpertPortal from './pages/ExpertPortal';
import ExpertDirectory from './pages/ExpertDirectory';
import ExpertProfile from './pages/ExpertProfile';
import MapView from './pages/MapView';
import DoctorNote from './pages/DoctorNote';
import AiRecipeGenerator from './pages/AiRecipeGenerator';
import GIVisualizer from './pages/GIVisualizer';
import HealthLog from './pages/HealthLog';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-cream">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/encyclopedia" element={<Encyclopedia />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/experts" element={<ExpertDirectory />} />
              <Route path="/experts/:id" element={<ExpertProfile />} />
              <Route path="/map" element={<MapView />} />

              {/* Protected Routes (login required) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/doctor-note" element={<DoctorNote />} />
                <Route path="/ai-recipe" element={<AiRecipeGenerator />} />
                <Route path="/gi-visualizer" element={<GIVisualizer />} />
                <Route path="/health-log" element={<HealthLog />} />
              </Route>

              {/* Role-Guarded Routes */}
              <Route element={<RoleGuard allowedRoles={['expert']} />}>
                <Route path="/expert-portal" element={<ExpertPortal />} />
              </Route>

              <Route element={<RoleGuard allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
