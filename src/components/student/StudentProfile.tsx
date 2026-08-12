import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, Phone, BookOpen, MapPin, Bus as BusIcon, ShieldCheck } from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { currentStudent } = useApp();

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl text-white max-w-2xl mx-auto">
        <div className="flex flex-col items-center text-center pb-6 border-b border-slate-800">
          <img
            src={currentStudent.photoUrl}
            alt={currentStudent.name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-500/40 shadow-xl mb-4"
          />
          <h1 className="text-xl font-black text-white">{currentStudent.name}</h1>
          <p className="text-xs text-blue-400 font-mono font-bold mt-1">{currentStudent.studentId}</p>
          <span className="mt-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
            Pass Status: {currentStudent.passStatus}
          </span>
        </div>

        <div className="pt-6 space-y-4 text-xs">
          <div className="flex items-center gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">Department</span>
              <strong className="text-white">{currentStudent.department}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <Mail className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">College Email</span>
              <strong className="text-white">{currentStudent.email}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <Phone className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">Phone Number</span>
              <strong className="text-white">{currentStudent.phone}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <MapPin className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">Commute Route</span>
              <strong className="text-white">Route A – College → Kothrud (Bus A-101)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
