import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Sprout, Users, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';

export function FloatingDock() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      id: 'hem',
      label: 'Hem',
      path: '/',
      icon: <Home className="h-5 w-5" />,
      glow: 'shadow-[0_-4px_12px_rgba(212,175,55,0.2)] text-accent',
    },
    {
      id: 'vardag',
      label: 'Vardag',
      path: '/vardagen',
      icon: <Sprout className="h-5 w-5" />,
      glow: 'shadow-[0_-4px_12px_rgba(212,175,55,0.2)] text-accent',
    },
    {
      id: 'familj',
      label: 'Familj',
      path: '/familjen',
      icon: <Users className="h-5 w-5" />,
      glow: 'shadow-[0_-4px_12px_rgba(99,102,241,0.25)] text-indigo-400',
    },
    {
      id: 'dagbok',
      label: 'Dagbok',
      path: '/dagbok',
      icon: <BookOpen className="h-5 w-5" />,
      glow: 'shadow-[0_-4px_12px_rgba(99,102,241,0.25)] text-indigo-400',
    },
  ];

  const isItemActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 px-2 animate-fade-in">
      <nav
        className="relative flex items-center justify-around rounded-full border border-border/30 bg-surface-1/70 px-3 py-2.5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
        aria-label="Huvudnavigation"
      >
        {navItems.map((item) => {
          const active = isItemActive(item.path);
          const glowParts = item.glow.split(' ');
          const glowShadow = glowParts[0];
          const glowText = glowParts[1];

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.path)}
              className="group relative flex cursor-pointer flex-col items-center justify-center rounded-full border-0 bg-transparent px-3 py-1 transition-all duration-300"
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
            >
              <div
                className={clsx(
                  'absolute inset-0 -z-10 rounded-full transition-all duration-300',
                  active
                    ? 'scale-110 border border-border/20 bg-surface-3/60'
                    : 'scale-75 bg-surface-2 opacity-0 group-hover:scale-95 group-hover:opacity-40',
                )}
              />

              <div
                className={clsx(
                  'relative transition-transform duration-300',
                  active ? clsx('scale-110', glowText) : 'text-text-dim group-hover:text-text',
                )}
              >
                {item.icon}

                {active && (
                  <span
                    className={clsx(
                      'absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-current',
                      glowShadow,
                    )}
                  />
                )}
              </div>

              <span
                className={clsx(
                  'mt-1 text-[9px] font-medium tracking-wide transition-all duration-300',
                  active
                    ? 'translate-y-0 text-text opacity-100'
                    : 'translate-y-1 text-text-dim opacity-0 group-hover:opacity-40',
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
