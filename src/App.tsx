import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { DemoControlPanel } from './components/common/DemoControlModal';
import { LoginScreen } from './components/auth/LoginScreen';

// Student Components
import { StudentHome } from './components/student/StudentHome';
import { LiveTrackingView } from './components/student/LiveTrackingView';
import { RouteDetailsView } from './components/student/RouteDetailsView';
import { BusPassView } from './components/student/BusPassView';
import { PaymentView } from './components/student/PaymentView';
import { NotificationsView } from './components/student/NotificationsView';
import { StudentProfile } from './components/student/StudentProfile';

// Driver Components
import { DriverDashboard } from './components/driver/DriverDashboard';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LiveFleetMap } from './components/admin/LiveFleetMap';
import { RouteMonitoring } from './components/admin/RouteMonitoring';
import { IncidentCenter } from './components/admin/IncidentCenter';
import { StudentManagement } from './components/admin/StudentManagement';
import { BusManagement } from './components/admin/BusManagement';
import { DriverManagement } from './components/admin/DriverManagement';
import { PassManagement } from './components/admin/PassManagement';
import { PaymentsReports } from './components/admin/PaymentsReports';
import { AnnouncementsModal } from './components/admin/AnnouncementsModal';

const AppContent: React.FC = () => {
  const { role, setRole } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeTab, setActiveTab] = useState<string>(() => {
    return role === 'student' ? 'home' : role === 'driver' ? 'driver-dashboard' : 'admin-dashboard';
  });

  const handleLogin = (selectedRole: any) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
    if (selectedRole === 'student') setActiveTab('home');
    if (selectedRole === 'driver') setActiveTab('driver-dashboard');
    if (selectedRole === 'admin') setActiveTab('admin-dashboard');
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        
        {/* Desktop Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic View Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-[calc(100vh-4rem)]">
          
          {/* Student Views */}
          {role === 'student' && (
            <>
              {activeTab === 'home' && <StudentHome setActiveTab={setActiveTab} />}
              {activeTab === 'live-tracking' && <LiveTrackingView />}
              {activeTab === 'route-details' && <RouteDetailsView />}
              {activeTab === 'bus-pass' && <BusPassView />}
              {activeTab === 'payment' && <PaymentView />}
              {activeTab === 'notifications' && <NotificationsView />}
              {activeTab === 'profile' && <StudentProfile />}
            </>
          )}

          {/* Driver Views */}
          {role === 'driver' && (
            <>
              {(activeTab === 'driver-dashboard' || activeTab === 'home') && <DriverDashboard />}
              {activeTab === 'live-tracking' && <LiveTrackingView />}
              {activeTab === 'driver-emergency' && <DriverDashboard />}
            </>
          )}

          {/* Admin Views */}
          {role === 'admin' && (
            <>
              {(activeTab === 'admin-dashboard' || activeTab === 'home') && <AdminDashboard setActiveTab={setActiveTab} />}
              {activeTab === 'admin-fleet-map' && <LiveFleetMap />}
              {activeTab === 'admin-incidents' && <IncidentCenter />}
              {activeTab === 'admin-routes' && <RouteMonitoring />}
              {activeTab === 'admin-students' && <StudentManagement />}
              {activeTab === 'admin-buses' && <BusManagement />}
              {activeTab === 'admin-drivers' && <DriverManagement />}
              {activeTab === 'admin-passes' && <PassManagement />}
              {activeTab === 'admin-payments' && <PaymentsReports />}
              {activeTab === 'admin-announcements' && <AnnouncementsModal />}
            </>
          )}

        </main>
      </div>

      {/* Floating Presentation Demo Control Panel */}
      <DemoControlPanel />

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
