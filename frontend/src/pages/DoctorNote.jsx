import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

const DoctorNote = () => {
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!noteText.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.post('/ai/interpret-note', { noteText });
      setResult(res.data.conditions);
    } catch (err) {
      setError('Failed to analyze the note. Please make sure your text is clear and try again.');
    } finally {
      setLoading(false);
    }
  };

  const generatePrescription = async (conditions) => {
     // Navigate to onboarding with preset conditions to generate prescription
     // or generate prescription right away by passing conditions to backend.
     // For now, we assume the dashboard automatically shows prescription based on user health profile.
     // So we could update the user's health profile and go to dashboard.
     // Wait, the API might not support updating user profile easily here yet, but let's navigate to dashboard and store conditions in localStorage for Onboarding to pick up.
     
     localStorage.setItem('ai_suggested_conditions', JSON.stringify(conditions));
     navigate('/onboarding');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">Gemini AI</span>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">Clinical Interpreter</h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
          Paste your doctor's prescriptions or clinical notes below. Our AI will analyze your health conditions and map them to therapeutic millet diets.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-stone-100 p-8 md:p-12">
        <div className="mb-8">
          <label className="block text-sm font-bold text-stone-700 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Paste Clinical Notes or Symptom Description:
          </label>
          <textarea 
            rows="8" 
            className="w-full px-6 py-5 rounded-2xl border-2 border-stone-100 focus:border-secondary focus:ring-0 outline-none transition-all resize-none text-stone-700 bg-stone-50/50"
            placeholder="E.g., Patient is a 45-year-old male with a history of type 2 diabetes mellitus (HbA1c 7.8%) and essential hypertension. Complains of mild joint pain. Needs to improve dietary fiber intake."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          ></textarea>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-4">
          <p className="text-xs text-stone-400 max-w-sm">
             Your data is analyzed securely using Google Gemini 2.5 and is not permanently stored.
          </p>
          <button 
            onClick={handleAnalyze}
            disabled={loading || !noteText.trim()}
            className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                Analyzing...
              </>
            ) : 'Analyze Clinical Notes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-8 p-6 bg-danger/5 border border-danger/20 text-danger rounded-2xl text-center font-medium animate-fade-in">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-12 bg-cream rounded-3xl p-8 md:p-12 border border-earth/10 animate-fade-in-up">
           <h2 className="text-2xl font-bold font-heading text-primary mb-6 flex items-center gap-3">
             <span className="bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center">✨</span>
             Analysis Results
           </h2>
           
           <div className="mb-8">
             <p className="text-stone-600 mb-4">We've identified the following therapeutic targets from your notes:</p>
             {result.length > 0 ? (
               <div className="flex flex-wrap gap-3">
                 {result.map((condition, idx) => (
                   <span key={idx} className="px-4 py-2 bg-white text-secondary font-bold rounded-xl border border-secondary/20 shadow-sm capitalize">
                     {condition}
                   </span>
                 ))}
               </div>
             ) : (
               <p className="text-stone-500 italic">No specific therapeutic conditions were identified that map directly to our specific millet profiles. General health millets will be recommended.</p>
             )}
           </div>
           
           <div className="p-6 bg-white rounded-2xl border border-stone-100 shadow-sm">
             <h3 className="text-stone-800 font-bold mb-2">Next Steps</h3>
             <p className="text-stone-600 text-sm mb-6">
               Proceed to onboarding to add any additional details and generate your personalized millet prescription based on these findings.
             </p>
             <button onClick={() => generatePrescription(result)} className="px-6 py-3 bg-secondary text-white font-bold rounded-xl hover:bg-primary transition-colors w-full sm:w-auto text-center">
               Generate Diet Plan
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default DoctorNote;
