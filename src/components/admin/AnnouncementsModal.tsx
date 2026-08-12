import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Megaphone, Send, CheckCircle2 } from 'lucide-react';

export const AnnouncementsModal: React.FC = () => {
  const { sendAnnouncement, routes } = useApp();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRoute, setTargetRoute] = useState<string>('all');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    sendAnnouncement(title, message, targetRoute === 'all' ? undefined : targetRoute);
    setSentSuccess(true);
    setTitle('');
    setMessage('');
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 pb-8">
      
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 shadow-lg text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Broadcast Transport Announcement</h1>
            <p className="text-xs text-slate-400 mt-0.5">Send high-priority notifications to student mobile app feeds.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-slate-800 max-w-xl mx-auto space-y-4">
        
        {sentSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Announcement broadcasted successfully to student feeds!</span>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-700 font-semibold block mb-1">Target Recipient Audience</label>
            <select
              value={targetRoute}
              onChange={(e) => setTargetRoute(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Registered Students (All Routes)</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.code} – {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">Announcement Title</label>
            <input
              type="text"
              required
              placeholder="E.g., Revised Departure Time for Tomorrow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">Message Content</label>
            <textarea
              required
              rows={4}
              placeholder="Type your official announcement here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Broadcast Announcement Now
          </button>
        </form>

      </div>

    </div>
  );
};
