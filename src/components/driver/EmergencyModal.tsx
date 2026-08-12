import React from 'react';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { Incident } from '../../types';

interface EmergencyModalProps {
  type: Incident['type'];
  onClose: () => void;
  onConfirm: (description: string) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ type, onClose, onConfirm }) => {
  const [description, setDescription] = React.useState('');

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-rose-300 text-slate-800 rounded-2xl p-6 shadow-2xl max-w-md w-full relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">CRITICAL INCIDENT ALERT</div>
            <h2 className="text-lg font-bold text-slate-900">{type} REPORT</h2>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Are you sure you want to report <strong className="text-rose-700">{type}</strong> for Bus A-101 on Route A?
          This will trigger an immediate high-priority alert on the Administrator Transport Control Center and notify all route students.
        </p>

        <div className="space-y-3 mb-6">
          <label className="text-xs font-semibold text-slate-700 block">Incident Details (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="E.g., Engine overheating near Shivajinagar chowk. Requiring mechanic or backup vehicle."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 h-24 focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(description || `Driver reported ${type} event.`)}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" /> Report Incident
          </button>
        </div>

      </div>
    </div>
  );
};
