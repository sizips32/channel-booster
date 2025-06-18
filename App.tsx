
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import DashboardPage from './pages/DashboardPage';
import ContentPlanningPage from './pages/ContentPlanningPage';
import VideoProductionPage from './pages/VideoProductionPage';
import { useAppContext } from './contexts/AppContext';

const App: React.FC = () => {
  const { selectedChannel, setSelectedChannel, channels } = useAppContext();

  // Add 'dark' class to body for scrollbar styling
  useEffect(() => {
    document.body.classList.add('dark');
    return () => {
      document.body.classList.remove('dark');
    };
  }, []);

  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-900 text-slate-100">
        <Navigation />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-slate-800 p-4 shadow-md flex justify-between items-center">
            <h1 className="text-xl font-semibold text-slate-50">Channel Booster (채널 부스터)</h1>
            <div>
              <select
                value={selectedChannel.id}
                onChange={(e) => {
                  const channel = channels.find(c => c.id === e.target.value);
                  if (channel) setSelectedChannel(channel);
                }}
                className="bg-slate-700 text-slate-50 p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {channels.map(channel => (
                  <option key={channel.id} value={channel.id}>{channel.name}</option>
                ))}
              </select>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto bg-slate-100 text-slate-800">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/planning" element={<ContentPlanningPage />} />
              <Route path="/planning/:taskId" element={<ContentPlanningPage />} />
              <Route path="/production/:taskId" element={<VideoProductionPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;