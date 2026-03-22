import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import RecipeModal from '../components/RecipeModal';

const ExpertProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/experts/${id}`);
        setData(res.data);
      } catch (err) {
        setError('Failed to fetch expert profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error || !data) return (
    <div className="max-w-3xl mx-auto mt-20 p-6 bg-danger/5 border border-danger/20 text-danger rounded-xl text-center">
      {error || 'Expert not found'}
    </div>
  );

  const { expert, recipes } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <Link to="/experts" className="inline-flex items-center gap-2 text-stone-500 hover:text-primary mb-8 font-medium transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Experts
      </Link>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm sticky top-8 text-center">
             <div className="w-32 h-32 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center text-5xl font-heading font-bold mb-6">
                {expert.name.charAt(0)}
             </div>
             <h1 className="text-3xl font-bold text-stone-800 mb-2">{expert.name}</h1>
             <p className="text-secondary font-medium mb-6 uppercase tracking-wider text-sm">{expert.specialty}</p>
             
             <div className="bg-stone-50 p-4 rounded-xl mb-6 flex flex-col items-center">
                 <span className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">Credentials</span>
                 <span className="text-stone-700 font-mono text-sm">{expert.credentials}</span>
             </div>
             
             <div className="text-left mt-8">
               <h3 className="text-sm font-bold text-stone-800 uppercase tracking-widest border-b border-stone-100 pb-2 mb-4">About</h3>
               <p className="text-stone-600 leading-relaxed text-sm">{expert.bio}</p>
             </div>
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="lg:col-span-2">
           <h2 className="text-3xl font-heading font-bold text-primary mb-8 flex items-center gap-3">
             Curated Recipes
             <span className="text-sm px-3 py-1 bg-accent/10 text-accent rounded-full font-sans font-bold">{recipes.length}</span>
           </h2>
           
           {recipes.length === 0 ? (
             <div className="bg-white border border-stone-100 rounded-2xl p-12 text-center text-stone-500 shadow-sm">
               This expert hasn't published any recipes yet.
             </div>
           ) : (
             <div className="grid sm:grid-cols-2 gap-6">
               {recipes.map(recipe => (
                 <div 
                   key={recipe._id} 
                   onClick={() => setSelectedRecipe(recipe)}
                   className="bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer group flex flex-col"
                 >
                   <div className="h-40 bg-stone-50 flex items-center justify-center relative border-b border-stone-100">
                      {recipe.image ? (
                        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <span className="text-4xl">🍽️</span>
                      )}
                      <div className="absolute top-3 left-3 bg-secondary/90 backdrop-blur text-white text-[10px] uppercase font-bold px-2 py-1 rounded tracking-wider shadow-sm">
                        {recipe.milletType}
                      </div>
                   </div>
                   <div className="p-6 flex flex-col flex-grow">
                     <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-primary transition-colors">{recipe.title}</h3>
                     <div className="flex gap-4 text-xs text-stone-500 font-medium mb-4">
                        <span>⏰ {recipe.cookTime}m</span>
                        <span className="capitalize">📈 {recipe.difficulty}</span>
                     </div>
                     <div className="mt-auto flex flex-wrap gap-1">
                        {recipe.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] bg-stone-100 text-stone-500 px-2 py-1 rounded">{tag}</span>
                        ))}
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
      
      {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
    </div>
  );
};

export default ExpertProfile;
