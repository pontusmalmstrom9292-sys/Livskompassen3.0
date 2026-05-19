import { FloatingDock } from './FloatingDock';
import { Compass, User } from 'lucide-react';
import { KompisAvatar } from '../kompis/KompisAvatar';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30 relative">
      
      {/* Toppmenyn */}
      <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 z-40 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-[#FDE68A]/20 bg-[#FDE68A]/10">
            <Compass className="w-5 h-5 text-[#FDE68A]" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-white">LivsKompassen</h1>
            <p className="text-[10px] text-[#FDE68A]/60 uppercase tracking-widest">System Integrity Active</p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5">
          <User className="w-5 h-5 text-slate-400" />
        </div>
      </header>

      {/* Innehållet i mitten */}
      <main className="pt-28 pb-32 px-6 max-w-2xl mx-auto">
        {children}
      </main>

      {/* Kompis Avatar - Flytande */}
      <div className="fixed bottom-24 right-6 z-50">
        <KompisAvatar state="idle" size="sm" />
      </div>

      {/* Bottenmenyn */}
      <FloatingDock />
    </div>
  );
}