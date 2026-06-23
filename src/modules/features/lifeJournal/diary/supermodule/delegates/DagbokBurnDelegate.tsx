import { useState } from 'react';
import { Flame } from 'lucide-react';
import { clsx } from 'clsx';
import { ReflectionEditor } from '@/features/lifeJournal/diary/diary/components/ReflectionEditor';

export function DagbokBurnDelegate() {
  const [text, setText] = useState('');
  const [burning, setBurning] = useState(false);

  const handleBurn = () => {
    if (!text.trim()) return;
    setBurning(true);
    // Låt den brinna i 1.5 sekunder
    setTimeout(() => {
      setText('');
      setBurning(false);
    }, 1500);
  };

  return (
    <div className="dagbok-delegate dagbok-delegate--burn" data-write-target="none">
      <header className="mb-4 space-y-1">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Vent & Delete
        </p>
        <p className="text-xs text-text-dim">
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
          <button 
            type="button" 
            onClick={handleBurn}
            disabled={burning || !text.trim()}
            className={clsx(
              "btn-pill shadow-sm transition-all flex items-center gap-2",
              burning ? "bg-red-500 text-white" : "btn-pill--primary"
            )}
          >
            <Flame className="w-4 h-4" />
            {burning ? 'Bränner...' : 'Bränn'}
          </button>
        </div>
      </div>
    </div>
  );
}
