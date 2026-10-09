import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KKWaghLogo } from '../common/KKWaghLogo';
import { StudentAvatar } from '../common/StudentAvatar';
import {
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Bus,
  MapPin,
  QrCode,
  Share2,
  Sparkles,
} from 'lucide-react';

export const BusPassView: React.FC = () => {
  const { currentStudent, currentBus, currentRoute, activePass, showToast } = useApp();
  const [isCopied, setIsCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    setIsCopied(true);
    showToast('Bus pass verification link copied!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top action bar - Spacious */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified & Valid
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Academic Year {activePass.academicYear}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Digital College Bus Pass
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Present this authenticated digital pass or QR code to the driver while boarding.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleShare}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isCopied ? 'Copied' : 'Share Pass'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Official College Bus Pass ID Card - Light Elegant Theme */}
      <div
        id="printableBusPass"
        className="bg-white rounded-3xl border-2 border-sky-300 shadow-md overflow-hidden relative"
      >
        {/* Decorative Top College Header */}
        <div className="bg-linear-to-r from-sky-700 via-blue-700 to-sky-800 text-white p-6 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <KKWaghLogo size="lg" className="brightness-105" />
              <div>
                <p className="text-xs font-bold text-sky-200 tracking-wider uppercase">
                  Karmaveer Kakasaheb Wagh Education Society
                </p>
                <h2 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                  K. K. Wagh Institute of Engineering Education & Research
                </h2>
                <p className="text-[11px] text-sky-100 font-medium">
                  Amrutdham, Panchavati, Nashik - 422003 · Autonomous Institute
                </p>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center sm:text-right shrink-0">
              <p className="text-[10px] text-sky-200 font-bold uppercase tracking-wider">
                System Pass ID
              </p>
              <p className="font-mono text-sm font-extrabold text-white mt-0.5">
                {activePass.passNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Header Ribbon with Gold & Vaahan identity */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-6 py-2 flex items-center justify-between text-xs font-bold text-amber-950">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span>OFFICIAL STUDENT BUS CONCESSION PASS · VAAHAN TRANSIT</span>
          </div>
          <span className="font-mono text-amber-800">STATUS: ACTIVE & VERIFIED</span>
        </div>

        {/* Pass Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Left Column: Student Avatar & Identity */}
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            {/* Student Avatar instead of photo */}
            <StudentAvatar
              name={currentStudent.name}
              seed={currentStudent.avatarSeed}
              gender={currentStudent.gender}
              bgColor={currentStudent.avatarBg}
              size="2xl"
              showBadge={true}
              status="active"
            />

            <h3 className="mt-3 text-base font-extrabold text-slate-900 leading-tight">
              {currentStudent.name}
            </h3>
            <p className="text-xs font-bold text-sky-700 mt-0.5">
              {currentStudent.branch}
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Year: {currentStudent.year} · Div: {currentStudent.division} · Roll: {currentStudent.rollNo}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-200 w-full flex items-center justify-between text-[11px] text-slate-600">
              <span>PRN:</span>
              <span className="font-mono font-bold text-slate-900">{currentStudent.prn}</span>
            </div>
            <div className="w-full flex items-center justify-between text-[11px] text-slate-600 mt-1">
              <span>Blood Group:</span>
              <span className="font-bold text-rose-700">{currentStudent.bloodGroup}</span>
            </div>
          </div>

          {/* Center Column: Route & Transit Details */}
          <div className="space-y-3.5 md:col-span-1">
            <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-200/70">
              <p className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
                Assigned Bus & Vehicle
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Bus className="w-4 h-4 text-sky-600" />
                <span className="text-sm font-extrabold text-slate-900">
                  {currentBus?.busNumber}
                </span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-sky-200">
                  {currentBus?.plateNumber}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Designated Route
              </p>
              <p className="text-xs font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                <span className="text-sky-700">{currentRoute?.routeNumber}:</span>
                <span>{currentRoute?.name}</span>
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Boarding / Pickup Stop
              </p>
              <p className="text-xs font-bold text-slate-900 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                {currentStudent.stopName}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Morning Pickup Time: <strong className="text-slate-800">{currentStudent.stopPickupTime}</strong>
              </p>
            </div>

            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-medium">Valid Period:</span>
              <span className="font-bold text-slate-800">
                {activePass.validFrom} – {activePass.validTill}
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic QR Code & College Stamp */}
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <QrCode className="w-4 h-4 text-sky-600" /> Driver Scan QR
            </p>

            {/* High fidelity SVG QR Code with center logo */}
            <div className="p-3 bg-white rounded-xl border-2 border-slate-200 shadow-xs relative">
              <svg className="w-36 h-36" viewBox="0 0 100 100" fill="currentColor">
                {/* QR Code pattern */}
                <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                {/* Corner Finder 1 */}
                <rect x="5" y="5" width="25" height="25" fill="#0f172a" />
                <rect x="9" y="9" width="17" height="17" fill="#ffffff" />
                <rect x="13" y="13" width="9" height="9" fill="#0f172a" />
                {/* Corner Finder 2 */}
                <rect x="70" y="5" width="25" height="25" fill="#0f172a" />
                <rect x="74" y="9" width="17" height="17" fill="#ffffff" />
                <rect x="78" y="13" width="9" height="9" fill="#0f172a" />
                {/* Corner Finder 3 */}
                <rect x="5" y="70" width="25" height="25" fill="#0f172a" />
                <rect x="9" y="74" width="17" height="17" fill="#ffffff" />
                <rect x="13" y="78" width="9" height="9" fill="#0f172a" />

                {/* Data modules */}
                <rect x="35" y="8" width="4" height="4" fill="#0284c7" />
                <rect x="42" y="12" width="4" height="4" fill="#0f172a" />
                <rect x="50" y="8" width="4" height="4" fill="#0f172a" />
                <rect x="58" y="15" width="4" height="4" fill="#0284c7" />
                <rect x="35" y="22" width="4" height="4" fill="#0f172a" />
                <rect x="48" y="25" width="4" height="4" fill="#0284c7" />

                <rect x="8" y="36" width="4" height="4" fill="#0f172a" />
                <rect x="18" y="42" width="4" height="4" fill="#0284c7" />
                <rect x="25" y="38" width="4" height="4" fill="#0f172a" />
                <rect x="8" y="48" width="4" height="4" fill="#0284c7" />

                {/* Center badge */}
                <circle cx="50" cy="50" r="12" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
                <text x="50" y="54" textAnchor="middle" fill="#0284c7" fontSize="8" fontWeight="bold">
                  KKW
                </text>

                <rect x="68" y="38" width="4" height="4" fill="#0f172a" />
                <rect x="78" y="45" width="4" height="4" fill="#0284c7" />
                <rect x="88" y="40" width="4" height="4" fill="#0f172a" />
                <rect x="65" y="52" width="4" height="4" fill="#0f172a" />
                <rect x="80" y="55" width="4" height="4" fill="#0284c7" />

                <rect x="38" y="68" width="4" height="4" fill="#0f172a" />
                <rect x="45" y="74" width="4" height="4" fill="#0284c7" />
                <rect x="52" y="82" width="4" height="4" fill="#0f172a" />
                <rect x="60" y="70" width="4" height="4" fill="#0f172a" />
                <rect x="75" y="78" width="4" height="4" fill="#0284c7" />
                <rect x="85" y="85" width="4" height="4" fill="#0f172a" />
              </svg>
            </div>

            {/* Official Seal / Signature Badge */}
            <div className="text-center pt-2">
              <div className="inline-block border-b border-dashed border-slate-400 pb-1 px-4">
                <span className="font-serif italic font-bold text-sky-800 text-xs">
                  S. R. Gangurde
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">
                Prof. S. R. Gangurde
              </p>
              <p className="text-[9px] text-slate-400">Dean of Transport & Transit</p>
            </div>
          </div>
        </div>

        {/* Footer Bar of Pass */}
        <div className="bg-slate-100/80 px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Annual Fee ₹{activePass.feePaid.toLocaleString()} paid via {activePass.paymentRef}</span>
          </div>
          <span className="font-mono text-slate-400">
            Generated via Vaahan · KKWIEER Nashik
          </span>
        </div>
      </div>
    </div>
  );
};
