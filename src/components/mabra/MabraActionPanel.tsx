import { useState } from 'react';
import { Activity, Wind, Moon } from 'lucide-react';
import { MabraCheckinModal } from './MabraCheckinModal';

export function MabraActionPanel() {
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);

  const actions = [
    {
      id: 'checkin',
      title: 'Ny incheckning',
      description: 'Skatta ditt mående och registrera dagens status.',
      icon: Activity,
      onClick: () => setIsCheckinOpen(true),
      color: 'text-accent',
      bgGlow: 'hover:shadow-accent-glow hover:border-accent/30',
    },
    {
      id: 'breathing',
      title: 'Andningsövning',
      description: 'Hitta lugnet med en guidad andningssekvens.',
      icon: Wind,
      onClick: () => console.log('Andningsövning startad'),
      color: 'text-accent',
      bgGlow: 'hover:shadow-accent-glow hover:border-accent/30',
    },
    {
      id: 'sleep',
      title: 'Sömnlogg',
      description: 'Registrera din sömnkvalitet och återhämtning.',
      icon: Moon,
      onClick: () => console.log('Sömnlogg startad'),
      color: 'text-accent',
      bgGlow: 'hover:shadow-accent-glow hover:border-accent/30',
    },
  ];

  return (
    <>
      <div className="calm-card p-6 border border-border/30 bg-surface-2/70 backdrop-blur-xl h-full flex flex-col justify-between">
        <div>
          <h2 className="font-display-serif text-lg text-accent mb-2">Snabbåtgärder</h2>
          <p className="text-xs text-text-muted mb-6">
            Välj en aktivitet för att främja din kognitiva återhämtning och logga ditt mående.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className={`flex min-h-11 w-full transform items-start gap-4 rounded-2xl border border-border/20 bg-surface/40 p-4 text-left transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 group ${action.bgGlow}`}
                >
                  <div className={`p-2.5 bg-surface-2 border border-border/10 rounded-xl ${action.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-semibold text-white/95 group-hover:text-accent transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-text-muted group-hover:text-text-muted transition-colors leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <MabraCheckinModal 
        isOpen={isCheckinOpen} 
        onClose={() => setIsCheckinOpen(false)} 
      />
    </>
  );
}
