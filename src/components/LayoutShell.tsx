import React, { lazy, Suspense } from 'react';
import { useNavigationStore, NavView } from '../store/NavigationStore';
import OracleDashboard from '../modules/oracle/OracleDashboard';
import { MorningCompass } from '../modules/morning/MorningCompass';
import { Compass, Eye, ShieldCheck } from 'lucide-react';

const VaultOverview = lazy(() => import('./VaultOverview'));

export const LayoutShell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { activeView, setActiveView } = useNavigationStore();

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col relative overflow-hidden">
      {/* Navigation Bridge */}
      <header className="sticky top-0 z-50 w-full bg-[#020617]/80 backdrop-blur-md border-b border-[#818CF8]/20">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => setActiveView(NavView.COMPASS)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              activeView === NavView.COMPASS
                ? 'bg-[#FDE68A]/10 text-[#FDE68A]'
                : 'text-[#818CF8] hover:bg-[#818CF8]/10'
            }`}
          >
            <Compass size={18} />
            <span className="font-medium text-sm">Kompass</span>
          </button>
          
          <div className="w-px h-8 bg-[#818CF8]/20" />
          
          <button
            onClick={() => setActiveView(NavView.VAULT)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              activeView === NavView.VAULT
                ? 'bg-[#FDE68A]/10 text-[#FDE68A]'
                : 'text-[#818CF8] hover:bg-[#818CF8]/10'
            }`}
          >
            <ShieldCheck size={18} />
            <span className="font-medium text-sm">Valvet</span>
          </button>

          <div className="w-px h-8 bg-[#818CF8]/20" />
          
          <button
            onClick={() => setActiveView(NavView.ORACLE)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              activeView === NavView.ORACLE
                ? 'bg-[#FDE68A]/10 text-[#FDE68A]'
                : 'text-[#818CF8] hover:bg-[#818CF8]/10'
            }`}
          >
            <Eye size={18} />
            <span className="font-medium text-sm">Orakel</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center relative">
        <div className="w-full max-w-4xl h-full pb-20">
          <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FDE68A]"></div></div>}>
            {activeView === NavView.COMPASS && <MorningCompass />}
            {activeView === NavView.ORACLE && <OracleDashboard />}
            {activeView === NavView.VAULT && <VaultOverview />}
          </Suspense>
        </div>
      </main>

      {/* Hidden children to keep app tree intact if wrapping routes */}
      <div className="hidden">
        {children}
      </div>
    </div>
  );
};
