import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import RecipeModal from '../components/RecipeModal';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [milletFilter, setMilletFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await api.get('/recipes');
        setRecipes(res.data);
        setFilteredRecipes(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch recipes.');
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    let result = recipes;
    
    if (searchTerm) {
      result = result.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (milletFilter) {
      result = result.filter(r => r.milletType === milletFilter);
    }
    
    if (difficultyFilter) {
      result = result.filter(r => r.difficulty === difficultyFilter);
    }
    
    setFilteredRecipes(result);
  }, [searchTerm, milletFilter, difficultyFilter, recipes]);

  const uniqueMillets = [...new Set(recipes.map(r => r.milletType))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">Culinary Inspiration</span>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">
          Millet Recipes
        </h1>
        <p className="text-lg text-stone-600">
          Discover delicious, healthy, and easy-to-cook recipes featuring the goodness of ancient grains.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Search</label>
            <input 
              type="text" 
              placeholder="Search by title or tags..."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Millet Type</label>
            <select 
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all bg-white"
              value={milletFilter}
              onChange={(e) => setMilletFilter(e.target.value)}
            >
              <option value="">All Millets</option>
              {uniqueMillets.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
             <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Difficulty</label>
             <select 
               className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all bg-white"
               value={difficultyFilter}
               onChange={(e) => setDifficultyFilter(e.target.value)}
             >
               <option value="">Any Difficulty</option>
               <option value="easy">Easy</option>
               <option value="medium">Medium</option>
               <option value="hard">Hard</option>
             </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-danger py-10 bg-danger/5 rounded-xl border border-danger/20">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe) => (
            <div 
              key={recipe._id} 
              onClick={() => setSelectedRecipe(recipe)}
              className="bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="h-48 bg-stone-100 relative overflow-hidden flex items-center justify-center border-b border-stone-100">
                {recipe.image ? (
                  <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-primary/20">
                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.88 3.75 3.97V22h2.5v-9.03C11.34 12.88 13 11.12 13 9V2h-2v7zm5-4v17h2v-7h5V5c0-1.66-1.34-3-3-3h-4v3z"></path></svg>
                  </div>
                )}
                {recipe.isExpertRecipe && (
                  <div className="absolute top-3 left-3 bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm flex items-center gap-1">
                    <span>Expert</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-stone-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">
                  {recipe.cookTime} mins
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-secondary text-xs font-bold uppercase tracking-wider mb-2">{recipe.milletType}</span>
                <h3 className="text-xl font-heading font-bold text-stone-800 mb-2 group-hover:text-primary transition-colors">{recipe.title}</h3>
                
                <div className="flex flex-wrap gap-1 mt-auto pt-4">
                  {recipe.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded border border-stone-200">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && filteredRecipes.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-100 mt-8">
           <svg className="w-16 h-16 mx-auto text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
           <p className="text-stone-500 text-lg">No recipes found. Try adjusting your filters.</p>
           <button onClick={() => { setSearchTerm(''); setMilletFilter(''); setDifficultyFilter(''); }} className="mt-4 text-secondary font-medium hover:text-primary transition-colors">Reset all filters</button>
        </div>
      )}

      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
    </div>
  );
};

export default Recipes;
