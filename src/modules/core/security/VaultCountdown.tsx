import { useEffect, useState } from 'react';
import { VAULT_SESSION_IDLE_MS } from '../auth/sessionService';

export function VaultCountdown() {
  const [remaining, setRemaining] = useState(VAULT_SESSION_IDLE_MS);

  useEffect(() => {
    let lastActivity = Date.now();
    const bump = () => { lastActivity = Date.now(); };
    
    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll'];
    for (const e of events) window.addEventListener(e, bump, { passive: true });

    const interval = setInterval(() => {
      const msLeft = Math.max(0, VAULT_SESSION_IDLE_MS - (Date.now() - lastActivity));
      setRemaining(msLeft);
    }, 1000);

    return () => {
      clearInterval(interval);
      for (const e of events) window.removeEventListener(e, bump);
    };
  }, []);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  
  // Show in warning color if less than 5 minutes
  const isWarning = remaining < 5 * 60 * 1000;

  return (
    <div className={`flex items-center gap-2 text-xs font-mono rounded-lg px-2 py-1 border transition-colors ${
      isWarning ? 'text-warning border-warning/30 bg-warning/10' : 'text-text-dim border-border/20 bg-surface-2/30'
    }`}>
      <span className="opacity-50">Låses om:</span>
      <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
    </div>
  );
}
