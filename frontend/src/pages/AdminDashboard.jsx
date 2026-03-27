import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import RecipeModal from '../components/RecipeModal';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, experts, recipes
  const [stats, setStats] = useState(null);
  const [experts, setExperts] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Expert Form State
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [editingExpert, setEditingExpert] = useState(null);
  const [expertFormData, setExpertFormData] = useState({
    name: '', email: '', password: '', specialty: '', credentials: '', bio: ''
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch admin statistics.', err);
    }
  };

  const fetchExperts = async () => {
    try {
      const res = await api.get('/admin/experts');
      setExperts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
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
    await Promise.all([fetchStats(), fetchExperts(), fetchUsers(), fetchPendingRecipes()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const handleExpertSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpert) {
        await api.put(`/admin/experts/${editingExpert._id}`, expertFormData);
        showToast('Expert updated successfully!');
      } else {
        await api.post('/admin/experts', expertFormData);
        showToast('Expert created successfully!');
      }
      setShowExpertModal(false);
      setEditingExpert(null);
      setExpertFormData({ name: '', email: '', password: '', specialty: '', credentials: '', bio: '' });
      fetchExperts();
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save expert.', 'error');
    }
  };

  const handleDeleteExpert = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expert?')) return;
    try {
      await api.delete(`/admin/experts/${id}`);
      showToast('Expert deleted successfully!');
      fetchExperts();
      fetchStats();
    } catch (err) {
      showToast('Failed to delete expert.', 'error');
    }
  };

  const openEditExpert = (expert) => {
    setEditingExpert(expert);
    setExpertFormData({
      name: expert.name,
      email: expert.email,
      password: '', // Don't show password
      specialty: expert.specialty,
      credentials: expert.credentials,
      bio: expert.bio
    });
    setShowExpertModal(true);
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
               {tab} {tab === 'recipes' && pendingRecipes.length > 0 ? `(${pendingRecipes.length})` : ''}
             </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up">
           <MetricCard title="Total Users" value={stats.metrics.totalUsers} icon="👥" />
           <MetricCard title="Total Experts" value={stats.metrics.totalExperts} icon="👨‍⚕️" />
           <MetricCard title="Total Recipes" value={stats.metrics.totalRecipes} icon="🍲" />
           <MetricCard title="Pending Rec." value={stats.metrics.pendingRecipes} icon="⏳" />
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 animate-fade-in-up">
           <h3 className="text-xl font-bold text-stone-800 mb-6">User Management ({users.length})</h3>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="text-xs text-stone-400 uppercase tracking-wider border-b border-stone-100">
                   <th className="pb-3 font-bold">Name</th>
                   <th className="pb-3 font-bold">Email</th>
                   <th className="pb-3 font-bold">Joined</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-stone-100 text-sm">
                 {users.map(u => (
                   <tr key={u._id} className="hover:bg-stone-50 transition-colors">
                     <td className="py-4 font-medium text-stone-800">{u.name}</td>
                     <td className="py-4 text-stone-500">{u.email}</td>
                     <td className="py-4 text-stone-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {activeTab === 'experts' && (
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 animate-fade-in-up">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-bold text-stone-800">Expert Management ({experts.length})</h3>
             <button 
               onClick={() => { setEditingExpert(null); setExpertFormData({name:'', email:'', password:'', specialty:'', credentials:'', bio:''}); setShowExpertModal(true); }}
               className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-xl font-bold text-sm transition-all"
             >
               + Add Expert
             </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {experts.map(expert => (
               <div key={expert._id} className="bg-stone-50 border border-stone-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                 <div className="flex justify-between items-start mb-4">
                   <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-bold text-xl">
                     {expert.name.charAt(0)}
                   </div>
                   <div className="flex gap-2">
                     <button onClick={() => openEditExpert(expert)} className="p-2 hover:bg-stone-200 rounded-lg transition-colors text-stone-500">✏️</button>
                     <button onClick={() => handleDeleteExpert(expert._id)} className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors">🗑️</button>
                   </div>
                 </div>
                 <h4 className="font-bold text-stone-800">{expert.name}</h4>
                 <p className="text-xs text-stone-500 mb-2">{expert.email}</p>
                 <p className="text-sm text-secondary font-medium mb-1">{expert.specialty}</p>
                 <p className="text-[10px] bg-stone-200 text-stone-600 px-2 py-0.5 rounded inline-block font-mono mb-3">{expert.credentials}</p>
                 <p className="text-xs text-stone-600 line-clamp-2 italic">"{expert.bio}"</p>
               </div>
             ))}
           </div>
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

      {/* Expert Modal */}
      {showExpertModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
              <div className="bg-stone-50 px-8 py-6 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-stone-800">{editingExpert ? 'Edit Expert' : 'Add New Expert'}</h3>
                <button onClick={() => setShowExpertModal(false)} className="text-stone-400 hover:text-stone-600 text-2xl">&times;</button>
              </div>
              <form onSubmit={handleExpertSubmit} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Full Name</label>
                  <input 
                    className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" 
                    value={expertFormData.name} 
                    onChange={e => setExpertFormData({...expertFormData, name: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Email</label>
                  <input 
                    type="email"
                    className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" 
                    value={expertFormData.email} 
                    onChange={e => setExpertFormData({...expertFormData, email: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Password {editingExpert && '(leave blank to keep current)'}</label>
                  <input 
                    type="password"
                    className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" 
                    value={expertFormData.password} 
                    onChange={e => setExpertFormData({...expertFormData, password: e.target.value})} 
                    required={!editingExpert}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Specialty</label>
                  <input 
                    className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" 
                    value={expertFormData.specialty} 
                    onChange={e => setExpertFormData({...expertFormData, specialty: e.target.value})} 
                    placeholder="e.g. Diabetic Diet Management"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Credentials</label>
                  <input 
                    className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" 
                    value={expertFormData.credentials} 
                    onChange={e => setExpertFormData({...expertFormData, credentials: e.target.value})} 
                    placeholder="e.g. PhD Nutrition, RD"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Bio</label>
                  <textarea 
                    className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none h-24 resize-none" 
                    value={expertFormData.bio} 
                    onChange={e => setExpertFormData({...expertFormData, bio: e.target.value})} 
                    required 
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowExpertModal(false)} className="flex-1 py-3 border border-stone-200 rounded-xl font-bold text-stone-500 hover:bg-stone-50">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-secondary transition-all">
                    {editingExpert ? 'Update Expert' : 'Save Expert'}
                  </button>
                </div>
              </form>
           </div>
        </div>
      )}

      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
    </div>
  );
};

const MetricCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm flex items-center gap-4">
     <div className="text-3xl">{icon}</div>
     <div>
       <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{title}</span>
       <h4 className="text-2xl font-bold text-stone-800">{value}</h4>
     </div>
  </div>
);

export default AdminDashboard;
