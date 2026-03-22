import React, { useState } from 'react';
import api from '../api/axiosInstance';
import RecipeModal from '../components/RecipeModal';

const AiRecipeGenerator = () => {
  const [ingredients, setIngredients] = useState('');
  const [condition, setCondition] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // 'saved' | 'error' | ''

  const handleGenerate = async () => {
    if (!ingredients.trim()) return;

    setLoading(true);
    setError(null);
    setGeneratedRecipe(null);

    try {
      const res = await api.post('/ai/generate-recipe', { 
        ingredientsList: ingredients, 
        condition 
      });
      setGeneratedRecipe(res.data);
    } catch (err) {
      setError('Failed to generate recipe. Please try again or simplify your ingredients list.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    try {
      const savePayload = { ...generatedRecipe, isAIGenerated: true };
      await api.post('/recipes', savePayload);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 4000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 4000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">Gemini Kitchen</span>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">AI Recipe Generator</h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
          Tell us what ingredients you have in your fridge, along with any health conditions. Our AI will craft a personalized millet recipe instantly.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden flex flex-col md:flex-row">
         {/* Form Section */}
         <div className="md:w-1/2 p-8 md:p-12 bg-cream/30">
            <h3 className="text-2xl font-bold text-stone-800 mb-6">Your Details</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-stone-600 mb-2">What ingredients do you have? *</label>
                <textarea 
                  rows="4" 
                  className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 focus:border-secondary focus:ring-0 outline-none transition-all resize-none text-stone-700 bg-white"
                  placeholder="E.g., spinach, tomatoes, ginger, garlic, and I have some finger millet flour..."
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-stone-600 mb-2">Target Health Condition (Optional)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-secondary outline-none transition-all text-stone-700 bg-white"
                  placeholder="E.g., diabetes, PCOD, high blood pressure..."
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                />
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading || !ingredients.trim()}
                className="w-full px-6 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {loading ? (
                   <>
                     <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                     Crafting Recipe...
                   </>
                ) : 'Generate Recipe 🧑‍🍳'}
              </button>
            </div>
         </div>

         {/* Result Section */}
         <div className="md:w-1/2 p-8 md:p-12 border-t md:border-t-0 md:border-l border-stone-100 bg-white">
            {loading ? (
               <div className="h-full flex flex-col items-center justify-center text-stone-400 gap-4 min-h-[300px]">
                 <div className="grid grid-cols-2 gap-2 w-16 opacity-50 animate-pulse">
                    <div className="h-6 bg-secondary rounded"></div>
                    <div className="h-6 bg-accent rounded"></div>
                    <div className="h-6 bg-earth rounded"></div>
                    <div className="h-6 bg-primary rounded"></div>
                 </div>
                 <p className="font-medium animate-pulse">Our AI chefs are thinking...</p>
               </div>
            ) : error ? (
               <div className="h-full flex flex-col items-center justify-center text-danger text-center font-medium bg-danger/5 rounded-2xl p-6 min-h-[300px]">
                 {error}
               </div>
            ) : generatedRecipe ? (
               <div className="h-full flex flex-col min-h-[300px] animate-fade-in">
                 <div className="flex justify-between items-start mb-4">
                   <span className="bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider px-2 py-1 rounded">AI Generated</span>
                   <span className="text-secondary text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-secondary/10">{generatedRecipe.milletType}</span>
                 </div>
                 
                 <h2 className="text-2xl font-bold font-heading text-primary mb-2">{generatedRecipe.title}</h2>
                 
                 <div className="flex gap-4 text-xs text-stone-500 font-medium mb-6">
                    <span>⏰ {generatedRecipe.cookTime}m cook time</span>
                    <span className="capitalize">📊 {generatedRecipe.difficulty}</span>
                 </div>
                 
                 <div className="mb-6 flex-grow">
                   <p className="text-stone-600 text-sm mb-4 line-clamp-4">
                     {generatedRecipe.preparationNotes || "A delicious, custom-tailored recipe crafted just for you using the power of ancient grains."}
                   </p>
                   
                   <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-stone-50 p-3 rounded-lg"><span className="block text-[10px] text-stone-400 uppercase">Calories</span><span className="font-bold text-stone-700">{generatedRecipe.nutritionalBreakdown?.calories}</span></div>
                      <div className="bg-stone-50 p-3 rounded-lg"><span className="block text-[10px] text-stone-400 uppercase">Protein</span><span className="font-bold text-stone-700">{generatedRecipe.nutritionalBreakdown?.protein}g</span></div>
                   </div>
                 </div>
                 
                 <div className="flex gap-4 mt-auto">
                    <button 
                      className="flex-1 px-4 py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors"
                      onClick={() => setShowModal(true)}
                    >
                      View Full Recipe
                    </button>
                    <button 
                      onClick={handleSaveRecipe}
                      className="flex-1 px-4 py-3 bg-secondary text-white font-bold rounded-xl hover:bg-primary transition-colors hover:shadow-lg"
                    >
                      {saveStatus === 'saved' ? '✅ Saved!' : saveStatus === 'error' ? '❌ Failed' : 'Save to Profile'}
                    </button>
                 </div>
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-stone-300 min-h-[300px]">
                 <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                 <p className="text-stone-400 text-center px-8">Your generated recipe will appear here.</p>
               </div>
            )}
         </div>
      </div>

      {generatedRecipe && showModal && (
         <RecipeModal recipe={generatedRecipe} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default AiRecipeGenerator;
