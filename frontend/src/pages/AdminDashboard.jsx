import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import RecipeModal from '../components/RecipeModal';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, experts, recipes
  const [stats, setStats] = useState(null);
  const [pendingExperts, setPendingExperts] = useState([]);
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      setError('Failed to fetch admin statistics.');
    }
  };

  const fetchPendingExperts = async () => {
    try {
      const res = await api.get('/admin/pending-experts');
      setPendingExperts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPendingRecipes = async () => {
    try {
      const res = await api.get('/admin/pending-recipes');
      setPendingRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchPendingExperts(), fetchPendingRecipes()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveExpert = async (id) => {
    try {
      await api.put(`/admin/experts/${id}/approve`);
      await fetchPendingExperts();
      await fetchStats();
      showToast('Expert approved successfully!');
    } catch (err) {
      showToast('Failed to approve expert.', 'error');
    }
  };

  const handleApproveRecipe = async (id) => {
    try {
      await api.put(`/admin/recipes/${id}/approve`);
      await fetchPendingRecipes();
      await fetchStats();
      if (selectedRecipe && selectedRecipe._id === id) {
        setSelectedRecipe(null);
      }
      showToast('Recipe approved successfully!');
    } catch (err) {
      showToast('Failed to approve recipe.', 'error');
    }
  };

  if (loading) return <div className="flex justify-center items-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (error) return <div className="text-center mt-20 text-danger">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-lg font-semibold text-sm transition-all ${
          toast.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-secondary/10 text-secondary border border-secondary/20'
        }`}>
          {toast.type === 'error' ? '⚠️' : '✅'} {toast.msg}
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-1 block">Command Center</span>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-stone-800">Admin Dashboard</h1>
        </div>
        <div className="flex gap-2 p-1 bg-stone-100/80 backdrop-blur rounded-xl border border-stone-200 shadow-sm overflow-x-auto w-full md:w-auto">
          {['overview', 'users', 'experts', 'recipes'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-4 py-2 rounded-lg text-sm font-bold capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-white text-primary shadow' : 'text-stone-500 hover:text-stone-800'}`}
             >
               {tab} {(tab === 'experts' && pendingExperts.length > 0) ? `(${pendingExperts.length})` : ''}
               {(tab === 'recipes' && pendingRecipes.length > 0) ? `(${pendingRecipes.length})` : ''}
             </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && stats && (
        <div className="space-y-8 animate-fade-in-up">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <MetricCard title="Users" value={stats.metrics.totalUsers} color="bg-secondary" textColor="text-secondary" />
            <MetricCard title="Experts" value={stats.metrics.totalExperts} color="bg-accent" textColor="text-accent" />
            <MetricCard title="Recipes" value={stats.metrics.totalRecipes} color="bg-primary" textColor="text-primary" />
            <MetricCard title="Health Logs" value={stats.metrics.totalHealthLogs} color="bg-earth" textColor="text-earth" />
            <MetricCard title="Pending Exp." value={stats.metrics.pendingExperts} color="bg-danger" textColor="text-danger" />
            <MetricCard title="Pending Rec." value={stats.metrics.pendingRecipes} color="bg-danger" textColor="text-danger" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm">
              <h3 className="text-lg font-bold text-stone-800 mb-6 border-b border-stone-100 pb-2">Recent User Signups</h3>
              <ul className="space-y-4">
                {stats.recentUsers.map(user => (
                  <li key={user._id} className="flex justify-between items-center text-sm">
                    <span className="font-bold text-stone-700">{user.name}</span>
                    <span className="text-stone-500">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm">
              <h3 className="text-lg font-bold text-stone-800 mb-6 border-b border-stone-100 pb-2">Recent Expert Signups</h3>
              <ul className="space-y-4">
                {stats.recentExperts.map(expert => (
                  <li key={expert._id} className="flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                       <span className="font-bold text-stone-700">{expert.name}</span>
                       <span className="text-xs text-stone-400 font-mono">{expert.credentials}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${expert.approvedStatus ? 'bg-secondary/10 text-secondary' : 'bg-danger/10 text-danger'}`}>
                       {expert.approvedStatus ? 'Approved' : 'Pending'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && stats && (
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 animate-fade-in-up">
           <h3 className="text-xl font-bold text-stone-800 mb-6">User Directory (Newest 5)</h3>
           <table className="w-full text-left">
             <thead>
               <tr className="text-xs text-stone-400 uppercase tracking-wider border-b border-stone-100">
                 <th className="pb-3 font-bold">Name</th>
                 <th className="pb-3 font-bold">Email</th>
                 <th className="pb-3 font-bold">Joined</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-stone-100 text-sm">
               {stats.recentUsers.map(u => (
                 <tr key={u._id} className="hover:bg-stone-50 transition-colors">
                   <td className="py-4 font-medium text-stone-800">{u.name}</td>
                   <td className="py-4 text-stone-500">{u.email}</td>
                   <td className="py-4 text-stone-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                 </tr>
               ))}
             </tbody>
           </table>
           <p className="text-xs text-stone-400 mt-4 text-center italic">Only showing latest users due to pagination constraints in MVP.</p>
        </div>
      )}

      {activeTab === 'experts' && (
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 animate-fade-in-up">
           <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-3">
             Experts Awaiting Approval
             <span className="bg-danger/10 text-danger font-bold text-xs px-2 py-1 rounded-full">{pendingExperts.length}</span>
           </h3>
           
           {pendingExperts.length === 0 ? (
             <p className="text-stone-500 text-center py-10">No experts are pending approval.</p>
           ) : (
             <div className="space-y-4">
               {pendingExperts.map(expert => (
                 <div key={expert._id} className="p-6 bg-stone-50 rounded-2xl border border-stone-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                   <div>
                     <h4 className="font-bold text-lg text-stone-800">{expert.name}</h4>
                     <p className="text-sm text-stone-500 mb-2">{expert.email}</p>
                     <p className="text-xs bg-stone-200 text-stone-700 px-2 py-1 rounded font-mono inline-block mb-2">{expert.credentials}</p>
                     <p className="text-sm text-stone-600 line-clamp-2 max-w-2xl">{expert.bio}</p>
                   </div>
                   <button 
                     onClick={() => handleApproveExpert(expert._id)}
                     className="whitespace-nowrap px-6 py-3 bg-primary hover:bg-secondary text-white font-bold rounded-xl shadow transition-colors"
                   >
                     Approve Expert
                   </button>
                 </div>
               ))}
             </div>
           )}
        </div>
      )}

      {activeTab === 'recipes' && (
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 animate-fade-in-up">
           <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-3">
             Recipes Awaiting Approval
             <span className="bg-danger/10 text-danger font-bold text-xs px-2 py-1 rounded-full">{pendingRecipes.length}</span>
           </h3>
           
           {pendingRecipes.length === 0 ? (
             <p className="text-stone-500 text-center py-10">No recipes are pending approval.</p>
           ) : (
             <div className="grid md:grid-cols-2 gap-6">
                {pendingRecipes.map(recipe => (
                  <div key={recipe._id} className="p-6 bg-stone-50 rounded-2xl border border-stone-100 flex flex-col justify-between">
                     <div>
                       <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-2 py-1 rounded">{recipe.milletType}</span>
                         {recipe.isAIGenerated && <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded">AI Gen</span>}
                       </div>
                       <h4 className="font-bold text-lg text-stone-800 hover:text-primary cursor-pointer transition-colors" onClick={() => setSelectedRecipe(recipe)}>
                         {recipe.title}
                       </h4>
                       <p className="text-xs text-stone-500 mb-4 mt-1">Submitted by: {recipe.createdBy?.name || 'Unknown'}</p>
                     </div>
                     <div className="flex gap-2 mt-4">
                       <button 
                         onClick={() => setSelectedRecipe(recipe)}
                         className="flex-1 py-2 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors text-sm"
                       >
                         Review
                       </button>
                       <button 
                         onClick={() => handleApproveRecipe(recipe._id)}
                         className="flex-1 py-2 bg-primary text-white font-bold rounded-lg hover:bg-secondary transition-colors text-sm"
                       >
                         Approve
                       </button>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      )}

      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
    </div>
  );
};

const MetricCard = ({ title, value, color, textColor }) => (
  <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm text-center flex flex-col justify-center gap-2">
     <span className={`text-[10px] font-bold uppercase tracking-widest ${textColor}`}>{title}</span>
     <span className="text-3xl font-heading font-bold text-stone-800">{value}</span>
  </div>
);

export default AdminDashboard;
