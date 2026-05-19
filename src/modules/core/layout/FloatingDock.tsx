import { Home, Shield, Sprout, Map } from 'lucide-react';

export function FloatingDock() {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-4 px-6 py-3 rounded-3xl bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 shadow-2xl">
        <button className="p-3 rounded-2xl bg-white/10 text-[#FDE68A]">
          <Home className="w-5 h-5" />
        </button>
        <button className="p-3 rounded-2xl text-slate-500 hover:text-white transition-colors">
          <Sprout className="w-5 h-5" />
        </button>
        <button className="p-3 rounded-2xl text-slate-500 hover:text-white transition-colors">
          <Shield className="w-5 h-5" />
        </button>
        {/* Här är din nya knapp för kartan */}
        <button className="p-3 rounded-2xl text-slate-500 hover:text-white transition-colors">
          <Map className="w-5 h-5" />
        </button>
      </nav>
    </div>
  );
}