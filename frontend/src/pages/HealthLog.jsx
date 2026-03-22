import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api/axiosInstance';

const HealthLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    energyLevel: 5,
    digestion: 'good',
    weight: '',
    bloodSugar: '',
    notes: ''
  });

  const fetchLogs = async () => {
    try {
      const res = await api.get('/health-logs');
      setLogs(res.data);
    } catch (err) {
      setError('Failed to fetch health logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');
    try {
      const payload = {
        ...formData,
        energyLevel: Number(formData.energyLevel),
        weight: formData.weight ? Number(formData.weight) : undefined,
        bloodSugar: formData.bloodSugar ? Number(formData.bloodSugar) : undefined
      };
      await api.post('/health-logs', payload);
      setSubmitStatus('success');
      setFormData({ energyLevel: 5, digestion: 'good', weight: '', bloodSugar: '', notes: '' });
      fetchLogs();
      setTimeout(() => setSubmitStatus(''), 3000);
    } catch (err) {
      setSubmitStatus('error');
    }
  };

  // Format data for Recharts
  const chartData = logs.map(log => {
    const d = new Date(log.date);
    return {
      date: `${d.getMonth()+1}/${d.getDate()}`,
      fullDate: d.toLocaleDateString(),
      weight: log.weight,
      bloodSugar: log.bloodSugar,
      energy: log.energyLevel
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">Wellness Journal</span>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">Health Tracker</h1>
        <p className="text-lg text-stone-600">
          Log your daily metrics and visualize the impact of your millet-based diet over time.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Check-in Form */}
        <div className="lg:col-span-4 lg:col-start-1">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 sticky top-8">
            <h3 className="text-2xl font-bold text-stone-800 mb-6">Daily Check-in</h3>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-secondary/10 text-secondary border border-secondary/20 rounded-xl font-medium flex gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Log saved successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
               <div>
                  <label className="block text-sm font-bold text-stone-600 mb-2 flex justify-between">
                    Energy Level ⚡ 
                    <span className="text-primary">{formData.energyLevel}/10</span>
                  </label>
                  <input type="range" name="energyLevel" min="1" max="10" value={formData.energyLevel} onChange={handleChange} className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-primary" />
               </div>

               <div>
                  <label className="block text-sm font-bold text-stone-600 mb-2">Digestion 🌿</label>
                  <select name="digestion" value={formData.digestion} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-secondary outline-none transition-all bg-white font-medium">
                    <option value="poor">Poor</option>
                    <option value="fair">Fair</option>
                    <option value="good">Good</option>
                    <option value="excellent">Excellent</option>
                  </select>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-stone-600 mb-2">Weight (kg)</label>
                    <input type="number" name="weight" step="0.1" value={formData.weight} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-secondary outline-none transition-all" placeholder="e.g. 70.5" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-600 mb-2">Blood Sugar</label>
                    <input type="number" name="bloodSugar" value={formData.bloodSugar} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-secondary outline-none transition-all" placeholder="e.g. 110" />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-bold text-stone-600 mb-2">Notes 📝</label>
                  <textarea name="notes" rows="3" value={formData.notes} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-secondary outline-none transition-all resize-none" placeholder="How do you feel today?"></textarea>
               </div>

               <button disabled={submitStatus === 'loading'} type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all disabled:opacity-70 disabled:hover:translate-y-0">
                  {submitStatus === 'loading' ? 'Saving...' : 'Save Log'}
               </button>
            </form>
          </div>
        </div>

        {/* Charts & History */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 flex-grow">
            <h3 className="text-xl font-bold text-stone-800 mb-8 flex items-center gap-3">
              <span className="bg-accent/10 text-accent w-10 h-10 rounded-full flex items-center justify-center text-xl">📈</span>
              Trend Analysis
            </h3>
            
            {loading ? (
               <div className="flex justify-center items-center h-64">
                 <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
               </div>
            ) : chartData.length < 2 ? (
               <div className="h-64 flex flex-col items-center justify-center text-stone-400 border-2 border-dashed border-stone-200 rounded-2xl">
                 <span className="text-4xl mb-3">📊</span>
                 <p className="font-medium">Add at least two logs to see your trend charts.</p>
               </div>
            ) : (
               <div className="space-y-12">
                 <div className="h-64 w-full">
                   <h4 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-4">Weight Tracking (kg)</h4>
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                       <XAxis dataKey="date" tick={{fill: '#78716c', fontSize: 12}} axisLine={false} tickLine={false} />
                       <YAxis domain={['auto', 'auto']} tick={{fill: '#78716c', fontSize: 12}} axisLine={false} tickLine={false} />
                       <Tooltip cursor={{stroke: '#e7e5e4', strokeWidth: 2}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                       <Line type="monotone" dataKey="weight" stroke="#40916C" strokeWidth={3} dot={{r: 4, fill: '#40916C', strokeWidth: 0}} activeDot={{r: 6, fill: '#2D6A4F'}} connectNulls />
                     </LineChart>
                   </ResponsiveContainer>
                 </div>
                 
                 <div className="h-64 w-full">
                   <h4 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-4">Blood Sugar Levels</h4>
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                       <XAxis dataKey="date" tick={{fill: '#78716c', fontSize: 12}} axisLine={false} tickLine={false} />
                       <YAxis domain={['auto', 'auto']} tick={{fill: '#78716c', fontSize: 12}} axisLine={false} tickLine={false} />
                       <Tooltip cursor={{stroke: '#e7e5e4', strokeWidth: 2}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                       <Line type="monotone" dataKey="bloodSugar" stroke="#E63946" strokeWidth={3} dot={{r: 4, fill: '#E63946', strokeWidth: 0}} activeDot={{r: 6}} connectNulls />
                     </LineChart>
                   </ResponsiveContainer>
                 </div>
               </div>
            )}
          </div>
          
          {logs.length > 0 && (
             <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
               <h3 className="text-xl font-bold text-stone-800 mb-6 font-heading">Recent Logs</h3>
               <div className="space-y-4">
                 {logs.slice().reverse().slice(0, 5).map(log => (
                   <div key={log._id} className="p-4 bg-stone-50 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                      <div>
                        <span className="font-bold text-primary block">{new Date(log.date).toLocaleDateString()}</span>
                        {log.notes && <span className="text-stone-500 text-sm mt-1 block italic">"{log.notes}"</span>}
                      </div>
                      <div className="flex gap-4">
                        <div className="text-center"><span className="block text-[10px] uppercase font-bold text-stone-400">Energy</span><span className="font-semibold">{log.energyLevel}/10</span></div>
                        <div className="text-center"><span className="block text-[10px] uppercase font-bold text-stone-400">Digestion</span><span className="font-semibold capitalize">{log.digestion}</span></div>
                        {log.weight && <div className="text-center"><span className="block text-[10px] uppercase font-bold text-stone-400">Weight</span><span className="font-semibold">{log.weight}kg</span></div>}
                      </div>
                   </div>
                 ))}
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthLog;
