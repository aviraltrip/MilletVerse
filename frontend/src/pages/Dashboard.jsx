import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyPrescriptions } from '../api/prescription';
import PrescriptionCard from '../components/PrescriptionCard';
import { Activity, Edit3, HeartPulse, FileText } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await getMyPrescriptions();
        setPrescriptions(data.prescriptions || []);
        if (data.prescriptions.length === 0) {
          // No prescription found -> go to onboarding
          navigate('/onboarding');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [navigate]);

  if (loading) return <div className="p-8 text-center mt-20">Loading intelligence...</div>;

  const activePrescription = prescriptions.find(p => p.isActive) || prescriptions[0];

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl mt-6">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm mb-8">
        <div>
          <h1 className="text-3xl font-heading mb-2">Welcome back, {user?.name || 'Explorer'}</h1>
          <p className="text-gray-500">Your personalized dietary intelligence dashboard.</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Link to="/health-log" className="flex items-center space-x-2 bg-primary text-cream px-4 py-2 rounded-lg hover:bg-secondary transition">
            <HeartPulse size={18} />
            <span>Daily Check-in</span>
          </Link>
          <Link to="/onboarding" className="flex items-center space-x-2 border border-primary text-primary px-4 py-2 rounded-lg hover:bg-cream transition">
            <Edit3 size={18} />
            <span>Update Profile</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-8">
          {activePrescription ? (
            <PrescriptionCard prescription={activePrescription} />
          ) : (
            <div className="bg-white p-8 text-center rounded-xl shadow-sm border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">You have not generated a prescription yet.</p>
              <Link to="/onboarding" className="bg-accent px-6 py-2 rounded-lg text-primary font-bold">Start Onboarding</Link>
            </div>
          )}
        </div>

        {/* Sidebar area */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-primary">
            <h3 className="font-bold text-lg mb-3 flex items-center space-x-2">
              <Activity size={20} className="text-primary"/>
              <span>Quick Links</span>
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/encyclopedia" className="text-gray-600 hover:text-primary transition flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-accent"></span><span>Millet Encyclopedia</span></Link></li>
              <li><Link to="/recipes" className="text-gray-600 hover:text-primary transition flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-accent"></span><span>Recipe Library</span></Link></li>
              <li><Link to="/map" className="text-gray-600 hover:text-primary transition flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-accent"></span><span>Local Store Map</span></Link></li>
              <li><Link to="/doctor-note" className="text-gray-600 hover:text-primary transition flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-accent"></span><span>Doctor Note Interpreter</span></Link></li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-accent">
             <h3 className="font-bold text-lg mb-3 flex items-center space-x-2">
              <FileText size={20} className="text-accent"/>
              <span>Recent Logs</span>
            </h3>
            <div className="text-sm text-gray-500 p-4 text-center bg-cream rounded-lg">
              No recent health logs. Log your daily condition to see trends.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
