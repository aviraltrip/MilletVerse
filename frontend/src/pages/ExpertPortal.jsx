import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import RecipeModal from '../components/RecipeModal';

const ExpertPortal = () => {
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' or 'my-recipes'
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    milletType: 'Finger Millet',
    ingredientsText: '',
    stepsText: '',
    tagsText: '',
    cookTime: '',
    difficulty: 'medium',
    healthLabelsText: '',
    calories: '',
    protein: '',
    carbs: '',
    fiber: '',
    preparationNotes: ''
  });
  
  const [submitStatus, setSubmitStatus] = useState({ status: '', message: '' });

  const fetchMyRecipes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/recipes/me');
      setMyRecipes(res.data);
    } catch (error) {
      console.error('Failed to fetch recipes', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-recipes') {
      fetchMyRecipes();
    }
  }, [activeTab]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ status: 'loading', message: 'Submitting recipe...' });
    
    try {
      // Parse multi-line and comma-separated text into arrays
      const ingredients = formData.ingredientsText.split('\n').filter(i => i.trim() !== '').map(line => {
        const parts = line.split('-');
        return { 
          name: parts[0]?.trim() || '', 
          quantity: parts[1]?.trim() || 'to taste' 
        };
      });
      
      const steps = formData.stepsText.split('\n').filter(s => s.trim() !== '');
      const tags = formData.tagsText.split(',').map(t => t.trim()).filter(t => t !== '');
      const healthLabels = formData.healthLabelsText.split(',').map(t => t.trim()).filter(t => t !== '');
      
      const recipeData = {
        title: formData.title,
        milletType: formData.milletType,
        ingredients,
        steps,
        tags,
        cookTime: Number(formData.cookTime),
        difficulty: formData.difficulty,
        healthLabels,
        nutritionalBreakdown: {
          calories: Number(formData.calories) || 0,
          protein: Number(formData.protein) || 0,
          carbs: Number(formData.carbs) || 0,
          fiber: Number(formData.fiber) || 0
        },
        preparationNotes: formData.preparationNotes
      };

      await api.post('/recipes', recipeData);
      setSubmitStatus({ status: 'success', message: 'Recipe successfully submitted and published!' });
      
      // Reset form
      setFormData({
        title: '', milletType: 'Finger Millet', ingredientsText: '', stepsText: '', tagsText: '', 
        cookTime: '', difficulty: 'medium', healthLabelsText: '', calories: '', protein: '', carbs: '', fiber: '', preparationNotes: ''
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => setSubmitStatus({ status: '', message: '' }), 3000);

    } catch (error) {
      setSubmitStatus({ 
        status: 'error', 
        message: error.response?.data?.message || 'Failed to submit recipe. Please try again.' 
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">Expert Dashboard</span>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">Culinary Portal</h1>
        <p className="text-lg text-stone-600">Share your millet expertise and healthy recipes with the world.</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="bg-white rounded-full shadow-sm border border-stone-200 p-1 flex">
          <button 
            onClick={() => setActiveTab('submit')}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'submit' ? 'bg-primary text-white shadow-md' : 'text-stone-500 hover:text-stone-800'}`}
          >
            Submit a Recipe
          </button>
          <button 
            onClick={() => setActiveTab('my-recipes')}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'my-recipes' ? 'bg-primary text-white shadow-md' : 'text-stone-500 hover:text-stone-800'}`}
          >
            My Recipes
          </button>
        </div>
      </div>

      {activeTab === 'submit' && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-stone-100 p-8 md:p-12 animate-fade-in">
          {submitStatus.message && (
            <div className={`mb-8 p-4 rounded-xl border ${submitStatus.status === 'success' ? 'bg-secondary/10 border-secondary/20 text-secondary' : submitStatus.status === 'error' ? 'bg-danger/10 border-danger/20 text-danger' : 'bg-accent/10 border-accent/20 text-accent'} font-medium flex items-center gap-3`}>
              {submitStatus.status === 'success' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
              {submitStatus.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-2">Basic Info</h3>
                <div>
                  <label className="block text-sm font-bold text-stone-600 mb-2">Recipe Title *</label>
                  <input required name="title" value={formData.title} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-secondary outline-none transition-all" placeholder="e.g. Sprouted Ragi Dosa" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-stone-600 mb-2">Millet Type *</label>
                    <select required name="milletType" value={formData.milletType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-secondary outline-none transition-all bg-white">
                      <option>Finger Millet</option>
                      <option>Pearl Millet</option>
                      <option>Foxtail Millet</option>
                      <option>Sorghum</option>
                      <option>Barnyard Millet</option>
                      <option>Little Millet</option>
                      <option>Kodo Millet</option>
                      <option>Browntop Millet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-600 mb-2">Cook Time (mins) *</label>
                    <input required name="cookTime" value={formData.cookTime} onChange={handleChange} type="number" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-secondary outline-none transition-all" placeholder="e.g. 25" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-600 mb-2">Difficulty *</label>
                  <select required name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-secondary outline-none transition-all bg-white">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-600 mb-2">Tags (comma-separated)</label>
                  <input name="tagsText" value={formData.tagsText} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-secondary outline-none transition-all" placeholder="e.g. Breakfast, Vegan, Gluten-Free" />
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-2">Preparation</h3>
                <div>
                   <label className="block text-sm font-bold text-stone-600 mb-2">Ingredients (One per line) *<br/><span className="text-xs text-stone-400 font-normal">Format: Ingredient Name - Quantity (e.g. Ragi flour - 1 cup)</span></label>
                   <textarea required name="ingredientsText" value={formData.ingredientsText} onChange={handleChange} rows="4" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-secondary outline-none transition-all resize-none"></textarea>
                </div>
                <div>
                   <label className="block text-sm font-bold text-stone-600 mb-2">Steps (One per line) *</label>
                   <textarea required name="stepsText" value={formData.stepsText} onChange={handleChange} rows="4" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-secondary outline-none transition-all resize-none"></textarea>
                </div>
                <div>
                   <label className="block text-sm font-bold text-stone-600 mb-2">Chef's Notes (Optional)</label>
                   <textarea name="preparationNotes" value={formData.preparationNotes} onChange={handleChange} rows="2" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-secondary outline-none transition-all resize-none"></textarea>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-stone-100">
              <h3 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-2">Health & Nutrition</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-stone-600 mb-2">Therapeutic Labels (comma-separated)</label>
                  <input name="healthLabelsText" value={formData.healthLabelsText} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-secondary outline-none transition-all" placeholder="e.g. diabetes-friendly, iron-rich" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Calories</label>
                    <input name="calories" value={formData.calories} onChange={handleChange} type="number" className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-secondary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Protein (g)</label>
                    <input name="protein" value={formData.protein} onChange={handleChange} type="number" step="0.1" className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-secondary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Carbs (g)</label>
                    <input name="carbs" value={formData.carbs} onChange={handleChange} type="number" step="0.1" className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-secondary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Fiber (g)</label>
                    <input name="fiber" value={formData.fiber} onChange={handleChange} type="number" step="0.1" className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-secondary outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 flex justify-end">
              <button 
                type="submit" 
                disabled={submitStatus.status === 'loading'}
                className="px-10 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {submitStatus.status === 'loading' ? 'Publishing...' : 'Publish Recipe'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'my-recipes' && (
        <div className="animate-fade-in">
          {loading ? (
             <div className="flex justify-center items-center py-20">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
             </div>
          ) : myRecipes.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-2xl border border-stone-100 max-w-2xl mx-auto shadow-sm">
                <svg className="w-16 h-16 mx-auto text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                <p className="text-stone-500 text-lg mb-6">You haven't submitted any recipes yet.</p>
                <button onClick={() => setActiveTab('submit')} className="px-6 py-2 bg-secondary/10 text-secondary font-bold rounded-full hover:bg-secondary/20 transition-colors">Start Creating</button>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRecipes.map((recipe) => (
                <div key={recipe._id} onClick={() => setSelectedRecipe(recipe)} className="bg-white rounded-xl shadow-sm hover:shadow-md border border-stone-100 p-6 cursor-pointer transition-all hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-2 py-1 rounded">{recipe.milletType}</span>
                    <span className="text-xs text-stone-400">{new Date(recipe.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-800 mb-2 truncate">{recipe.title}</h3>
                  <div className="flex gap-4 text-sm text-stone-500">
                    <span className="flex items-center gap-1">⏰ {recipe.cookTime}m</span>
                    <span className="flex items-center gap-1 capitalize">📊 {recipe.difficulty}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-stone-50 flex justify-between items-center text-xs">
                    <span className={`px-2 py-1 rounded font-bold ${recipe.approvedStatus ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {recipe.approvedStatus ? 'Published' : 'Pending Review'}
                    </span>
                    <span className="text-primary font-medium hover:underline">View Details &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
    </div>
  );
};

export default ExpertPortal;
