import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/core/theme';
import { useStore } from '@/core/store';
import {
  OdForgeKompassSuperHub,
  applyOdForgeBridgeClass,
  isOdForgeBridgeActive,
} from '@/core/ui/forge';
import { pickQuote } from '@/core/copy/compassBannerQuotes';
import { getHomeCompassPhase, phaseLead } from './homeCompassPhase';

type Props = {
  onStatus?: (message: string) => void;
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 10) return 'God morgon';
  if (h < 17) return 'God eftermiddag';
  return 'God kväll';
}

/** Prod-wire — OD-obsidian-depth + FORGE_PROD_WIRE_ENABLED (ersätter adaptiv kort-yta). */
export function HomeForgeKompassBridge({ onStatus }: Props) {
  const navigate = useNavigate();
  const { themeId } = useTheme();
  const user = useStore((s) => s.user);
  const active = isOdForgeBridgeActive(themeId);
  const now = useMemo(() => new Date(), []);
  const phase = useMemo(() => getHomeCompassPhase(now), [now]);
  const tagline = useMemo(() => pickQuote(phase, now), [phase, now]);
  const [ctaPressed, setCtaPressed] = useState(false);

  useEffect(() => {
    applyOdForgeBridgeClass(active);
    return () => applyOdForgeBridgeClass(false);
  }, [active]);

  if (!active) return null;

  return (
    <div className="od-forge-bridge home-forge-kompass-bridge mb-4">
      <OdForgeKompassSuperHub
        greeting={getGreeting()}
        name={user?.email?.split('@')[0] ?? 'du'}
        tagline={tagline}
        profileLabel="Hemkompass — Forge preview"
        presenceDays={7}
        stepHint={phaseLead(phase)}
        ctaLabel="Fortsätt kompassen"
        ctaPressed={ctaPressed}
        userId={user?.uid}
        onCtaPointerDown={() => setCtaPressed(true)}
        onCtaPointerUp={() => setCtaPressed(false)}
        onWidgetSelect={(w) => {
          onStatus?.(`Widget: ${w.label}`);
          navigate(w.href);
        }}
        onDiscoveryStatus={onStatus}
      />
    </div>
  );
}
