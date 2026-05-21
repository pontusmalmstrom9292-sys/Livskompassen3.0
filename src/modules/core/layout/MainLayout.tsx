import { FloatingDock } from './FloatingDock';
import { AmbientBackground } from './AmbientBackground';
import { Compass, User } from 'lucide-react';
import { KompisAvatar } from '../../kompis/components/KompisAvatar';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-bg text-text font-sans selection:bg-accent/30">
      <AmbientBackground />

      <header className="fixed top-0 left-0 right-0 z-40 flex h-20 items-center justify-between border-b border-border bg-bg/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10">
            <Compass className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-text">
              LivsKompassen
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-accent/60">
              System Integrity Active
            </p>
          </div>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border-strong bg-surface/60">
          <User className="h-5 w-5 text-text-dim" />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-6 pb-32 pt-28">{children}</main>

      <div className="fixed bottom-24 right-6 z-50">
        <KompisAvatar state="idle" size="sm" />
      </div>

      <FloatingDock />
    </div>
  );
}
