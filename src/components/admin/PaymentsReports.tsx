import React from 'react';
import { useApp } from '../../context/AppContext';
import { DollarSign, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const PaymentsReports: React.FC = () => {
  const { payments } = useApp();

  const totalCollected = 248500;

  return (
    <div className="space-y-6 pb-8">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Transportation Revenue & Payments</h1>
            <p className="text-xs text-slate-400 mt-0.5">Audit log of digital bus fee collections, UPI/card settlements, and receipts.</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-white">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Collected</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">₹{totalCollected.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">August 2026 Term</div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-white">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Successful Payments</div>
          <div className="text-2xl font-black text-white mt-1">54 Transactions</div>
          <div className="text-[10px] text-emerald-400 mt-0.5 font-semibold">100% Settled</div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-white">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Pending Approvals</div>
          <div className="text-2xl font-black text-amber-400 mt-1">7 Records</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Verification pending</div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-white">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Failed Transactions</div>
          <div className="text-2xl font-black text-rose-400 mt-1">2 Records</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Gateway timeout</div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl text-white">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Transaction Ledger</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4 rounded-l-xl">Transaction ID</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Pass ID</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-850/50 transition">
                  <td className="p-4 font-mono font-bold text-blue-400">{p.transactionId}</td>
                  <td className="p-4 font-bold text-white">{p.studentName}</td>
                  <td className="p-4 font-mono text-slate-300">{p.passId}</td>
                  <td className="p-4 font-bold text-emerald-400">₹{p.amount.toLocaleString()}</td>
                  <td className="p-4 text-slate-200">{p.method}</td>
                  <td className="p-4 text-slate-400 font-mono text-[11px]">{p.date}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
