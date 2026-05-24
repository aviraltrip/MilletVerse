import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { Download, Calendar, Activity, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../api/axiosInstance';

const parseInlineBold = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/);
  return parts.map((part, pIdx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={pIdx} className="font-bold text-stone-850">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const renderMarkdown = (text) => {
  if (!text) return null;
  const blocks = text.split(/\n\s*\n/);
  return blocks.map((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('#')) {
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const content = match[2];
        const sizeClass = 
          level === 1 ? 'text-xl font-bold text-primary mt-4 mb-2' :
          level === 2 ? 'text-lg font-bold text-primary mt-3 mb-2' :
          'text-md font-bold text-secondary mt-2 mb-1';
        return <h5 key={idx} className={sizeClass}>{parseInlineBold(content)}</h5>;
      }
    }

    if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      const lines = trimmed.split('\n');
      return (
        <ul key={idx} className="list-disc pl-5 my-2 space-y-1">
          {lines.map((line, lIdx) => {
            const cleanLine = line.replace(/^[\-\*]\s+/, '');
            return <li key={lIdx} className="text-gray-700 text-sm leading-relaxed">{parseInlineBold(cleanLine)}</li>;
          })}
        </ul>
      );
    }

    if (/^\d+\./.test(trimmed)) {
      const lines = trimmed.split('\n');
      return (
        <ol key={idx} className="list-decimal pl-5 my-2 space-y-1">
          {lines.map((line, lIdx) => {
            const cleanLine = line.replace(/^\d+\.\s+/, '');
            return <li key={lIdx} className="text-gray-700 text-sm leading-relaxed">{parseInlineBold(cleanLine)}</li>;
          })}
        </ol>
      );
    }

    return <p key={idx} className="text-gray-700 text-sm leading-relaxed my-2">{parseInlineBold(trimmed)}</p>;
  });
};

const PrescriptionCard = ({ prescription, userProfile }) => {
  if (!prescription || !prescription.items) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleOpen = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    
    if (nextState && !summary && !loading) {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/ai/prescription-summary');
        if (res.data && res.data.success && res.data.summary) {
          setSummary(res.data.summary);
        } else {
          setError('Could not generate summary.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch AI summary. Please check your connection.');
      } finally {
        setLoading(false);
      }
    }
  };

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

      {/* AI Summary Section */}
      <div className="border-t border-gray-100 bg-stone-50 p-4">
        <button 
          onClick={toggleOpen}
          className="w-full flex items-center justify-between text-stone-700 hover:text-primary font-semibold text-sm transition"
        >
          <div className="flex items-center space-x-2">
            <Sparkles size={16} className="text-accent animate-pulse" />
            <span>AI Summary Explanation</span>
          </div>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isOpen && (
          <div className="mt-4 bg-white border border-stone-200 rounded-lg p-5 shadow-inner max-h-[400px] overflow-y-auto">
            {loading && (
              <div className="flex flex-col items-center justify-center py-6 space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-xs text-stone-500 font-medium animate-pulse">Synthesizing clinical summary...</span>
              </div>
            )}
            
            {error && (
              <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>
            )}

            {!loading && !error && summary && (
              <div className="space-y-3">
                {renderMarkdown(summary)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionCard;
