import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { ExecutiveDecorCompass, ExecutivePhoneShell, type ExecutiveNavId } from './exec';

const ACCOUNTS = [
  { id: 'biz', name: 'Företag', balance: '24 580 kr' },
  { id: 'priv', name: 'Privat', balance: '8 420 kr' },
  { id: 'spar', name: 'Sparkonto', balance: '12 100 kr' },
] as const;

const TRANSACTIONS = [
  { id: '1', label: 'ICA Maxi', amount: '-342 kr', positive: false },
  { id: '2', label: 'Lön', amount: '+28 400 kr', positive: true },
  { id: '3', label: 'Netflix', amount: '-119 kr', positive: false },
] as const;

const CHART_POINTS = [40, 52, 48, 61, 58, 72, 68, 80, 76, 88, 84, 92];

type Props = { onStatus?: (msg: string) => void };

/** EKONOMI — pixel-match skärm 2. Mockdata only. */
export function FreeportEkonomiLab({ onStatus }: Props) {
  const [navActive, setNavActive] = useState<ExecutiveNavId>('mer');

  return (
    <ExecutivePhoneShell
      navActive={navActive}
      onNav={(id) => {
        setNavActive(id);
        onStatus?.(`Nav: ${id}`);
      }}
    >
      <header className="design-freeport__exec-header">
        <h2 className="design-freeport__exec-screen-title">Ekonomi</h2>
        <ExecutiveDecorCompass className="design-freeport__exec-header-compass design-freeport__exec-header-compass--lg" />
      </header>

      <article className="design-freeport__exec-card design-freeport__exec-card--chrome design-freeport__exec-card--balance">
        <p className="design-freeport__exec-label">Månadsöversikt</p>
        <p className="design-freeport__exec-balance">45 100 kr</p>
        <p className="design-freeport__exec-balance-sub">Tillgängligt denna månad</p>
        <div className="design-freeport__exec-graph design-freeport__exec-graph--glow" aria-hidden>
          <svg viewBox="0 0 280 100" className="design-freeport__exec-graph-svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id="execChartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(212,175,55,0.35)" />
                <stop offset="100%" stopColor="rgba(212,175,55,0)" />
              </linearGradient>
            </defs>
            <path
              d={`M0,${100 - CHART_POINTS[0]} ${CHART_POINTS.map((p, i) => `L${(i / (CHART_POINTS.length - 1)) * 280},${100 - p}`).join(' ')} L280,100 L0,100 Z`}
              fill="url(#execChartFill)"
            />
            <polyline
              points={CHART_POINTS.map((p, i) => `${(i / (CHART_POINTS.length - 1)) * 280},${100 - p}`).join(' ')}
              fill="none"
              stroke="#d4af37"
              strokeWidth="2"
            />
          </svg>
          <div className="design-freeport__exec-graph-meta">
            <TrendingUp className="h-4 w-4 text-[var(--fp-accent)]" />
            <span>+12% mot förra månaden</span>
          </div>
        </div>
      </article>

      <section className="design-freeport__exec-card design-freeport__exec-card--chrome">
        <p className="design-freeport__exec-label">Konton</p>
        <ul className="design-freeport__exec-list design-freeport__exec-list--plates">
          {ACCOUNTS.map((a) => (
            <li key={a.id}>
              <div className="design-freeport__exec-list-row design-freeport__exec-list-row--static">
                <span className="design-freeport__exec-list-title">{a.name}</span>
                <span className="design-freeport__exec-list-balance">{a.balance}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="design-freeport__exec-card">
        <p className="design-freeport__exec-label">Senaste transaktioner</p>
        <ul className="design-freeport__exec-list">
          {TRANSACTIONS.map((t) => (
            <li key={t.id}>
              <div className="design-freeport__exec-list-row design-freeport__exec-list-row--static">
                <span className="design-freeport__exec-list-title">{t.label}</span>
                <span
                  className={
                    t.positive
                      ? 'design-freeport__exec-amount design-freeport__exec-amount--pos'
                      : 'design-freeport__exec-amount'
                  }
                >
                  {t.amount}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="design-freeport__sandbox-note">
        <Link to="/" className="design-freeport__link">
          ← Prod
        </Link>
        {' · '}
        Mock — ej Firestore
      </p>
    </ExecutivePhoneShell>
  );
}
