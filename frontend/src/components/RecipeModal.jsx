import React from 'react';

const RecipeModal = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex justify-between items-center z-10">
          <h2 className="text-2xl font-heading font-bold text-primary">{recipe.title}</h2>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-danger rounded-full hover:bg-danger/10 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-6">
             <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs rounded-full font-medium">{recipe.milletType}</span>
             <span className="px-3 py-1 bg-earth/10 text-earth text-xs rounded-full font-medium flex items-center gap-1">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               {recipe.cookTime} min
             </span>
             <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-full font-medium capitalize border border-stone-200">{recipe.difficulty}</span>
             {recipe.isExpertRecipe && (
               <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium border border-accent/20 flex items-center gap-1">
                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                 Expert Recipe
               </span>
             )}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-stone-800 border-b border-stone-200 pb-2 mb-4">Ingredients</h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-stone-700">{item.name}</span>
                    <span className="text-stone-500 font-medium bg-stone-50 px-2 py-0.5 rounded border border-stone-200">{item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-cream p-5 rounded-xl border border-secondary/10">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-secondary/10 pb-2">Nutritional Facts</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><span className="block text-xs text-stone-500">Calories</span><span className="font-semibold text-stone-800">{recipe.nutritionalBreakdown.calories} kcal</span></div>
                <div><span className="block text-xs text-stone-500">Protein</span><span className="font-semibold text-stone-800">{recipe.nutritionalBreakdown.protein}g</span></div>
                <div><span className="block text-xs text-stone-500">Carbs</span><span className="font-semibold text-stone-800">{recipe.nutritionalBreakdown.carbs}g</span></div>
                <div><span className="block text-xs text-stone-500">Fiber</span><span className="font-semibold text-stone-800">{recipe.nutritionalBreakdown.fiber}g</span></div>
              </div>
              {recipe.healthLabels && recipe.healthLabels.length > 0 && (
                <div className="mt-4 pt-4 border-t border-earth/10">
                  <div className="flex flex-wrap gap-1">
                    {recipe.healthLabels.map((label, idx) => (
                      <span key={idx} className="text-[10px] uppercase font-bold text-secondary bg-white px-2 py-1 rounded shadow-sm border border-secondary/20">{label}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
             <h3 className="text-lg font-bold text-stone-800 border-b border-stone-200 pb-2 mb-4">Instructions</h3>
             <ol className="space-y-4">
               {recipe.steps.map((step, idx) => (
                 <li key={idx} className="flex gap-4 group">
                   <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-secondary/10 text-secondary font-bold text-sm shadow-sm group-hover:bg-secondary group-hover:text-white transition-colors">
                     {idx + 1}
                   </div>
                   <p className="text-stone-600 leading-relaxed pt-1">{step}</p>
                 </li>
               ))}
             </ol>
          </div>
          
          {recipe.preparationNotes && (
            <div className="mt-8 p-4 bg-accent/5 border border-accent/20 rounded-xl text-sm italic text-stone-700 flex gap-3">
              <span className="text-accent text-xl">💡</span>
              <p>{recipe.preparationNotes}</p>
            </div>
          )}
          
          <div className="mt-8 pt-4 border-t border-stone-100 flex justify-between items-center text-xs text-stone-400">
             <span>Created by {recipe.createdBy?.name || 'Community'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
