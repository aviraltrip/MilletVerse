import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, role, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/');
  };

  const navLink = 'hover:text-accent transition-colors duration-200 whitespace-nowrap';

  return (
    <nav className="bg-cream/90 backdrop-blur-md text-stone-700 border-b border-stone-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 text-xl font-heading font-bold text-primary hover:opacity-80 transition-all"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">M</div>
            MilletVerse
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-stone-500">
            <Link to="/encyclopedia" className="hover:text-primary transition-colors">Encyclopedia</Link>
            <Link to="/recipes" className="hover:text-primary transition-colors">Recipes</Link>
            <Link to="/experts" className="hover:text-primary transition-colors">Experts</Link>
            <Link to="/map" className="hover:text-primary transition-colors">Map</Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={navLink}>Dashboard</Link>
                {role === 'expert' && (
                  <Link to="/expert-portal" className={navLink}>Expert Portal</Link>
                )}
                {role === 'admin' && (
                  <Link to="/admin" className={navLink}>Admin</Link>
                )}
                <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/20">
                  <span className="text-white/60 text-xs truncate max-w-[120px]">{user?.name || user?.email}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-accent text-primary font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-6 ml-4">
                <Link to="/login" className="text-stone-600 hover:text-primary font-bold">Login</Link>
                <Link
                  to="/register"
                  className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl shadow-sm hover:bg-secondary transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-primary border-t border-white/10 px-4 py-4 flex flex-col gap-4 text-sm font-medium">
          {[
            { to: '/encyclopedia', label: 'Encyclopedia' },
            { to: '/recipes', label: 'Recipes' },
            { to: '/experts', label: 'Experts' },
            { to: '/map', label: 'Store Map' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} className={navLink} onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}

          <div className="border-t border-white/10 pt-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={`${navLink} block mb-3`} onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                {role === 'expert' && (
                  <Link to="/expert-portal" className={`${navLink} block mb-3`} onClick={() => setMenuOpen(false)}>
                    Expert Portal
                  </Link>
                )}
                {role === 'admin' && (
                  <Link to="/admin" className={`${navLink} block mb-3`} onClick={() => setMenuOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full bg-accent text-primary font-bold py-2.5 rounded-lg hover:bg-yellow-400 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="text-center py-2.5 border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-center bg-accent text-primary font-bold py-2.5 rounded-lg hover:bg-yellow-400 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
