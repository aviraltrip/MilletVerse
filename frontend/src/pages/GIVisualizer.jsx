import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import api from '../api/axiosInstance';

const COMMON_GRAINS = [
  { name: 'White Rice', gi: 73, carbsPer100g: 28 },
  { name: 'Whole Wheat', gi: 68, carbsPer100g: 71 },
  { name: 'Oats', gi: 55, carbsPer100g: 66 },
];

const GIVisualizer = () => {
  const [millets, setMillets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Calculator State
  const [selectedGrain1, setSelectedGrain1] = useState('');
  const [portion1, setPortion1] = useState(100);
  
  const [selectedGrain2, setSelectedGrain2] = useState('');
  const [portion2, setPortion2] = useState(100);

  useEffect(() => {
    const fetchMillets = async () => {
      try {
        const res = await api.get('/millets');
        setMillets(res.data);
        if (res.data.length > 0) {
           setSelectedGrain1(res.data[0].name);
           setSelectedGrain2('White Rice');
        }
      } catch (err) {
        console.error('Failed to fetch millets');
      } finally {
        setLoading(false);
      }
    };
    fetchMillets();
  }, []);

  const allGrains = [
    ...millets.map(m => ({ name: m.name, gi: m.nutrients.gi, carbsPer100g: m.nutrients.carbs })),
    ...COMMON_GRAINS
  ];

  const calculateGL = (grainName, portionSize) => {
    const grain = allGrains.find(g => g.name === grainName);
    if (!grain) return 0;
    
    // GL = (GI * Net Carbs in portion) / 100
    // Net Carbs in portion = (carbsPer100g / 100) * portionSize
    const carbsInPortion = (grain.carbsPer100g / 100) * portionSize;
    return (grain.gi * carbsInPortion) / 100;
  };

  const getGlLevelInfo = (gl) => {
    if (gl <= 10) return { label: 'Low', color: '#40916C' }; // secondary
    if (gl <= 19) return { label: 'Medium', color: '#D4A017' }; // accent
    return { label: 'High', color: '#E63946' }; // danger
  };

  const getGiLevelInfo = (gi) => {
    if (gi <= 55) return { label: 'Low', color: '#40916C' };
    if (gi <= 69) return { label: 'Medium', color: '#D4A017' };
    return { label: 'High', color: '#E63946' };
  };

  // Prepare chart data
  const chartData = [
    {
      name: selectedGrain1,
      GI: allGrains.find(g => g.name === selectedGrain1)?.gi || 0,
      GL: parseFloat(calculateGL(selectedGrain1, portion1).toFixed(1)),
    },
    {
      name: selectedGrain2,
      GI: allGrains.find(g => g.name === selectedGrain2)?.gi || 0,
      GL: parseFloat(calculateGL(selectedGrain2, portion2).toFixed(1)),
    }
  ];

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  const g1 = allGrains.find(g => g.name === selectedGrain1);
  const g2 = allGrains.find(g => g.name === selectedGrain2);
  const gl1 = calculateGL(selectedGrain1, portion1);
  const gl2 = calculateGL(selectedGrain2, portion2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">Metabolic Insights</span>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">GI & GL Visualizer</h1>
        <p className="text-lg text-stone-600">
          Compare the Glycemic Index (GI) and Glycemic Load (GL) of ancient millets against modern staples to make informed dietary choices.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Calculator Controls */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
             <h3 className="text-xl font-bold text-stone-800 mb-6">Food 1</h3>
             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-bold text-stone-500 uppercase tracking-wide mb-2">Select Grain</label>
                   <select 
                     value={selectedGrain1} 
                     onChange={(e) => setSelectedGrain1(e.target.value)}
                     className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-secondary transition-all outline-none bg-white font-medium"
                   >
                     <optgroup label="Millets">
                       {millets.map(m => <option key={m._id} value={m.name}>{m.name}</option>)}
                     </optgroup>
                     <optgroup label="Common Staples">
                       {COMMON_GRAINS.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
                     </optgroup>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-stone-500 uppercase tracking-wide mb-2 flex justify-between">
                     Portion Size
                     <span className="text-primary">{portion1}g</span>
                   </label>
                   <input 
                     type="range" 
                     min="10" 
                     max="500" 
                     step="10" 
                     value={portion1} 
                     onChange={(e) => setPortion1(Number(e.target.value))}
                     className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-primary"
                   />
                </div>
                
                {g1 && (
                  <div className="pt-4 mt-4 border-t border-stone-100 grid grid-cols-2 gap-4">
                     <div>
                        <span className="block text-[10px] text-stone-400 uppercase font-bold tracking-wider mb-1">GI Level</span>
                        <div className="flex items-center gap-2">
                           <span className="text-2xl font-bold" style={{color: getGiLevelInfo(g1.gi).color}}>{g1.gi}</span>
                           <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase" style={{backgroundColor: `${getGiLevelInfo(g1.gi).color}20`, color: getGiLevelInfo(g1.gi).color}}>
                             {getGiLevelInfo(g1.gi).label}
                           </span>
                        </div>
                     </div>
                     <div>
                        <span className="block text-[10px] text-stone-400 uppercase font-bold tracking-wider mb-1">Total GL</span>
                        <div className="flex items-center gap-2">
                           <span className="text-2xl font-bold" style={{color: getGlLevelInfo(gl1).color}}>{gl1.toFixed(1)}</span>
                           <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase" style={{backgroundColor: `${getGlLevelInfo(gl1).color}20`, color: getGlLevelInfo(gl1).color}}>
                             {getGlLevelInfo(gl1).label}
                           </span>
                        </div>
                     </div>
                  </div>
                )}
             </div>
           </div>

           <div className="flex justify-center">
              <div className="bg-stone-100 p-3 rounded-full text-stone-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
              </div>
           </div>

           <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
             <h3 className="text-xl font-bold text-stone-800 mb-6">Food 2</h3>
             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-bold text-stone-500 uppercase tracking-wide mb-2">Select Grain</label>
                   <select 
                     value={selectedGrain2} 
                     onChange={(e) => setSelectedGrain2(e.target.value)}
                     className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-secondary transition-all outline-none bg-white font-medium"
                   >
                     <optgroup label="Common Staples">
                       {COMMON_GRAINS.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
                     </optgroup>
                     <optgroup label="Millets">
                       {millets.map(m => <option key={m._id} value={m.name}>{m.name}</option>)}
                     </optgroup>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-stone-500 uppercase tracking-wide mb-2 flex justify-between">
                     Portion Size
                     <span className="text-primary">{portion2}g</span>
                   </label>
                   <input 
                     type="range" 
                     min="10" 
                     max="500" 
                     step="10" 
                     value={portion2} 
                     onChange={(e) => setPortion2(Number(e.target.value))}
                     className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-primary"
                   />
                </div>
                
                {g2 && (
                  <div className="pt-4 mt-4 border-t border-stone-100 grid grid-cols-2 gap-4">
                     <div>
                        <span className="block text-[10px] text-stone-400 uppercase font-bold tracking-wider mb-1">GI Level</span>
                        <div className="flex items-center gap-2">
                           <span className="text-2xl font-bold" style={{color: getGiLevelInfo(g2.gi).color}}>{g2.gi}</span>
                           <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase" style={{backgroundColor: `${getGiLevelInfo(g2.gi).color}20`, color: getGiLevelInfo(g2.gi).color}}>
                             {getGiLevelInfo(g2.gi).label}
                           </span>
                        </div>
                     </div>
                     <div>
                        <span className="block text-[10px] text-stone-400 uppercase font-bold tracking-wider mb-1">Total GL</span>
                        <div className="flex items-center gap-2">
                           <span className="text-2xl font-bold" style={{color: getGlLevelInfo(gl2).color}}>{gl2.toFixed(1)}</span>
                           <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase" style={{backgroundColor: `${getGlLevelInfo(gl2).color}20`, color: getGlLevelInfo(gl2).color}}>
                             {getGlLevelInfo(gl2).label}
                           </span>
                        </div>
                     </div>
                  </div>
                )}
             </div>
           </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 pt-10 flex-grow">
              <h3 className="text-xl font-bold text-stone-800 mb-8 text-center flex items-center justify-center gap-2">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center">📊</span>
                Visual Comparison
              </h3>
              
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barGap={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                    <XAxis dataKey="name" tick={{fill: '#78716c', fontWeight: 600}} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" orientation="left" stroke="#40916C" tick={{fill: '#40916C'}} axisLine={false} tickLine={false} label={{ value: 'Glycemic Index', angle: -90, position: 'insideLeft', fill: '#40916C', offset: 0 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#D4A017" tick={{fill: '#D4A017'}} axisLine={false} tickLine={false} label={{ value: 'Glycemic Load', angle: 90, position: 'insideRight', fill: '#D4A017', offset: 0 }} />
                    <Tooltip cursor={{fill: '#fafaf9'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Legend wrapperStyle={{paddingTop: '30px'}} />
                    <Bar yAxisId="left" dataKey="GI" name="Glycemic Index (GI)" radius={[8, 8, 8, 8]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-gi-${index}`} fill={getGiLevelInfo(entry.GI).color} />
                      ))}
                    </Bar>
                    <Bar yAxisId="right" dataKey="GL" name="Glycemic Load (GL) for selected portion" radius={[8, 8, 8, 8]}>
                       {chartData.map((entry, index) => (
                        <Cell key={`cell-gl-${index}`} fill={getGlLevelInfo(entry.GL).color} opacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-cream/50 rounded-3xl p-8 border border-earth/10">
             <h4 className="font-bold text-primary mb-3">Understanding the Metrics</h4>
             <div className="grid md:grid-cols-2 gap-6 text-sm text-stone-700 leading-relaxed">
                <div>
                  <strong className="block text-stone-800 mb-1">Glycemic Index (GI)</strong>
                  Measures how quickly a food causes blood sugar levels to rise. A GI of 55 or less is considered low. Millets generally have a low to medium GI compared to refined grains.
                </div>
                <div>
                  <strong className="block text-stone-800 mb-1">Glycemic Load (GL)</strong>
                  Factors in the portion size (net carbohydrates). Even if a food has a high GI, eating a very small amount will result in a low glycemic load. A GL &le; 10 is considered low.
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GIVisualizer;
