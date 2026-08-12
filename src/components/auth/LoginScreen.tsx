import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bus, User, Truck, Shield, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { UserRole } from '../../types';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('student@eyantra.demo');
  const [password, setPassword] = useState('••••••••');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'student') setEmail('student@eyantra.demo');
    if (role === 'driver') setEmail('driver@eyantra.demo');
    if (role === 'admin') setEmail('admin@eyantra.demo');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-xl mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Bus className="w-7 h-7 text-cyan-400" />
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white">EYantra</h1>
          <p className="text-xs text-slate-400 font-medium">
            Smart College Bus Tracking, Pass & Management System
          </p>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-widest mt-2">
            <Sparkles className="w-3 h-3" /> Project Demo Mode
          </span>
        </div>

        {/* 1-Click Demo Preset Credentials Selector */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Select Demo Account Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleRoleSelect('student')}
              className={`py-3 px-2 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                selectedRole === 'student'
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('driver')}
              className={`py-3 px-2 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                selectedRole === 'driver'
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Driver</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`py-3 px-2 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                selectedRole === 'admin'
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">College Email / Identifier</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            Note: This is a standalone prototype. Any password is valid for demonstration.
          </p>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-2xl shadow-xl shadow-blue-600/25 transition flex items-center justify-center gap-2"
          >
            <span>Launch {selectedRole.toUpperCase()} Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
