import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { StudentHome } from './components/student/StudentHome';
import { BusesAndRoutesView } from './components/student/BusesAndRoutesView';
import { LiveTrackingView } from './components/student/LiveTrackingView';
import { BusPassView } from './components/student/BusPassView';
import { RouteDetailsView } from './components/student/RouteDetailsView';
import { PaymentView } from './components/student/PaymentView';
import { NotificationsView } from './components/student/NotificationsView';
import { StudentProfile } from './components/student/StudentProfile';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { KKWaghLogo } from './components/common/KKWaghLogo';
import { MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { role, studentTab, toastMessage } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Navbar with KK Wagh logo & Vaahan branding */}
      <Navbar />

      {/* Main Container with generous responsive spacing */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {role === 'driver' && <DriverDashboard />}

        {role === 'admin' && <AdminDashboard />}

        {role === 'student' && (
          <>
            {studentTab === 'home' && <StudentHome />}
            {studentTab === 'buses-routes' && <BusesAndRoutesView />}
            {studentTab === 'tracking' && <LiveTrackingView />}
            {studentTab === 'pass' && <BusPassView />}
            {studentTab === 'route-detail' && <RouteDetailsView />}
            {studentTab === 'payments' && <PaymentView />}
            {studentTab === 'notifications' && <NotificationsView />}
            {studentTab === 'profile' && <StudentProfile />}
          </>
        )}
      </main>

      {/* Institutional Light Footer */}
      <footer className="bg-white border-t border-slate-200/90 mt-16 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3.5 text-center sm:text-left">
            <KKWaghLogo size="sm" showSubtitle={false} />
            <div className="text-slate-500">
              <p className="font-bold text-slate-800 text-xs sm:text-sm">
                Karmaveer Kakasaheb Wagh Education Society (KKWES)
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Hirabai Haridas Vidyanagari, Amrutdham, Panchavati, Nashik - 422003, Maharashtra, India
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Phone className="w-3.5 h-3.5 text-sky-600" /> +91 0253 2512876
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Mail className="w-3.5 h-3.5 text-sky-600" /> transport@kkwagh.edu.in
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Vaahan Transit Verified
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} K. K. Wagh Institute of Engineering Education & Research. All rights reserved.</p>
          <p className="mt-1 sm:mt-0 font-medium text-slate-500">
            Vaahan · Official Campus Transit Portal
          </p>
        </div>
      </footer>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
