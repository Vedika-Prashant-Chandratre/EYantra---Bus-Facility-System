import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileCheck, Check, X, ShieldCheck, User } from 'lucide-react';

export const PassManagement: React.FC = () => {
  const { passApplications, approvePass, rejectPass } = useApp();

  return (
    <div className="space-y-6 pb-8">
      
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 shadow-lg text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Digital Bus Pass Approval Workspace</h1>
            <p className="text-xs text-slate-400 mt-0.5">Verify student photos, digital signatures, and route track eligibility.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {passApplications.map((app) => (
          <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img src={app.photoUrl} alt={app.studentName} className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/20" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{app.studentName}</h3>
                  <p className="text-xs text-slate-500">{app.department} • {app.studentId}</p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  app.status === 'Approved'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : app.status === 'Pending'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}
              >
                {app.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div><span className="text-slate-500 block text-[10px]">Route Track:</span> <strong className="text-blue-600">{app.routeName}</strong></div>
              <div><span className="text-slate-500 block text-[10px]">Pass Fee:</span> <strong className="text-emerald-700">₹{app.amount.toLocaleString()} ({app.passType})</strong></div>
            </div>

            {/* Signature Preview */}
            <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-200">
              <img src={app.signatureUrl} alt="Signature" className="h-8 object-contain mx-auto mix-blend-multiply" />
              <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Submitted Digital Signature</span>
            </div>

            {app.status === 'Pending' && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => approvePass(app.id)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Approve Pass
                </button>
                <button
                  onClick={() => rejectPass(app.id)}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
