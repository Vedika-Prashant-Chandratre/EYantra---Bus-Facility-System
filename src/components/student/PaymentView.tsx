import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, CheckCircle2, ShieldCheck, Loader2, Sparkles, DollarSign, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentView: React.FC = () => {
  const { processPayment, payments, currentStudent } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'Card' | 'Net Banking'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successTxn, setSuccessTxn] = useState<string | null>(null);

  const handlePay = async () => {
    setIsProcessing(true);
    setSuccessTxn(null);

    const record = await processPayment(selectedMethod, 4500);

    setIsProcessing(false);
    setSuccessTxn(record.transactionId);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6 pb-8">
      
      {/* Header Banner */}
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 shadow-lg text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Online Bus Fee Gateway</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure, instant digital bus pass fee payment processing.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Payment Form Box */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-slate-800 space-y-5">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" /> Select Payment Option
          </h2>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Monthly Bus Pass Fee</span>
              <span className="text-xs font-bold text-slate-800">August 2026</span>
            </div>
            <div className="text-2xl font-bold text-emerald-700">₹4,500</div>
            <p className="text-[11px] text-slate-500">Includes Route A commute and emergency coverage.</p>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {(['UPI', 'Card', 'Net Banking'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  className={`py-2.5 px-2 rounded-lg border text-xs font-semibold transition flex flex-col items-center gap-1 ${
                    selectedMethod === method
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{method === 'UPI' ? '📲' : method === 'Card' ? '💳' : '🏦'}</span>
                  <span>{method}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Simulating Payment Gateway...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Pay ₹4,500 Now</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {successTxn && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Payment Successful!
              </div>
              <p>Transaction ID: <strong className="font-mono text-slate-900">{successTxn}</strong></p>
              <p className="text-[11px] text-slate-500">Digital receipt dispatched to student portal.</p>
            </div>
          )}
        </div>

        {/* Transaction History Log */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment History & Receipts</h2>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {payments.map((p) => (
              <div key={p.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-700">{p.transactionId}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                    {p.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{p.method} • {p.date}</span>
                  <span className="font-bold text-slate-900 text-sm">₹{p.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
