import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { name, email, password, role } = formData;
      await register({ name, email, password, role });
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-heading font-bold text-primary">
            🌾 MilletVerse
          </Link>
          <p className="text-stone-500 mt-2 text-sm">Start your personalized millet health journey</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          <h2 className="text-2xl font-heading font-bold text-primary mb-6">Create Account</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6 flex items-start gap-2">
              <span className="mt-0.5 shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-stone-600 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Priya Sharma"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all text-stone-800 placeholder-stone-300"
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-semibold text-stone-600 mb-2">
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all text-stone-800 placeholder-stone-300"
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-semibold text-stone-600 mb-2">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all text-stone-800 placeholder-stone-300"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-stone-600 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all text-stone-800 placeholder-stone-300"
              />
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-3">I am joining as a...</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'user', label: '🧑 Health Seeker', desc: 'Get personalized nutrition plans' },
                  { value: 'expert', label: '👨‍⚕️ Nutrition Expert', desc: 'Share recipes & expertise' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.role === opt.value
                        ? 'border-secondary bg-secondary/5'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={opt.value}
                      checked={formData.role === opt.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="font-semibold text-stone-700 text-sm">{opt.label}</span>
                    <span className="text-xs text-stone-400 mt-1">{opt.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-secondary transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-stone-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-secondary font-semibold hover:text-primary transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
