import { useState, useRef, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/design-system';
import { ReflectionEditor } from '@/features/lifeJournal/diary/diary/components/ReflectionEditor';

export function DagbokBurnDelegate() {
  const [text, setText] = useState('');
  const [burning, setBurning] = useState(false);
  const burnTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (burnTimerRef.current != null) {
        window.clearTimeout(burnTimerRef.current);
      }
    };
  }, []);

  const handleBurn = () => {
    if (!text.trim()) return;
    setBurning(true);
    if (burnTimerRef.current != null) {
      window.clearTimeout(burnTimerRef.current);
    }
    burnTimerRef.current = window.setTimeout(() => {
      setText('');
      setBurning(false);
      burnTimerRef.current = null;
    }, 1500);
  };

  return (
    <div className="dagbok-delegate dagbok-delegate--burn" data-write-target="none">
      <header className="mb-4 space-y-1">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Bränn
        </p>
        <p className="text-xs text-text-muted">
          Dina ord förintas när du är klar. Zero Footprint – ingenting skickas till databasen.
        </p>
      </header>
      
      <div className={clsx(
        'transition-all duration-1000',
        burning && 'opacity-0 scale-95 blur-sm brightness-150 saturate-200 sepia'
      )}>
        <ReflectionEditor
          text={text}
          onChange={setText}
          placeholder="Skriv det som bränner... det kommer inte finnas kvar."
        />
        
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            onClick={handleBurn}
            disabled={burning || !text.trim()}
            variant="accent"
            className={clsx(
              'shadow-sm transition-all flex items-center gap-2',
              burning && 'border-red-500 bg-red-500 text-white',
            )}
          >
            <Flame className="w-4 h-4" />
            {burning ? 'Bränner...' : 'Bränn'}
          </Button>
        </div>
      </div>
    </div>
  );
}
