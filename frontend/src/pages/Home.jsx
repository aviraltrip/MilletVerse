import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const engines = [
    {
      title: 'Millet Prescription Engine',
      desc: 'Get a personalized millet plan — what to eat, how much, when, and why — calibrated to your health conditions and lab values.',
      icon: '💓',
    },
    {
      title: 'Expert & Cook Portal',
      desc: 'Credentialed nutritionists and home cooks submit millet recipes with health labels, building a trusted community library.',
      icon: '🍳',
    },
    {
      title: "Doctor's Note Interpreter",
      desc: "Paste your doctor's dietary notes and lab values — AI maps them to specific millet recommendations instantly.",
      icon: '🩺',
    },
    {
      title: 'Health Log & Trends',
      desc: 'Daily check-ins track energy, digestion, weight, and blood sugar — see visible evidence that your dietary change is working.',
      icon: '📊',
    },
    {
      title: 'Store Locator & Cultivation Map',
      desc: 'Find nearby stores stocking your prescribed millets and explore which states grow which varieties across India.',
      icon: '📍',
    },
    {
      title: 'AI Recipe Generator & GI Visualizer',
      desc: 'Generate condition-specific millet recipes with AI and visualize glycemic impact compared to common Indian staples.',
      icon: '🌿',
    },
  ];

  const grains = [
    { name: 'Finger Millet (Ragi)', gi: 54, desc: 'Rich in calcium & iron, ideal for diabetics.' },
    { name: 'Foxtail Millet', gi: 50, desc: 'High iron, great for anemia & weight management.' },
    { name: 'Pearl Millet (Bajra)', gi: 55, desc: 'High protein & zinc, supports heart health.' },
    { name: 'Sorghum (Jowar)', gi: 62, desc: 'Gluten-free, rich in antioxidants.' },
    { name: 'Barnyard Millet', gi: 50, desc: 'Low calorie, ideal for weight loss diets.' },
    { name: 'Kodo Millet', gi: 49, desc: 'High fiber, supports gut health.' },
    { name: 'Little Millet', gi: 52, desc: 'Rich in B-vitamins, supports nervous system.' },
    { name: 'Proso Millet', gi: 56, desc: 'Good lecithin source, supports liver health.' },
  ];

  const conditions = [
    'Diabetes', 'Anemia', 'Obesity', 'PCOD', 'Hypertension', 'Celiac Disease', 'Thyroid Disorders'
  ];

  const steps = [
    { num: '01', title: 'Health Onboarding', desc: 'Enter your conditions, lab values, BMI, and dietary preferences.' },
    { num: '02', title: 'Get Prescription', desc: 'Receive a millet plan — type, grams, form, timing, and clinical rationale.' },
    { num: '03', title: 'Log & Track', desc: 'Daily check-ins on energy, digestion, weight, and blood sugar.' },
    { num: '04', title: 'See Results', desc: 'Trend charts show visible improvement over weeks of millet consumption.' },
  ];

  return (
    <div className="bg-cream min-h-screen font-body text-stone-800">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-full text-secondary text-xs font-bold uppercase tracking-wider">
            <span>🌿</span> Condition-Specific Dietary Intelligence
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.1] text-primary">
            Know exactly what to eat — and why it heals you
          </h1>
          <p className="text-lg text-stone-500 max-w-lg leading-relaxed">
            MilletVerse prescribes personalized millet-based meal plans for diabetes, anemia, PCOD, and more — calibrated to your lab values, not generic advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="bg-primary text-white flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold shadow-md hover:bg-secondary transition-all group"
            >
              Start Health Onboarding <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              to="/experts"
              className="border border-stone-200 bg-white/50 backdrop-blur-sm text-stone-700 px-8 py-4 rounded-xl font-bold hover:bg-white transition-all text-center"
            >
              I'm an Expert
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
            <img 
              src="/assets/hero.png" 
              alt="Millet Bowl" 
              className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700" 
            />
          </div>
          <div className="absolute -bottom-10 -left-6 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-4 animate-bounce-slow">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900 leading-tight">GI Score: 54</p>
              <p className="text-xs text-stone-500">Finger Millet vs Rice (72)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Six Engines Section */}
      <section className="bg-stone-50/50 py-24 border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-stone-900 mb-6 underline decoration-accent/30 decoration-8 underline-offset-4">
              Six engines, one health mission
            </h2>
            <p className="text-stone-500 text-lg">
              From prescription to purchase — every step of your millet health journey, covered.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {engines.map((e, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm hover:shadow-lg transition-all hover:border-secondary group">
                <div className="w-12 h-12 bg-secondary/5 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-secondary/10 transition-colors">
                  {e.icon}
                </div>
                <h3 className="text-lg font-heading font-bold text-stone-900 mb-3 group-hover:text-primary transition-colors">
                  {e.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {e.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grains Decoded Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-20 items-center">
        <div className="order-2 lg:order-1">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-stone-100">
            <img src="/assets/varieties.png" alt="Millet Varieties" className="w-full h-auto" />
          </div>
        </div>
        <div className="order-1 lg:order-2 space-y-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-stone-900 mb-4 leading-tight">
              India's most powerful grains, decoded
            </h2>
            <p className="text-stone-500 text-lg">
              Every millet profiled with glycemic index, nutrient density, health condition mapping, and seasonal availability.
            </p>
          </div>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin">
            {grains.map((g, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-center justify-between group hover:border-secondary transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">🌾</div>
                   <div>
                     <div className="flex items-center gap-3">
                       <h4 className="font-bold text-stone-800">{g.name}</h4>
                       <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-0.5 rounded tracking-wide">GI {g.gi}</span>
                     </div>
                     <p className="text-xs text-stone-500 mt-0.5">{g.desc}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions tags */}
      <section className="bg-stone-50/50 py-20 border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-heading font-bold text-stone-900 mb-4">
            Built for real health conditions
          </h2>
          <p className="text-stone-500 mb-12">
            Not generic wellness tips — clinically grounded dietary prescriptions for specific chronic conditions.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {conditions.map((c, idx) => (
              <span key={idx} className="bg-white border border-stone-200 px-6 py-3 rounded-full text-sm font-semibold text-stone-600 hover:border-primary hover:text-primary transition-all cursor-default shadow-sm">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Section */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center space-y-10">
        <div className="inline-flex items-center gap-2 bg-accent/5 border border-accent/20 px-4 py-1.5 rounded-full text-accent text-xs font-bold uppercase tracking-wider">
          👨‍🍳 For Nutritionists & Millet Experts
        </div>
        <h2 className="text-4xl md:text-6xl font-heading font-bold text-primary leading-tight">
          Share your millet expertise with thousands
        </h2>
        <p className="text-lg text-stone-500 max-w-2xl mx-auto italic">
          "Apply as a verified expert, submit clinically tagged recipes, and build your public profile on India's first condition-specific millet platform."
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/expert-apply" className="bg-accent text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-earth transition-all shadow-accent/20">
            Apply as Expert →
          </Link>
          <Link to="/experts" className="bg-stone-50 text-stone-700 border border-stone-200 px-10 py-4 rounded-xl font-bold hover:bg-stone-100 transition-all">
            See Expert Dashboard
          </Link>
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-primary text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-heading font-bold mb-4">From onboarding to outcome</h2>
            <p className="text-white/60 text-lg">Your path to clinically guided millet nutrition in four steps.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((s, idx) => (
              <div key={idx} className="space-y-6">
                <span className="text-5xl font-heading font-bold text-white/10 block leading-none">{s.num}</span>
                <h3 className="text-xl font-bold text-white leading-tight">{s.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-20 border-t border-stone-100 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">M</div>
              <span className="text-xl font-heading font-bold text-primary tracking-tight">MilletVerse</span>
            </div>
            <p className="text-stone-500 leading-relaxed max-w-xs">
              Condition-specific dietary intelligence powered by India's most nutritious grains.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:col-span-2 capitalize">
            <div className="space-y-4">
              <p className="font-bold text-stone-900">Platform</p>
              <ul className="space-y-2 text-stone-500 hover:[&>li]:text-primary transition-colors">
                <li><Link to="/dashboard">User Dashboard</Link></li>
                <li><Link to="/expert">Expert Portal</Link></li>
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/encyclopedia">Millet Encyclopedia</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="font-bold text-stone-900">Health Conditions</p>
              <ul className="space-y-2 text-stone-500 hover:[&>li]:text-primary transition-colors">
                <li><Link to="/conditions/diabetes">Diabetes</Link></li>
                <li><Link to="/conditions/anemia">Anemia</Link></li>
                <li><Link to="/conditions/obesity">Obesity</Link></li>
                <li><Link to="/conditions/pcod">PCOD</Link></li>
                <li><Link to="/conditions/hypertension">Hypertension</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-stone-50 text-center text-stone-400">
          <p>© {new Date().getFullYear()} MilletVerse. Prescriptive dietary intelligence for chronic health conditions.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
