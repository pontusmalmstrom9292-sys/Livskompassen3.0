import { useCallback, useState } from 'react';
import { ChevronDown, Home, Shield, Users, CalendarDays } from 'lucide-react';
import { LivskompassMark } from '@/core/ui/LivskompassMark';
import {
  HEM_V3_DEVELOPMENT_CARDS,
  HEM_V3_SUPERMODS,
  HEM_V3_SUPERMOD_COPY,
  type HemV3SuperModId,
} from '@/core/home/hemV3DevelopmentCards';

type NavId = 'hem' | 'vardagen' | 'familjen' | 'valv';

const NAV_ITEMS: { id: NavId; label: string; icon: typeof Home }[] = [
  { id: 'hem', label: 'Hem', icon: Home },
  { id: 'vardagen', label: 'Vardagen', icon: CalendarDays },
  { id: 'familjen', label: 'Familjen', icon: Users },
  { id: 'valv', label: 'Valv', icon: Shield },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 10) return 'God morgon';
  if (h < 17) return 'God eftermiddag';
  return 'God kväll';
}

/** Obsidian Depth v2 — OD-estetik + Hem v3 (hub, supermod, 12 kort). Sandbox only. */
export function OdDepthHemV3Lab({ onStatus }: { onStatus?: (msg: string) => void }) {
  const [activeMod, setActiveMod] = useState<HemV3SuperModId>('Dagbok');
  const [activeNav, setActiveNav] = useState<NavId>('hem');
  const [railOpen, setRailOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [hubZone, setHubZone] = useState<'utveckling' | 'minne' | 'quiz'>('utveckling');

  const modCopy = HEM_V3_SUPERMOD_COPY[activeMod];
  const selectedCard = HEM_V3_DEVELOPMENT_CARDS.find((c) => c.id === selectedCardId);

  const handleCard = useCallback(
    (id: string) => {
      setSelectedCardId(id);
      if (!railOpen) setRailOpen(true);
      const card = HEM_V3_DEVELOPMENT_CARDS.find((c) => c.id === id);
      onStatus?.(`Kort: ${card?.title ?? id}`);
    },
    [onStatus, railOpen],
  );

  return (
    <div className="od-depth">
      <div className="od-depth__phone od-depth-v2__phone" role="presentation">
        <div className="od-depth__scroll od-depth-v2__scroll">
          <header className="od-depth-v2__app-bar">
            <button type="button" className="od-depth-v2__chip" aria-label="Meny">
              ☰
            </button>
            <div className="od-depth-v2__greeting">
              <p className="od-depth-v2__greeting-main">{getGreeting()}, Pontus</p>
              <p className="od-depth-v2__greeting-sub">Onsdag · ett steg i taget</p>
            </div>
            <button type="button" className="od-depth-v2__chip" aria-label="Profil">
              K
            </button>
          </header>

          <p className="od-depth-v2__zone-brand">Livskompassen — Hem</p>

          <div className="od-depth-v2__compass" aria-hidden>
            <LivskompassMark className="od-depth-v2__compass-mark" />
          </div>

          <div className="od-depth-v2__supermod" aria-label="Supermoduler">
            {HEM_V3_SUPERMODS.map((mod) => (
              <button
                key={mod.id}
                type="button"
                className={[
                  'od-depth-v2__supermod-btn',
                  activeMod === mod.id ? 'od-depth-v2__supermod-btn--on' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  setActiveMod(mod.id);
                  onStatus?.(`Supermodul: ${mod.label}`);
                }}
              >
                <span className="od-depth-v2__supermod-icon">{mod.icon}</span>
                <span className="od-depth-v2__supermod-label">{mod.label}</span>
              </button>
            ))}
          </div>

          <article className="od-depth-v2__hub">
            <header className="od-depth-v2__hub-head">
              <h3 className="od-depth-v2__hub-focus">{modCopy.focus}</h3>
              <span className="od-depth-v2__hub-focus-sub">{modCopy.focusSub}</span>
            </header>
            <div className="od-depth-v2__hub-body">
              <div className="od-depth-v2__hub-meta">
                <span className="od-depth-v2__hub-chip">Ons 18 jun</span>
                <span className="od-depth-v2__hub-chip od-depth-v2__hub-chip--teal">Kapacitet · Lugn</span>
                <span className="od-depth-v2__hub-meta-time">Senast 08:12</span>
              </div>
              <div className="od-depth-v2__hub-inset">{modCopy.sample || modCopy.placeholder}</div>
              <div className="od-depth-v2__hub-actions">
                <button type="button" className="od-depth-v2__hub-btn od-depth-v2__hub-btn--primary">
                  Spara rad
                </button>
                <button type="button" className="od-depth-v2__hub-btn" aria-label="Röst">
                  🎤
                </button>
                <button type="button" className="od-depth-v2__hub-btn" aria-label="Fyren">
                  ✦
                </button>
              </div>
              <div className="od-depth-v2__hub-zones">
                {(['utveckling', 'minne', 'quiz'] as const).map((z) => (
                  <button
                    key={z}
                    type="button"
                    className={[
                      'od-depth-v2__hub-zone',
                      hubZone === z ? 'od-depth-v2__hub-zone--on' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      setHubZone(z);
                      if (z === 'utveckling' && !railOpen) setRailOpen(true);
                    }}
                  >
                    {z === 'utveckling' ? 'Utveckling' : z === 'minne' ? 'Minne' : 'Quiz'}
                  </button>
                ))}
              </div>
              <p className="od-depth-v2__hub-last">
                <span className="od-depth-v2__hub-last-lbl">Senaste sparade</span>
                «Kvällen blev lugnare än jag trodde — ett steg räckte.»
              </p>
            </div>
          </article>

          <button
            type="button"
            className="od-depth-v2__rail-toggle"
            aria-expanded={railOpen}
            onClick={() => setRailOpen((v) => !v)}
          >
            <span>Utvecklingskort</span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${railOpen ? 'rotate-180' : ''}`} />
          </button>

          {railOpen ? (
            <div className="od-depth-v2__dev-rail" aria-label="12 kategorier">
              {HEM_V3_DEVELOPMENT_CARDS.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  className={[
                    'od-depth-v2__dev-card',
                    selectedCardId === card.id ? 'od-depth-v2__dev-card--sel' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleCard(card.id)}
                >
                  <span className="od-depth-v2__dev-cat">{card.title}</span>
                  <span className="od-depth-v2__dev-hint">{card.hint}</span>
                </button>
              ))}
            </div>
          ) : null}

          {selectedCard ? (
            <div className="od-depth-v2__card-detail">
              <p>{selectedCard.body}</p>
              <span className="od-depth-v2__card-detail-src">
                {selectedCard.title} · {selectedCard.hint}
              </span>
            </div>
          ) : null}

          <div className="od-depth-v2__mini-grid">
            <div className="od-depth-v2__mini-card">
              <p className="od-depth-v2__mini-lbl">Dagens steg</p>
              <p className="od-depth-v2__mini-line od-depth-v2__mini-line--done">Ring skola</p>
              <p className="od-depth-v2__mini-line">Simma 20 min</p>
            </div>
            <div className="od-depth-v2__mini-card">
              <p className="od-depth-v2__mini-lbl">Veckans lugn</p>
              <div className="od-depth-v2__spark" aria-hidden>
                <svg viewBox="0 0 120 24" preserveAspectRatio="none">
                  <polyline fill="none" stroke="#d4af37" strokeWidth="1.5" points="0,18 25,14 50,16 75,8 100,10 120,6" />
                </svg>
              </div>
              <p className="od-depth-v2__mini-trend">↑ stabilare sen fredag</p>
            </div>
          </div>

          <div className="od-depth-v2__feed">
            <p className="od-depth-v2__mini-lbl">Senaste inkast</p>
            <p className="od-depth-v2__feed-row">▦ Inkast igår 21:04 · Valv · 2 filer</p>
            <p className="od-depth-v2__feed-row">✎ Dagbok igår 07:40 · «Sov bättre efter simning»</p>
          </div>
        </div>

        <nav className="od-depth__dock" aria-label="Primär navigering">
          <div className="od-depth__dock-inner">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={['od-depth__dock-btn', isActive ? 'od-depth__dock-btn--active' : '']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => {
                    setActiveNav(item.id);
                    onStatus?.(`Nav: ${item.label}`);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="od-depth__dock-icon" strokeWidth={1.5} />
                  <span className="od-depth__dock-pip" aria-hidden />
                  <span className="od-depth__dock-label">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
