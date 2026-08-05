import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import { useAppStore } from '../../store/useAppStore';

const AppLayout: React.FC = () => {
  const { fetchData } = useAppStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex h-screen w-full max-w-full overflow-hidden bg-[#0B0F19] text-slate-100 relative">
      {/* Icon Sidebar for Desktop */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <Header />
        
        {/* Content View with Mobile Bottom Padding to prevent BottomNav overlap */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-24 md:pb-8 relative z-0">
          <Outlet />
        </main>
      </div>

      {/* Floating Glass Icon Dock for Mobile */}
      <BottomNav />

      {/* Background ambient neon glow effects in Teal and Pink */}
      <div className="fixed top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-pink-500/10 blur-[130px] pointer-events-none -z-10" />
    </div>
  );
};

export default AppLayout;
