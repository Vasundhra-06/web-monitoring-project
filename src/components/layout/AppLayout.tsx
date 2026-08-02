import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppStore } from '../../store/useAppStore';

const AppLayout: React.FC = () => {
  const { fetchData } = useAppStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div className="flex h-screen overflow-hidden bg-[#0F172A] text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-8 relative z-0">
          <Outlet />
        </main>
      </div>
      
      {/* Background ambient glow effect */}
      <div className="fixed top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none -z-10" />
    </div>
  );
};

export default AppLayout;
