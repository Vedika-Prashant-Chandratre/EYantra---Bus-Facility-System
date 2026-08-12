import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Navigation, MapPin, CreditCard, LayoutDashboard, Map, Truck, AlertTriangle } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { role } = useApp();

  const studentItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'live-tracking', label: 'Track', icon: Navigation },
    { id: 'route-details', label: 'Route', icon: MapPin },
    { id: 'bus-pass', label: 'Pass', icon: CreditCard },
  ];

  const driverItems = [
    { id: 'driver-dashboard', label: 'Controls', icon: Truck },
    { id: 'live-tracking', label: 'Route Map', icon: Navigation },
    { id: 'driver-emergency', label: 'SOS', icon: AlertTriangle },
  ];

  const adminItems = [
    { id: 'admin-dashboard', label: 'Control', icon: LayoutDashboard },
    { id: 'admin-fleet-map', label: 'Fleet Map', icon: Map },
    { id: 'admin-incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'admin-passes', label: 'Passes', icon: CreditCard },
  ];

  const items =
    role === 'student'
      ? studentItems
      : role === 'driver'
      ? driverItems
      : adminItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden z-40 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-blue-600' : ''}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
