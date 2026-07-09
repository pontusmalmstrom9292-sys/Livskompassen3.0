import { ButtonLink } from '@/design-system';
import { Droplets } from 'lucide-react';
import { MabraNutritionQuickLog } from './MabraNutritionQuickLog';

type Props = {
  uid?: string;
  onLogged?: () => void;
};

/** B1 — primär näring på hub (snabb logg + länk till full vy). */
export function MabraNutritionHubPrimary({ uid, onLogged }: Props) {
  const storageUid = uid ?? 'local';

  return (
    <section className="calm-card glow-bottom-green rounded-2xl border border-border p-4">
      <div className="mb-3 flex items-start gap-3">
        <div className="rounded-xl border border-success/25 bg-success/10 p-2">
          <Droplets className="h-4 w-4 text-success" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-base text-text">Näring & vätska</h2>
          <p className="mt-0.5 text-xs text-text-dim">Snabb logg — ingen kaloriräkning, ingen export till Valv</p>
        </div>
      </div>

      <MabraNutritionQuickLog storageUid={storageUid} onLogged={onLogged} />

      <ButtonLink to="/mabra/verktyg/nutrition" variant="ghost" className="mt-3 inline-flex text-xs">
        Öppna full näring-vy
      </ButtonLink>
    </section>
  );
}
