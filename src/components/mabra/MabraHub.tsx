import { MabraPulseWidget } from '@/modules/dashboard/components/MabraPulseWidget';
import { ProtectedModule } from '../layout/ProtectedModule';
import { MabraActionPanel } from './MabraActionPanel';

function MabraHubContent() {
  return (
    <div 
      className="w-full h-full min-h-[80vh] p-4 sm:p-6 md:p-8 text-text transition-colors duration-300 relative"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between mb-4">
          <h1 className="font-display-serif text-3xl text-accent tracking-wide">MåBra</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vänster kolumn: MåBra-puls */}
          <div className="flex flex-col h-full">
            <MabraPulseWidget />
          </div>

          {/* Höger kolumn: Interaktiv kontrollpanel */}
          <div className="flex flex-col h-full">
            <MabraActionPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MabraHub() {
  return (
    <ProtectedModule>
      <MabraHubContent />
    </ProtectedModule>
  );
}
