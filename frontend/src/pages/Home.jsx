import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: '🌾',
    title: 'Millet Encyclopedia',
    desc: 'Deep-dive into Sorghum, Pearl, Finger, and 6 more ancient grains — their GI, nutrients, and healing properties.',
    link: '/encyclopedia',
    linkText: 'Explore Grains',
  },
  {
    icon: '🍲',
    title: 'Therapeutic Recipes',
    desc: 'Browse 50+ expert-curated recipes targeting Diabetes, PCOD, Anemia, Hypertension and more.',
    link: '/recipes',
    linkText: 'Browse Recipes',
  },
  {
    icon: '👨‍⚕️',
    title: 'Expert Directory',
    desc: 'Find certified millet nutritionists near you and explore their exclusive recipe collections.',
    link: '/experts',
    linkText: 'Meet Experts',
  },
  {
    icon: '🧠',
    title: 'AI Doctor Note Interpreter',
    desc: 'Paste your prescription and let our Gemini-powered AI map it to a personalized millet diet plan.',
    link: '/doctor-note',
    linkText: 'Try Now',
  },
  {
    icon: '📊',
    title: 'Health Tracking',
    desc: 'Log daily energy, digestion, weight, and blood sugar. Visualize your trends with beautiful charts.',
    link: '/health-log',
    linkText: 'Start Logging',
  },
  {
    icon: '🗺️',
    title: 'Store & Cultivation Maps',
    desc: 'Find local millet stores in Hubli or explore state-wise millet cultivation across India.',
    link: '/map',
    linkText: 'Open Map',
  },
];

const stats = [
  { value: '9+', label: 'Ancient Millets' },
  { value: '50+', label: 'Therapeutic Recipes' },
  { value: '7', label: 'Health Conditions Targeted' },
  { value: '100%', label: 'AI-Powered' },
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-cream min-h-screen font-body">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-muted blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center">
          <span className="inline-block bg-accent/20 text-accent font-bold tracking-widest uppercase text-xs px-4 py-2 rounded-full mb-6 border border-accent/30">
            🌿 India's First Millet Health Platform
          </span>
          <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight mb-6 animate-fade-in-up">
            Rediscover the
            <span className="text-accent block drop-shadow-sm">Power of Millets</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered dietary intelligence, expert-crafted therapeutic recipes, and personalized nutrition plans — all rooted in India's ancient grain wisdom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-accent text-primary font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-lg"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-accent text-primary font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/encyclopedia"
                  className="bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all text-lg"
                >
                  Explore Millets
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-heading font-bold text-primary">{s.value}</p>
                <p className="text-sm text-stone-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <span className="text-accent font-bold tracking-widest uppercase text-xs">Everything You Need</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mt-2">
            A Complete Millet Ecosystem
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-8 border border-stone-100 hover:border-secondary hover:shadow-xl transition-all group"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-heading font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                {f.title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-6">{f.desc}</p>
              <Link
                to={f.link}
                className="inline-flex items-center text-secondary font-semibold text-sm hover:text-primary transition-colors group-hover:translate-x-1"
              >
                {f.linkText} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* AI Highlight Banner */}
      <section className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-accent font-bold uppercase tracking-widest text-xs">AI-Powered</span>
            <h2 className="text-4xl font-heading font-bold mt-2 mb-4">
              Turn Your Doctor's Note Into a Diet Plan
            </h2>
            <p className="text-white/70 leading-relaxed mb-8">
              Simply paste your medical prescription or lab report. Our Gemini AI reads it, extracts your therapeutic targets, and recommends the exact millets and recipes tailored to your condition.
            </p>
            <Link
              to={isAuthenticated ? '/doctor-note' : '/register'}
              className="bg-accent text-primary font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-all inline-block"
            >
              Try the AI Interpreter
            </Link>
          </div>
          <div className="bg-white/10 rounded-2xl p-8 border border-white/20 font-mono text-sm space-y-3 text-white/80">
            <p className="text-accent font-bold mb-4">// AI Output Example</p>
            <p>📋 <span className="text-white">Condition:</span> Type 2 Diabetes</p>
            <p>🌾 <span className="text-white">Recommended:</span> Finger Millet (Ragi)</p>
            <p>📉 <span className="text-white">GI Score:</span> 54 — Low Glycemic</p>
            <p>🍳 <span className="text-white">Meal Plan:</span> Ragi Dosa, Mudde, Porridge</p>
            <p>✅ <span className="text-white">Daily Target:</span> 80–100g millet carbs</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream text-center py-20 px-4">
        <h2 className="text-4xl font-heading font-bold text-primary mb-4">
          Your Health Journey Starts Here
        </h2>
        <p className="text-stone-500 max-w-lg mx-auto mb-8">
          Join thousands rediscovering millets as a path to sustainable, therapeutic nutrition.
        </p>
        {!isAuthenticated && (
          <Link
            to="/register"
            className="bg-primary text-cream font-bold px-10 py-4 rounded-xl hover:bg-secondary transition-all shadow-lg hover:-translate-y-0.5 inline-block text-lg"
          >
            Create Your Free Account
          </Link>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white/60 text-center py-6 text-sm">
        <p>Built with ❤️ for a sustainable and healthier future · MilletVerse © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Home;
