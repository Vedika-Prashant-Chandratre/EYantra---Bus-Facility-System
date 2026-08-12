import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, AlertTriangle, Play, Pause, RefreshCw, Zap, ShieldAlert, Clock, Gauge } from 'lucide-react';

export const DemoControlPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    tripState,
    setSimulationSpeed,
    triggerDemoBreakdown,
    triggerDemoAccident,
    triggerDemoDelay,
    resetDemoData,
    pauseTrip,
  } = useApp();

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-50">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm border-2 border-amber-300 animate-pulse"
        >
          <Sliders className="w-4 h-4" />
          <span>DEMO CONTROL PANEL</span>
        </button>
      )}

      {/* Expanded Controls Drawer */}
      {isOpen && (
        <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl max-w-sm w-80 sm:w-96 backdrop-blur-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900">Live Presentation Triggers</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-800 text-xs font-semibold px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded"
            >
              Close
            </button>
          </div>

          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Use these controls during your demo to trigger real-time bus movement, emergency alerts, or delays across Student, Driver & Admin dashboards simultaneously.
          </p>

          <div className="space-y-3">
            {/* Speed Control */}
            <div>
              <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Gauge className="w-3.5 h-3.5 text-blue-600" />
                Simulation Speed
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[1, 2, 5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setSimulationSpeed(speed)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      tripState.simulationSpeed === speed
                        ? 'bg-blue-600 border-blue-600 text-white shadow'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {speed}x {speed === 5 ? '⚡' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Pause/Resume Trip */}
            <div className="pt-1">
              <button
                onClick={() => pauseTrip()}
                className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition"
              >
                {tripState.isPaused ? (
                  <>
                    <Play className="w-4 h-4 text-emerald-600" />
                    <span>Resume Bus Simulation</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 text-amber-600" />
                    <span>Pause Bus Simulation</span>
                  </>
                )}
              </button>
            </div>

            {/* Emergency Triggers */}
            <div>
              <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Simulate Emergency Events
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={triggerDemoBreakdown}
                  className="py-2 px-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center justify-center gap-1.5 transition text-left"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Breakdown</span>
                </button>
                <button
                  onClick={triggerDemoAccident}
                  className="py-2 px-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center justify-center gap-1.5 transition text-left"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Accident</span>
                </button>
              </div>
            </div>

            {/* Delay Trigger */}
            <button
              onClick={triggerDemoDelay}
              className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-semibold text-amber-800 flex items-center justify-center gap-2 transition"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Simulate 15-Min Traffic Delay</span>
            </button>

            {/* Reset Demo */}
            <div className="pt-2 border-t border-slate-200">
              <button
                onClick={resetDemoData}
                className="w-full py-2 px-3 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-700 flex items-center justify-center gap-2 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo State to Default</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
