import React from 'react';

const MilletCard = ({ millet }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-secondary/10 overflow-hidden flex flex-col h-full hover:-translate-y-2 transform ring-1 ring-primary/5 hover:ring-primary/20 group">
      <div className="h-48 bg-stone-100 relative overflow-hidden flex items-center justify-center border-b border-stone-100">
        {millet.image ? (
          <img 
            src={millet.image} 
            alt={millet.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <div className="text-primary/10">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-primary shadow-sm border border-primary/5 capitalize">
          {millet.season}
        </div>
      </div>
      
      <div className="p-6 border-b border-primary/5 bg-primary/[0.02]">
        <h3 className="text-2xl font-heading font-bold text-primary mb-1 relative z-10">{millet.name}</h3>
        <p className="text-sm text-earth italic relative z-10">{millet.localNames.join(', ')}</p>
      </div>
      
      <div className="p-6 flex-grow flex flex-col gap-4 bg-white">
        <p className="text-stone-600 text-sm leading-relaxed line-clamp-3" title={millet.description}>{millet.description}</p>
        
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="bg-cream p-3 rounded-xl border border-earth/5 flex flex-col items-center justify-center text-center hover:bg-cream/80 transition-colors">
            <span className="block text-xs text-stone-500 mb-1">Protein</span>
            <span className="font-semibold text-primary">{millet.nutrients.protein}g</span>
          </div>
          <div className="bg-cream p-3 rounded-xl border border-earth/5 flex flex-col items-center justify-center text-center hover:bg-cream/80 transition-colors">
            <span className="block text-xs text-stone-500 mb-1">Fiber</span>
            <span className="font-semibold text-primary">{millet.nutrients.fiber}g</span>
          </div>
          <div className="bg-cream p-3 rounded-xl border border-earth/5 flex flex-col items-center justify-center text-center hover:bg-cream/80 transition-colors">
            <span className="block text-xs text-stone-500 mb-1">Calcium</span>
            <span className="font-semibold text-primary">{millet.nutrients.calcium}mg</span>
          </div>
          <div className="bg-cream p-3 rounded-xl border border-earth/5 flex flex-col items-center justify-center text-center hover:bg-cream/80 transition-colors">
            <span className="block text-xs text-stone-500 mb-1">GI</span>
            <span className={`font-semibold ${millet.nutrients.gi > 55 ? 'text-accent' : 'text-secondary'}`}>{millet.nutrients.gi}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-stone-100">
          <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Therapeutic For</h4>
          <div className="flex flex-wrap gap-2">
            {millet.conditions.map((condition) => (
              <span key={condition} className="px-3 py-1.5 bg-secondary/10 text-secondary text-xs rounded-full capitalize font-medium">
                {condition}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilletCard;
