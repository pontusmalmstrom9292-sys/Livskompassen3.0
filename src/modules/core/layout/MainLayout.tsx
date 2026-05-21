import { FloatingDock } from './FloatingDock';
import { AmbientBackground } from './AmbientBackground';
import { KompisAvatar } from '../../kompis/components/KompisAvatar';
import { AccountAuthMenu } from '../auth/AccountAuthMenu';
import { Compass } from 'lucide-react';
import { useStore } from '../store';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const kompisAuraActive = useStore((s) => s.system.kompisAuraActive);

  return (
    <div className="relative min-h-screen bg-bg text-text font-sans selection:bg-accent/30">
      <AmbientBackground />

      <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-border bg-bg/90 px-5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
            <Compass className="h-4 w-4 text-accent" />
          </div>
          <h1 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-text">
            Livskompassen
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <AccountAuthMenu />
          <KompisAvatar
            size="sm"
            state={kompisAuraActive ? 'analyzing' : 'idle'}
            className="border-border-strong"
          />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-5 pb-36 pt-24">{children}</main>

      <FloatingDock />
    </div>
  );
}
