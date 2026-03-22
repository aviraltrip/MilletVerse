import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import MilletCard from '../components/MilletCard';

const Encyclopedia = () => {
  const [millets, setMillets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMillets = async () => {
      try {
         const res = await api.get('/millets');
         setMillets(res.data);
         setLoading(false);
      } catch (err) {
         setError('Failed to load millets database.');
         setLoading(false);
      }
    };
    fetchMillets();
  }, []);

  const filteredMillets = millets.filter(millet => 
    millet.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    millet.localNames.some(name => name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    millet.conditions.some(cond => cond.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">Knowledge Base</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary mb-6 leading-tight">
          The Millet Encyclopedia
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed">
          Discover the nutritional profiles, therapeutic benefits, and ancient wisdom behind these powerful climate-resilient grains.
        </p>
      </div>

      <div className="mb-12 max-w-2xl mx-auto">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search by name, local name, or therapeutic condition (e.g. diabetes)..."
            className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-stone-100 shadow-sm focus:shadow-md focus:border-secondary focus:ring-0 outline-none transition-all text-stone-700 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-stone-300 group-focus-within:text-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
          <p className="text-stone-500 animate-pulse">Loading ancient grains...</p>
        </div>
      ) : error ? (
        <div className="text-center text-danger py-10 bg-danger/5 rounded-2xl border border-danger/20 max-w-2xl mx-auto">
          <p className="font-medium">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredMillets.map((millet) => (
            <MilletCard key={millet._id} millet={millet} />
          ))}
        </div>
      )}
      
      {!loading && !error && filteredMillets.length === 0 && (
         <div className="text-center py-20">
           <div className="text-stone-300 mb-4">
             <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           </div>
           <p className="text-stone-500 text-lg">No millets found matching "{searchTerm}".</p>
           <button onClick={() => setSearchTerm('')} className="mt-4 text-secondary hover:text-primary font-medium transition-colors">Clear search</button>
         </div>
      )}
    </div>
  );
};

export default Encyclopedia;
