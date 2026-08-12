import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QrCode, Download, RefreshCw, FileText, CheckCircle2, ShieldCheck, User, Upload, ArrowRight, ArrowLeft, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BusPassView: React.FC = () => {
  const { currentStudent, applyForPass, routes, buses } = useApp();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [step, setStep] = useState(1);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Form State for Pass Application
  const [formData, setFormData] = useState({
    studentName: currentStudent.name,
    studentId: currentStudent.studentId,
    department: currentStudent.department,
    routeId: 'route-a',
    passType: 'Monthly' as 'Monthly' | 'Semester' | 'Annual',
    photoUploaded: true,
    signatureUploaded: true,
  });

  const handleDownload = () => {
    setDownloadSuccess(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => {
      window.print();
    }, 400);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selRoute = routes.find((r) => r.id === formData.routeId) || routes[0];

    applyForPass({
      studentId: formData.studentId,
      studentName: formData.studentName,
      department: formData.department,
      routeId: formData.routeId,
      routeName: selRoute.name,
      passType: formData.passType,
      amount: formData.passType === 'Monthly' ? 4500 : formData.passType === 'Semester' ? 22000 : 40000,
      photoUrl: currentStudent.photoUrl,
      signatureUrl: currentStudent.signatureUrl || 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Kirsch_Signature.png',
    });

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    setStep(7); // Success Step
  };

  return (
    <div className="space-y-6 pb-8">
      
      {/* Top Banner */}
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 shadow-lg text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white">Digital College Bus Pass</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official verified transport credential for student daily college commute.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => { setStep(1); setShowApplyModal(true); }}
            className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
          >
            <FileText className="w-4 h-4" /> Apply for Pass
          </button>
          <button
            onClick={() => { setStep(1); setShowApplyModal(true); }}
            className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-2.5 px-4 rounded-lg border border-slate-700 transition flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" /> Renew Pass
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Bus pass PDF download initiated! You can print or save as PDF.</span>
        </div>
      )}

      {/* Official Digital Bus Pass Card Container */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden print:m-0 print:border-black print:shadow-none text-slate-800">
        
        {/* Pass Top Header */}
        <div className="bg-[#0F172A] p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 p-2 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-widest text-white">EYANTRA</h2>
              <p className="text-[10px] font-semibold text-cyan-300 uppercase tracking-wider">COLLEGE BUS PASS • 2026</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-medium text-slate-400 block uppercase">Pass ID</span>
            <span className="text-xs font-mono font-bold text-amber-400">EY-2026-001</span>
          </div>
        </div>

        {/* Pass Main Body */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          
          {/* Photo & Signature */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative">
              <img
                src={currentStudent.photoUrl}
                alt="Student Photo"
                className="w-32 h-36 rounded-xl object-cover ring-2 ring-blue-500/30 shadow-sm"
              />
              <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                VERIFIED
              </span>
            </div>

            {/* Signature Box */}
            <div className="w-32 h-10 bg-slate-50 rounded-lg p-1 border border-slate-200 flex items-center justify-center">
              <img
                src={currentStudent.signatureUrl || 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Kirsch_Signature.png'}
                alt="Signature"
                className="h-8 object-contain mix-blend-multiply"
              />
            </div>
            <span className="text-[9px] text-slate-500 font-medium uppercase">Digital Signature</span>
          </div>

          {/* Student & Route Details */}
          <div className="sm:col-span-2 space-y-3 text-xs">
            
            <div className="border-b border-slate-100 pb-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Student Name</div>
              <div className="text-base font-bold text-slate-900">{currentStudent.name}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Student ID</div>
                <div className="font-mono font-bold text-slate-800">{currentStudent.studentId}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Department</div>
                <div className="font-bold text-slate-800 truncate">{currentStudent.department}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Assigned Route</div>
                <div className="font-bold text-blue-600">Route A – College → Kothrud</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Assigned Bus</div>
                <div className="font-bold text-amber-600">Bus A-101 (MH 12 AB 1234)</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Valid From</div>
                <div className="font-semibold text-slate-700">01 Aug 2026</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Valid Until</div>
                <div className="font-semibold text-emerald-600">31 Aug 2026</div>
              </div>
            </div>

          </div>

        </div>

        {/* Pass Footer with QR Code Placeholder */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
              <QrCode className="w-12 h-12 text-slate-900" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Scan Verification QR</div>
              <div className="text-[11px] font-mono text-slate-700 mt-0.5">AUTH-EY2026-STU001-OK</div>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
              STATUS: VALID
            </span>
          </div>
        </div>

      </div>

      {/* Multi-Step Pass Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl p-6 shadow-2xl max-w-lg w-full relative">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="text-xs font-bold text-blue-600 uppercase">Step {step} of 7</div>
              <h2 className="text-lg font-bold text-slate-900">Digital Bus Pass Application</h2>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Step 1: Verify Student Details</h3>
                <div>
                  <label className="text-xs text-slate-500 font-semibold block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-semibold block mb-1">Student Roll ID</label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-semibold block mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg text-xs font-semibold text-white transition flex items-center justify-center gap-1.5 mt-4"
                >
                  Next: Select Route <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Step 2: Route & Tenure Selection</h3>
                <div>
                  <label className="text-xs text-slate-500 font-semibold block mb-1">Target Route</label>
                  <select
                    value={formData.routeId}
                    onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {routes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.code} – {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-500 font-semibold block mb-1">Pass Tenure</label>
                  <select
                    value={formData.passType}
                    onChange={(e) => setFormData({ ...formData, passType: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Monthly">Monthly Pass (₹4,500)</option>
                    <option value="Semester">Semester Pass (₹22,000)</option>
                    <option value="Annual">Annual Pass (₹40,000)</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-lg text-xs font-semibold text-slate-700">Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-xs font-semibold">Next: Photo Upload</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 text-center">
                <h3 className="text-sm font-bold text-slate-800">Step 3: Passport Photo Upload</h3>
                <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-xs text-slate-700 font-medium">Passport Size Photo Uploaded</p>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-1">✓ photo_STU2026001.jpg verified</span>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setStep(2)} className="flex-1 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-lg text-xs font-semibold text-slate-700">Back</button>
                  <button onClick={() => setStep(4)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-xs font-semibold">Next: Digital Signature</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 text-center">
                <h3 className="text-sm font-bold text-slate-800">Step 4: Digital Signature</h3>
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Kirsch_Signature.png"
                    alt="Signature"
                    className="h-12 object-contain"
                  />
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setStep(3)} className="flex-1 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-lg text-xs font-semibold text-slate-700">Back</button>
                  <button onClick={() => setStep(5)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-xs font-semibold">Next: Review</button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Step 5: Application Summary Review</h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-slate-500">Name:</span> <strong className="text-slate-900">{formData.studentName}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">ID:</span> <strong className="text-slate-900">{formData.studentId}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">Route:</span> <strong className="text-blue-600">Route A</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">Pass Fee:</span> <strong className="text-emerald-700">₹4,500</strong></div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setStep(4)} className="flex-1 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-lg text-xs font-semibold text-slate-700">Back</button>
                  <button onClick={() => setStep(6)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-xs font-semibold">Proceed to Payment</button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Step 6: Confirm Application</h3>
                <p className="text-xs text-slate-600">
                  By submitting, your application will be dispatched to the Transport Administrator for verification.
                </p>
                <button
                  onClick={handleApplySubmit}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 py-2.5 rounded-lg text-xs font-semibold text-white shadow-sm transition"
                >
                  Submit Application
                </button>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Bus Pass Application Submitted!</h3>
                <p className="text-xs text-slate-600">
                  Status: <span className="text-amber-700 font-bold">Pending Administrator Approval</span>
                </p>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg text-xs font-semibold text-white"
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
