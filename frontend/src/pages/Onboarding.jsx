import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePrescription } from '../api/prescription';

const conditionsList = ['diabetes', 'anemia', 'obesity', 'pcod', 'hypertension', 'celiac', 'thyroid'];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '', weight: '', height: '',
    activityLevel: 'sedentary',
    conditions: [],
    labValues: { fastingBloodSugar: '', postprandialSugar: '', hemoglobin: '' }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLabChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      labValues: { ...prev.labValues, [name]: value }
    }));
  };

  const toggleCondition = (cond) => {
    setFormData(prev => {
      const isSelected = prev.conditions.includes(cond);
      return {
        ...prev,
        conditions: isSelected 
          ? prev.conditions.filter(c => c !== cond) 
          : [...prev.conditions, cond]
      };
    });
  };

  const autoCalcBmi = () => {
    if (formData.weight && formData.height) {
      const hM = formData.height / 100;
      return (formData.weight / (hM * hM)).toFixed(1);
    }
    return '--';
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
        labValues: {
          fastingBloodSugar: Number(formData.labValues.fastingBloodSugar) || undefined,
          postprandialSugar: Number(formData.labValues.postprandialSugar) || undefined,
          hemoglobin: Number(formData.labValues.hemoglobin) || undefined,
        }
      };
      await generatePrescription(payload);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Failed to generate prescription. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl mt-10 bg-white rounded-xl shadow-sm">
      <h2 className="text-3xl font-heading mb-6 text-center">Health Profile Setup</h2>
      <div className="mb-4 flex justify-between text-sm text-gray-500">
        <span>Step {step} of 5</span>
        <span>BMI: {autoCalcBmi()}</span>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Basic Information</h3>
          <div><label className="block mb-1">Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
          <div><label className="block mb-1">Weight (kg)</label>
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
          <div><label className="block mb-1">Height (cm)</label>
          <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Activity Level</h3>
          <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="sedentary">Sedentary (Little or no exercise)</option>
            <option value="lightly_active">Lightly Active (Light exercise 1-3 days/week)</option>
            <option value="moderately_active">Moderately Active (Moderate exercise 3-5 days/week)</option>
            <option value="very_active">Very Active (Hard exercise 6-7 days/week)</option>
          </select>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Health Conditions</h3>
          <div className="grid grid-cols-2 gap-3">
            {conditionsList.map(cond => (
              <label key={cond} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-cream">
                <input type="checkbox" checked={formData.conditions.includes(cond)} onChange={() => toggleCondition(cond)} className="form-checkbox text-primary" />
                <span className="capitalize">{cond}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Lab Values (Optional)</h3>
          <div><label className="block mb-1">Fasting Blood Sugar (mg/dL)</label>
          <input type="number" name="fastingBloodSugar" value={formData.labValues.fastingBloodSugar} onChange={handleLabChange} className="w-full p-2 border rounded" /></div>
          <div><label className="block mb-1">Postprandial Sugar (mg/dL)</label>
          <input type="number" name="postprandialSugar" value={formData.labValues.postprandialSugar} onChange={handleLabChange} className="w-full p-2 border rounded" /></div>
          <div><label className="block mb-1">Hemoglobin (g/dL)</label>
          <input type="number" name="hemoglobin" value={formData.labValues.hemoglobin} onChange={handleLabChange} className="w-full p-2 border rounded" /></div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Review & Submit</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>BMI:</strong> {autoCalcBmi()}</li>
            <li><strong>Activity:</strong> {formData.activityLevel.replace('_', ' ')}</li>
            <li><strong>Conditions:</strong> {formData.conditions.length > 0 ? formData.conditions.join(', ') : 'None selected'}</li>
          </ul>
          <p className="text-sm mt-4 text-gray-500">Submitting will calculate and generate your personalized millet prescription.</p>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        {step > 1 ? (
          <button onClick={prevStep} className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-cream transition">Back</button>
        ) : <div />}
        
        {step < 5 ? (
          <button onClick={nextStep} 
            disabled={step === 1 && (!formData.age || !formData.weight || !formData.height)}
            className="px-6 py-2 bg-primary text-cream rounded-lg hover:bg-secondary transition disabled:opacity-50">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} className="px-6 py-2 bg-accent text-primary font-bold rounded-lg hover:bg-[#b08511] transition">
            Generate Prescription
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
