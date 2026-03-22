import React from 'react';
import jsPDF from 'jspdf';
import { Download, Calendar, Activity } from 'lucide-react';

const PrescriptionCard = ({ prescription, userProfile }) => {
  if (!prescription || !prescription.items) return null;

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('MilletVerse Prescription', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date(prescription.generatedDate).toLocaleDateString()}`, 20, 30);
    doc.text(`Version: ${prescription.version}`, 20, 38);
    
    // Add items
    let yPos = 50;
    prescription.items.forEach((item, index) => {
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${item.millet.toUpperCase()}`, 20, yPos);
      doc.setFontSize(11);
      doc.text(`Quantity: ${item.quantity}g`, 20, yPos + 7);
      doc.text(`Form: ${item.form}`, 20, yPos + 14);
      doc.text(`Timing: ${item.timing}`, 20, yPos + 21);
      
      const splitRationale = doc.splitTextToSize(`Rationale: ${item.rationale}`, 170);
      doc.text(splitRationale, 20, yPos + 28);
      
      yPos += 45;
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });

    doc.save(`MilletVerse_Prescription_v${prescription.version}.pdf`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="bg-primary text-cream px-6 py-4 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-heading font-bold">Active Dietary Intelligence</h3>
          <p className="text-sm opacity-90 truncate">Version {prescription.version} • {new Date(prescription.generatedDate).toLocaleDateString()}</p>
        </div>
        <button 
          onClick={downloadPDF}
          className="flex items-center space-x-2 bg-accent text-primary px-4 py-2 rounded-lg font-semibold hover:bg-[#b08511] transition">
          <Download size={18} />
          <span>Download PDF</span>
        </button>
      </div>

      <div className="p-6 divide-y divide-gray-100">
        {prescription.items.map((item, idx) => (
          <div key={idx} className="py-4 first:pt-0 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-bold text-primary capitalize">{item.millet}</h4>
              <span className="bg-muted text-primary px-3 py-1 rounded-full text-sm font-medium">
                {item.quantity}g / day
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div className="flex items-center space-x-2 text-gray-600">
                <Activity size={16} />
                <span className="capitalize">{item.form}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar size={16} />
                <span className="capitalize">{item.timing}</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 bg-cream p-3 rounded-lg border-l-4 border-accent">
              <strong>Clinical Rationale:</strong> {item.rationale}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionCard;
