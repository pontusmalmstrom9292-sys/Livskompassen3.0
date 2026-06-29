import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, BookOpen, Loader2, Sparkles } from 'lucide-react';
import {
  BrusfiltretSupermoduleShell,
  type BrusfiltretSupermoduleTab,
} from '@/modules/sandbox/brusfiltret/BrusfiltretSupermoduleShell';
import { BiffPublicPanel } from '@/features/family/safeHarbor/components/BiffPublicPanel';
import brusfiltretKanonRef from '../../../../docs/design/references/brusfiltret-modul-kanon-ref.png';

const MOCK_REPLY =
  'Noterat. Vi håller oss till gällande schema för onsdag 17:00. Hälsningar.';

const MOCK_JADE = [
  {
    label: 'Justifiering',
    text: 'Du försöker få motparten att förstå dina skäl — Grey Rock undviker detta.',
  },
  {
    label: 'Explikering',
    text: 'Förklaringar ger bränsle. Svara bara ja/nej eller ren logistik.',
  },
];

export function BrusfiltretSupermoduleLabPage() {
  const [tab, setTab] = useState<BrusfiltretSupermoduleTab>('klistra_in');
  const [demoMessage, setDemoMessage] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoReply, setDemoReply] = useState<string | null>(null);
  const [livePanel, setLivePanel] = useState(false);

  const showJade = useMemo(
    () =>
      /förklara|eftersom|därför att|måste förstå/i.test(demoMessage) && demoMessage.trim().length > 8,
    [demoMessage],
  );

  const handleDemoSubmit = () => {
    if (!demoMessage.trim()) return;
    setDemoLoading(true);
    window.setTimeout(() => {
      setDemoReply(MOCK_REPLY);
      setDemoLoading(false);
      setTab('svar');
    }, 700);
  };

  const footer = (
    <>
      <p className="bf-supermodule__footer-text">
        Taktik-lexikon är metod och begrepp (hoovering, smear, ekonomisk kontroll) — bakom Valv-PIN.
        Hamn ger bara BIFF-svar på ditt meddelande.
      </p>
      <button type="button" className="bf-supermodule__footer-btn">
        <BookOpen className="h-3.5 w-3.5" aria-hidden />
        Taktik-lexikon (Valv · PIN)
      </button>
    </>
  );

  return (
    <div className="module-list theme-lab-page bf-supermodule-lab">
      <header className="glass-card p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-text-dim">Theme Lab · Variant B</p>
        <h1 className="mt-1 font-display-serif text-xl tracking-[0.12em] text-accent">
          Brusfiltret SuperModule
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Indigo silo · flikrad · samma 5-lagers anatomi som kanon. Prototyp — inte prod-wire än.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/dev/theme-lab" className="ds-btn ds-btn--ghost text-xs">
            ← Theme Lab
          </Link>
          <Link to="/widget/hamn" className="ds-btn ds-btn--accent text-xs">
            Prod Brusfiltret
          </Link>
          <button
            type="button"
            className="ds-btn ds-btn--ghost text-xs"
            onClick={() => setLivePanel((v) => !v)}
          >
            {livePanel ? 'Demo-läge' : 'Live BiffPublicPanel'}
          </button>
        </div>
      </header>

      <section className="glass-card p-4 bf-supermodule-lab__compare">
        <div className="bf-supermodule-lab__ref">
          <h2 className="text-xs uppercase tracking-widest text-text-dim">Referens (kanon)</h2>
          <img
            src={brusfiltretKanonRef}
            alt="Brusfiltret modul referens"
            className="mt-2"
          />
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-widest text-text-dim">Live prototyp B</h2>
          <div className="mt-2">
            <BrusfiltretSupermoduleShell
              activeTab={tab}
              onTabChange={setTab}
              footer={footer}
            >
              {tab === 'klistra_in' ? (
                livePanel ? (
                  <BiffPublicPanel />
                ) : (
                  <>
                    <textarea
                      value={demoMessage}
                      onChange={(e) => setDemoMessage(e.target.value)}
                      placeholder="Klistra in sms eller skriv ditt tänkta svar till motparten (inget JADE)…"
                      className="bf-supermodule__textarea"
                    />
                    {showJade ? (
                      <div className="bf-supermodule__jade">
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-danger">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          JADE-mönster detekterade
                        </p>
                        <ul className="space-y-1 text-xs text-text-muted">
                          {MOCK_JADE.map((item) => (
                            <li key={item.label}>
                              <strong className="text-text">{item.label}:</strong> {item.text}
                            </li>
                          ))}
                        </ul>
                        <button type="button" className="ds-btn ds-btn--ghost mt-2 text-[11px]">
                          <Sparkles className="mr-1 inline h-3.5 w-3.5" />
                          Städa till Grey Rock-mall
                        </button>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      className="bf-supermodule__cta"
                      disabled={!demoMessage.trim() || demoLoading}
                      onClick={handleDemoSubmit}
                    >
                      {demoLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Få Grey Rock-svar'
                      )}
                    </button>
                    <p className="bf-supermodule__help">
                      Tomt fält — klistra in meddelandet. Inget sparas förrän du trycker Klar. Behöver du
                      riskanalys eller bevisarkiv?{' '}
                      <Link to="/valvet?vaultTab=hamn_analys">Valv → Hamn · Analys</Link>
                    </p>
                  </>
                )
              ) : null}

              {tab === 'svar' ? (
                demoReply || livePanel ? (
                  <div className="space-y-3">
                    <p className="bf-supermodule__reply">
                      {livePanel && !demoReply
                        ? 'Kör analys i fliken Klistra in — svaret visas här.'
                        : demoReply}
                    </p>
                    <button type="button" className="ds-btn ds-btn--ghost w-full text-xs">
                      Kopiera · Klar
                    </button>
                  </div>
                ) : (
                  <p className="bf-supermodule__panel-empty">
                    Inga svar än. Börja i fliken Klistra in.
                  </p>
                )
              ) : null}

              {tab === 'jade' ? (
                showJade || livePanel ? (
                  <ul className="space-y-2 text-sm text-text-muted">
                    {(livePanel ? MOCK_JADE : MOCK_JADE).map((item) => (
                      <li
                        key={item.label}
                        className="rounded-lg border border-danger/20 bg-danger/5 p-3"
                      >
                        <strong className="text-text">{item.label}</strong>
                        <p className="mt-1 text-xs">{item.text}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="bf-supermodule__panel-empty">
                    Inga JADE-flaggor — skriv i Klistra in för realtidsdetektion.
                  </p>
                )
              ) : null}

              {tab === 'spara' ? (
                <div className="space-y-2">
                  <button type="button" className="bf-supermodule__cta">
                    Sortera till arkiv
                  </button>
                  <button type="button" className="ds-btn ds-btn--ghost w-full text-xs">
                    Spara som bevis (Valv · HITL)
                  </button>
                  <p className="bf-supermodule__help">
                    WORM — inget sparas automatiskt. Du väljer manuellt.
                  </p>
                </div>
              ) : null}
            </BrusfiltretSupermoduleShell>
          </div>
        </div>
      </section>

      <section className="glass-card p-4">
        <h2 className="text-xs uppercase tracking-widest text-text-dim">Nästa steg (ej kodat)</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-text-muted">
          <li>Wire shell till `/widget/hamn` efter godkännande i Theme Lab</li>
          <li>Variant C (MåBra emerald) och D (Valv gold) — separata lab-routes</li>
          <li>Behåll en primär CTA per flik — se BRUSFILTRET-MODUL-KANON.md</li>
        </ul>
      </section>
    </div>
  );
}
