import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HubPageShell } from '../../../core/layout/HubPageShell';
import { GoraHubTabBar } from '../../../core/navigation/GoraHubTabBar';
import { useStore } from '../../../core/store';
import {
  loadProjectAutomationRules,
  saveProjectAutomationRules,
} from '../api/projectAutomationApi';
import type { ProjectAutomationRule } from '../types';

function newRule(): ProjectAutomationRule {
  return {
    id: `rule_${Date.now()}`,
    label: 'Ny regel',
    matchPattern: '',
    action: 'create_task',
    enabled: true,
  };
}

/** Route: /projekt/regler — P4 automation (lokal persistens, kopplar till planering). */
export function ProjektReglerPage() {
  const user = useStore((s) => s.user);
  const [rules, setRules] = useState<ProjectAutomationRule[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      setRules([]);
      return;
    }
    setRules(loadProjectAutomationRules(user.uid));
  }, [user]);

  const persist = (next: ProjectAutomationRule[]) => {
    setRules(next);
    if (user) {
      saveProjectAutomationRules(user.uid, next);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <HubPageShell
      eyebrow="Göra"
      title="Regler & automation"
      lead="Projekt-automation lokalt på enheten. E-postrouting (ex → Hamn) ligger under Planering → Regler."
    >
      <GoraHubTabBar />
      <div className="flex flex-wrap gap-3 text-xs">
        <Link to="/projekt" className="text-text-dim hover:text-accent">
          ← Projekt
        </Link>
        <Link to="/planering?tab=regler" className="text-accent">
          E-postregler (Planering)
        </Link>
      </div>

      {!user && <p className="mt-3 text-sm text-text-muted">Logga in för att spara regler.</p>}

      {saved && <p className="mt-2 text-xs text-accent">Sparat lokalt på denna enhet.</p>}

      <div className="home-module-stack mt-4">
        {rules.length === 0 && (
          <p className="text-sm text-text-dim">Inga regler än. Lägg till en enkel När X → skapa uppgift.</p>
        )}
        {rules.map((rule) => (
          <div key={rule.id} className="elongated-module space-y-2 p-3">
            <label className="flex items-center gap-2 text-xs text-text-muted">
              <input
                type="checkbox"
                checked={rule.enabled}
                onChange={(e) =>
                  persist(rules.map((r) => (r.id === rule.id ? { ...r, enabled: e.target.checked } : r)))
                }
              />
              Aktiv
            </label>
            <input
              className="input-glass w-full text-sm"
              value={rule.label}
              onChange={(e) =>
                persist(rules.map((r) => (r.id === rule.id ? { ...r, label: e.target.value } : r)))
              }
              placeholder="Regelnamn"
            />
            <input
              className="input-glass w-full text-sm"
              value={rule.matchPattern}
              onChange={(e) =>
                persist(rules.map((r) => (r.id === rule.id ? { ...r, matchPattern: e.target.value } : r)))
              }
              placeholder="Matchar (ämne/avsändare/text)"
            />
            <select
              className="input-glass w-full text-sm"
              value={rule.action}
              onChange={(e) =>
                persist(
                  rules.map((r) =>
                    r.id === rule.id
                      ? { ...r, action: e.target.value as ProjectAutomationRule['action'] }
                      : r,
                  ),
                )
              }
            >
              <option value="create_task">Skapa uppgift i Handling</option>
              <option value="add_note">Lägg anteckning i projekt</option>
            </select>
            <button
              type="button"
              className="text-xs text-danger"
              onClick={() => persist(rules.filter((r) => r.id !== rule.id))}
            >
              Ta bort regel
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled={!user}
        className="btn-pill--accent mt-4 text-sm"
        onClick={() => persist([...rules, newRule()])}
      >
        + Lägg till regel
      </button>

      <p className="mt-4 text-xs text-text-dim">
        Granskningskö:{' '}
        <Link to="/planering?tab=inkorg" className="text-accent">
          Planering → Inkorg
        </Link>
        . Gmail OAuth är avsiktligt utanför P2.
      </p>
    </HubPageShell>
  );
}
