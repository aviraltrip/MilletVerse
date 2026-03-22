import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';

const ExpertDirectory = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await api.get('/experts');
        setExperts(res.data);
      } catch (err) {
        setError('Failed to fetch experts directory.');
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">Our Practitioners</span>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">Millet Experts</h1>
        <p className="text-lg text-stone-600">Connect with certified nutritionists, chefs, and health practitioners leading the millet revolution.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-danger py-10 bg-danger/5 rounded-xl border border-danger/20">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experts.map(expert => (
            <div key={expert._id} className="bg-white rounded-2xl border border-stone-100 p-8 shadow-sm hover:shadow-xl transition-all group hover:-translate-y-1">
              <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center text-3xl font-heading font-bold mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                {expert.name.charAt(0)}
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-1 group-hover:text-primary transition-colors">{expert.name}</h3>
              <p className="text-stone-500 font-medium mb-4">{expert.specialty}</p>
              
              <div className="mb-6">
                <span className="inline-block bg-stone-100 text-stone-600 text-xs px-2 py-1 rounded font-mono">{expert.credentials}</span>
              </div>
              
              <p className="text-stone-600 text-sm line-clamp-3 mb-8">{expert.bio}</p>
              
              <Link to={`/experts/${expert._id}`} className="inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors uppercase tracking-wider text-xs">
                View Profile
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpertDirectory;
