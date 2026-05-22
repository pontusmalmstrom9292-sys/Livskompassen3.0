import { Shield } from 'lucide-react';
import { BARNFOKUS_BANNER } from '../constants/childProfiles';

export function BarnfokusBanner() {
  return (
    <div className="barnfokus-banner glass-card p-4">
      <div className="flex items-start gap-3">
        <Shield className="h-5 w-5 shrink-0 text-accent-secondary" strokeWidth={1.75} />
        <div>
          <p className="text-[10px] uppercase tracking-widest text-accent-secondary/80">
            {BARNFOKUS_BANNER.title}
          </p>
          <p className="mt-2 text-sm text-text-muted leading-relaxed">{BARNFOKUS_BANNER.lead}</p>
        </div>
      </div>
    </div>
  );
}
