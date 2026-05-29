This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: docs/design/KOMPASS-MODUL-SPEC.md, docs/design/references/KOMPASS-TRE-TIDPUNKTER.md, docs/evaluations/2026-05-29-kompass-widget-snabbstart-plan.md, docs/specs/modules/De-3-Kompasserna-SPEC.md, src/modules/core/home/**, src/modules/wellbeing/compasses/**, docs/design/ICON-STYLE-GUIDE.md, .context/locked-icons.md
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>

<directory_structure>
.context/
  locked-icons.md
docs/
  design/
    references/
      KOMPASS-TRE-TIDPUNKTER.md
    ICON-STYLE-GUIDE.md
    KOMPASS-MODUL-SPEC.md
  evaluations/
    2026-05-29-kompass-widget-snabbstart-plan.md
  specs/
    modules/
      De-3-Kompasserna-SPEC.md
src/
  modules/
    core/
      home/
        panels/
          HomeDagbokPanel.tsx
          HomeTaskPanel.tsx
          HomeVaultLearningPanel.tsx
        utils/
          homeGreeting.ts
        AdaptiveMemoryCards.tsx
        compassAdaptiveCards.ts
        DagensRiktningCard.tsx
        DagensRiktningCompassIcon.tsx
        homeActionCategories.ts
        HomeActionHub.tsx
        HomeGreeting.tsx
        HomeHeroCompass.tsx
        HomeHeroKanon.tsx
        HomeQuickModules.tsx
        HomeStreakChip.tsx
        kognitivSkoldVariants.ts
        LivskompassHero.tsx
        livskompassHeroConfig.ts
        useKognitivSkoldVariant.ts
        vaultLearningUtils.ts
    wellbeing/
      compasses/
        api/
          compassService.ts
        components/
          CompassModuleStrip.tsx
          CompassQuickWidgetRail.tsx
          DashboardPage.tsx
          KasamEvening.tsx
          KompassradPanel.tsx
          ParalysPanel.tsx
          VardagenPage.tsx
        config/
          compassFlows.ts
          compassTimeIcons.ts
          compassWidgetCatalog.ts
        hooks/
          useCompassTimeFlow.ts
        utils/
          compassAdvice.ts
          compassTheme.ts
          compassTime.ts
        index.ts
        module_plan.md
        README.md
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="docs/design/references/KOMPASS-TRE-TIDPUNKTER.md">
# Tre kompasser — tid på dygnet (sammanhängande familj)

**Bas (solnedgång):** [`KOMPASS-SOLNEDGANG-BAS.png`](./KOMPASS-SOLNEDGANG-BAS.png)  
**Familj:** Samma geometriska kompassros — olika **himmel + glöd** per läge.

| ID | Tid | Bakgrund | Kompass-glöd | App-ikon |
|----|-----|----------|--------------|----------|
| **K1 — Kväll** | 17–21 | Djup blå, sol precis under horisont | Varm amber, stjärnor täta | `kompass-tid-kvall-appicon.png` |
| **K2 — Skymning/gryning** | 21–05 / 05–07 | Teal-skog + mörkblå (Tema E hem) | Guld `#d4af37`, subtila stjärnor | `kompass-tid-skymning-appicon.png` |
| **K3 — Soluppgång** | 05–09 | Rosa-orange horisont, kall blå upptill | Guld med ljus kant, få stjärnor | `kompass-tid-soluppgang-appicon.png` |

Hub-mockups (kompass på hemskärm): `references/kompass-tid/`

---

## Kompass-hub — inga ord på skivan

| Före | Efter |
|------|--------|
| Pill `budget` | **Bort** — diskret **mynt-stack**-ikon (L1 emboss), ingen text |
| Pill `rutiner` | Kvar |
| Pill `personlig utveckling` | Kvar (ev. kortare «utveckling» på smal skärm) |

---

## Dock & «Hamn»

| Plats | Beslut |
|-------|--------|
| **Dock mitten** | **Endast kompass-ikon** — ingen text (varken Hamn eller Hem) |
| `aria-label` | **`Hem`** (skärmläsare) |
| **Sidomeny** | **Trygg hamn** (modulnamn) — inte bara «Hamn»; route `/hamn` oförändrad |
| Route `/hamn` | Behåll internt — produkt «Trygg hamn» i UI |

Se [`DOCK-KANON.md`](./DOCK-KANON.md).

---

## Implementation

- `LivskompassHero` väljer kompass-asset via `getCompassThemeByTime()` → K1/K2/K3
- `public/icons/app-icon-{kvall,skymning,soluppgang}.png` eller en dynamisk PWA-ikon (senare)
- Mynt: SVG emboss, opacity 0.85, **ingen** label
</file>

<file path="src/modules/core/home/panels/HomeDagbokPanel.tsx">
import { useState } from 'react';
import { Check, Loader2, PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store';
import { saveJournalEntry } from '../../firebase/firestore';

type Props = {
  onSaved?: () => void;
};

export function HomeDagbokPanel({ onSaved }: Props) {
  const user = useStore((s) => s.user);
  const [text, setText] = useState('');
  const [mood, setMood] = useState('neutral');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!user || text.trim().length < 2) return;
    setSaving(true);
    setError(null);
    try {
      await saveJournalEntry(user.uid, { mood, text: text.trim() });
      setSaved(true);
      setText('');
      onSaved?.();
    } catch {
      setError('Kunde inte spara dagboksrad.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <p className="text-sm text-text-muted">Logga in för att skriva i dagbok.</p>;
  }

  return (
    <div className="home-module-panel">
      <p className="home-module-panel__lead">
        En neutral rad räcker. Ingen analys — bara avlastning.
      </p>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setSaved(false);
        }}
        rows={4}
        placeholder="Vad vill du minnas om idag?"
        className="input-glass w-full"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {(['lugn', 'neutral', 'tung'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMood(m)}
            className={`chip ${mood === m ? 'chip--active' : 'chip--idle'}`}
          >
            {m === 'lugn' ? 'Lugn' : m === 'tung' ? 'Tung' : 'Neutral'}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      {saved && (
        <p className="mt-2 flex items-center gap-2 text-sm text-success">
          <Check className="h-4 w-4" /> Sparad i dagbok.
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={saving || text.trim().length < 2}
          onClick={handleSave}
          className="btn-pill--success inline-flex items-center gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <PenLine className="h-4 w-4" />}
          Spara rad
        </button>
        <Link to="/dagbok" className="btn-pill--ghost">
          Öppna dagbok
        </Link>
      </div>
    </div>
  );
}
</file>

<file path="src/modules/core/home/utils/homeGreeting.ts">
import { useStore } from '../../store';

export function getTimeGreeting(date = new Date()): string {
  const h = date.getHours();
  if (h >= 5 && h < 10) return 'God morgon';
  if (h >= 10 && h < 17) return 'God dag';
  if (h >= 17 && h < 22) return 'God kväll';
  return 'God natt';
}

export function getDisplayName(email?: string | null): string {
  if (!email) return 'du';
  const local = email.split('@')[0]?.trim();
  if (!local) return 'du';
  const first = local.split(/[._-]/)[0];
  if (!first) return 'du';
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export function useHomeDisplayName(): string {
  const email = useStore((s) => s.user?.email);
  return getDisplayName(email);
}
</file>

<file path="src/modules/core/home/AdaptiveMemoryCards.tsx">
import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import { getRecentCheckIns } from '../firebase/firestore';
import { filterAdaptiveCardsForPreset, type LifeHubPresetId } from '../lifeOs/lifeHubPresets';
import {
  buildAdaptiveMemoryCards,
  type AdaptiveMemoryCard,
} from './compassAdaptiveCards';

const toneBorder: Record<AdaptiveMemoryCard['tone'], string> = {
  gold: 'border-gold/25 bg-gold/5',
  indigo: 'border-indigo-400/25 bg-indigo-500/5',
  lavender: 'border-violet-400/25 bg-violet-500/5',
  emerald: 'border-accent/25 bg-accent/5',
};

export function AdaptiveMemoryCards({
  refreshKey = 0,
  presetId = 'foralder_trygg',
}: {
  refreshKey?: number;
  presetId?: LifeHubPresetId;
}) {
  const user = useStore((s) => s.user);
  const location = useLocation();
  const [cards, setCards] = useState<AdaptiveMemoryCard[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setCards([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const checkins = await getRecentCheckIns(user.uid, 24);
      const built = buildAdaptiveMemoryCards(checkins, { omitCompassPrompts: true });
      setCards(filterAdaptiveCardsForPreset(built, presetId));
    } catch {
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, [user, presetId]);

  useEffect(() => {
    load();
  }, [load, location.pathname, refreshKey]);

  if (!user) return null;

  return (
    <section className="space-y-3" aria-label="Anpassade minneskort">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent" strokeWidth={1.75} />
        <h3 className="font-display text-sm font-semibold text-text">För dig just nu</h3>
      </div>
      <p className="text-xs text-text-dim">
        Små frågor och uppgifter — baserat på dina svar i Kompasser idag.
      </p>

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar…
        </p>
      ) : (
        <div className="adaptive-card-grid">
          {cards.map((card) => (
            <article
              key={card.id}
              className={`adaptive-card rounded-2xl border p-4 ${toneBorder[card.tone]}`}
            >
              <p className="text-[10px] uppercase tracking-widest text-text-dim">{card.title}</p>
              <p className="mt-2 text-sm text-text-muted">{card.prompt}</p>
              <Link
                to={{
                  pathname: card.to,
                  search: card.search ?? '',
                  hash: card.hash ? `#${card.hash.replace(/^#/, '')}` : '',
                }}
                className="btn-pill--ghost mt-3 inline-flex text-xs"
              >
                {card.actionLabel}
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
</file>

<file path="src/modules/core/home/homeActionCategories.ts">
import type { LucideIcon } from 'lucide-react';
import { BookOpen, CircleHelp, Compass, Sparkles, Zap } from 'lucide-react';

export type HomeActionId = 'kompass' | 'dagbok' | 'uppgift' | 'quiz' | 'lucka';

export type HomeActionCategory = {
  id: HomeActionId;
  label: string;
  desc: string;
  icon: LucideIcon;
  tone: 'gold' | 'emerald' | 'indigo' | 'lavender';
};

export const HOME_ACTION_CATEGORIES: HomeActionCategory[] = [
  {
    id: 'kompass',
    label: 'Kompass',
    desc: 'Check-in efter tid på dygnet',
    icon: Compass,
    tone: 'emerald',
  },
  {
    id: 'dagbok',
    label: 'Dagbok',
    desc: 'Skriv en rad — neutralt',
    icon: BookOpen,
    tone: 'gold',
  },
  {
    id: 'uppgift',
    label: 'Uppgift',
    desc: 'Ett mikrosteg i taget',
    icon: Zap,
    tone: 'lavender',
  },
  {
    id: 'quiz',
    label: 'Frågesport',
    desc: 'Valvet lär känna dig',
    icon: Sparkles,
    tone: 'indigo',
  },
  {
    id: 'lucka',
    label: 'Luckor',
    desc: 'Fyll i det som saknas',
    icon: CircleHelp,
    tone: 'gold',
  },
];

export function getHomeActionCategory(id: HomeActionId): HomeActionCategory {
  return HOME_ACTION_CATEGORIES.find((c) => c.id === id) ?? HOME_ACTION_CATEGORIES[0];
}
</file>

<file path="src/modules/core/home/HomeHeroCompass.tsx">
import { HomeHeroKanon } from './HomeHeroKanon';
import { HomeQuickModules } from './HomeQuickModules';

type Props = {
  onCheckInSaved?: () => void;
};

export function HomeHeroCompass({ onCheckInSaved }: Props) {
  return (
    <div className="space-y-5">
      <HomeHeroKanon onCheckInSaved={onCheckInSaved} />
      <HomeQuickModules onSaved={onCheckInSaved} />
    </div>
  );
}
</file>

<file path="src/modules/core/home/HomeQuickModules.tsx">
import { useState } from 'react';
import { ElongatedModule } from '../ui/ElongatedModule';
import {
  HOME_ACTION_CATEGORIES,
  getHomeActionCategory,
  type HomeActionId,
} from './homeActionCategories';
import { HomeDagbokPanel } from './panels/HomeDagbokPanel';
import { HomeTaskPanel } from './panels/HomeTaskPanel';
import { HomeVaultLearningPanel } from './panels/HomeVaultLearningPanel';

const toneMap = {
  gold: 'gold',
  emerald: 'emerald',
  indigo: 'indigo',
  lavender: 'lavender',
} as const;

type Props = {
  onSaved?: () => void;
};

/** Snabbmoduler under kompasserna — en avlång rad i taget. */
export function HomeQuickModules({ onSaved }: Props) {
  const [expanded, setExpanded] = useState<HomeActionId | null>(null);
  const items = HOME_ACTION_CATEGORIES.filter((c) => c.id !== 'kompass');

  return (
    <div className="home-module-stack" aria-label="Snabbval">
      {items.map((item) => {
        const Icon = item.icon;
        const isOpen = expanded === item.id;
        const category = getHomeActionCategory(item.id);
        return (
          <ElongatedModule
            key={item.id}
            id={`home-quick-${item.id}`}
            title={category.label}
            lead={category.desc}
            icon={Icon}
            tone={toneMap[item.tone]}
            expanded={isOpen}
            onToggle={() => setExpanded(isOpen ? null : item.id)}
          >
            {item.id === 'dagbok' && <HomeDagbokPanel onSaved={onSaved} />}
            {item.id === 'uppgift' && <HomeTaskPanel />}
            {item.id === 'quiz' && (
              <HomeVaultLearningPanel mode="quiz" onSaved={onSaved} />
            )}
            {item.id === 'lucka' && (
              <HomeVaultLearningPanel mode="gap" onSaved={onSaved} />
            )}
          </ElongatedModule>
        );
      })}
    </div>
  );
}
</file>

<file path="src/modules/core/home/HomeStreakChip.tsx">
import { useCallback, useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { useStore } from '../store';
import { getRecentCheckIns } from '../firebase/firestore';

/** Liten «Din eld» — streak senaste 7 dagar (valfri, dold utan data). */
export function HomeStreakChip() {
  const user = useStore((s) => s.user);
  const [streak, setStreak] = useState(0);

  const load = useCallback(async () => {
    if (!user) {
      setStreak(0);
      return;
    }
    try {
      const checkins = await getRecentCheckIns(user.uid, 168);
      const days = new Set(
        checkins.map((c) => {
          const d = c.createdAt ? new Date(c.createdAt) : new Date();
          return d.toISOString().slice(0, 10);
        }),
      );
      setStreak(days.size);
    } catch {
      setStreak(0);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  if (!user || streak < 1) return null;

  return (
    <div className="home-streak-chip" aria-label={`Din eld: ${streak} dagar med check-in`}>
      <Flame className="home-streak-chip__icon" strokeWidth={1.5} aria-hidden />
      <span className="home-streak-chip__value tabular-nums">{streak}</span>
      <span className="home-streak-chip__label">Din eld</span>
    </div>
  );
}
</file>

<file path="src/modules/core/home/vaultLearningUtils.ts">
import type { KampsparEntryRow } from '../types/firestore';

const QUIZ_PROMPT =
  '[Livskompassen lärande] Baserat på MINNE: ställ exakt EN kort fråga (max 15 ord) för att lära dig något om användaren som INTE redan står tydligt i minnet. Endast frågan — ingen inledning.';

const GAP_PROMPT =
  '[Livskompassen luckor] Sök i MINNE efter personer eller begrepp som nämns utan tydlig relation eller definition. Ställ exakt EN fråga om det viktigaste gapet (t.ex. "Vem är X?"). Endast frågan.';

const NAME_PATTERN = /\b[A-ZÅÄÖ][a-zåäö]+(?:\s+[A-ZÅÄÖ][a-zåäö]+)+\b/gu;

export function learningPrompt(mode: 'quiz' | 'gap'): string {
  return mode === 'quiz' ? QUIZ_PROMPT : GAP_PROMPT;
}

/** Plockar ut frågetext från valvsvar. */
export function extractQuestion(raw: string): string {
  const trimmed = raw.trim().replace(/^["'«]|["'»]$/g, '');
  const firstLine = trimmed.split('\n').find((l) => l.trim().length > 0) ?? trimmed;
  const sentence = firstLine.split(/[.!?]/)[0]?.trim() ?? firstLine;
  return sentence.endsWith('?') ? sentence : `${sentence.replace(/\.$/, '')}?`;
}

/** Client-fallback: hitta namn som nämns ofta utan relationspost. */
export function detectKnowledgeGap(entries: KampsparEntryRow[]): {
  subject: string;
  question: string;
  reason: string;
} | null {
  const mentionCounts = new Map<string, number>();
  const definedSubjects = new Set<string>();

  for (const entry of entries) {
    if (
      entry.category === 'profil' ||
      entry.category === 'relation' ||
      entry.tags?.some((t) => t === 'relation' || t === 'profil')
    ) {
      definedSubjects.add(entry.title.toLowerCase());
      const nameMatch = entry.title.match(NAME_PATTERN);
      if (nameMatch) definedSubjects.add(nameMatch[0].toLowerCase());
    }

    const matches = `${entry.title} ${entry.content}`.match(NAME_PATTERN) ?? [];
    for (const name of matches) {
      mentionCounts.set(name, (mentionCounts.get(name) ?? 0) + 1);
    }
  }

  for (const [name, count] of mentionCounts) {
    const key = name.toLowerCase();
    if (count < 2) continue;
    if (definedSubjects.has(key)) continue;
    const hasRelation = entries.some(
      (e) =>
        e.content.toLowerCase().includes(key.split(' ')[0] ?? '') &&
        /\b(mamma|pappa|farmor|morfar|ex|syskon|partner|kollega|vän)\b/i.test(e.content),
    );
    if (hasRelation) continue;
    return {
      subject: name,
      question: `Vem är ${name}?`,
      reason: `Namnet "${name}" förekommer ${count} gånger utan tydlig relation i Minne.`,
    };
  }

  return null;
}
</file>

<file path="src/modules/wellbeing/compasses/components/CompassQuickWidgetRail.tsx">
import { Link } from 'react-router-dom';
import type { CompassFlow } from '../utils/compassTime';
import { getCompassWidgets } from '../config/compassWidgetCatalog';

type Props = {
  flow: CompassFlow;
  /** Kompakt rad även när modulen är collapsed */
  compact?: boolean;
  className?: string;
};

/** Horisontell snabbstart under respektive Morgon / Dag / Kväll. */
export function CompassQuickWidgetRail({ flow, compact = false, className }: Props) {
  const widgets = getCompassWidgets(flow);

  return (
    <div
      className={['compass-quick-widget-rail', compact && 'compass-quick-widget-rail--compact', className]
        .filter(Boolean)
        .join(' ')}
      aria-label={`Snabbstart ${flow}`}
    >
      <p className="compass-quick-widget-rail__label">Snabbstart</p>
      <div className="compass-quick-widget-rail__scroll" role="list">
        {widgets.map((w) => (
          <Link
            key={w.id}
            to={w.href}
            className="compass-quick-widget-rail__chip"
            role="listitem"
            title={w.siloNote}
          >
            {w.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
</file>

<file path="src/modules/wellbeing/compasses/config/compassWidgetCatalog.ts">
import type { CompassFlow } from '../utils/compassTime';

export type CompassWidgetContentClass = 'FACT' | 'REFLECTION' | 'PLAY' | 'EVIDENCE' | 'none';

export type CompassWidgetDef = {
  id: string;
  label: string;
  href: string;
  contentClass: CompassWidgetContentClass;
  /** U1 / U6 — kort silo-regel för kurator */
  siloNote: string;
};

/** Per-tidskompass snabbstart — se docs/evaluations/2026-05-29-kompass-widget-snabbstart-plan.md */
export const COMPASS_WIDGET_CATALOG: Record<CompassFlow, CompassWidgetDef[]> = {
  morning: [
    {
      id: 'anteckning',
      label: 'Anteckning',
      href: '/widget/anteckning',
      contentClass: 'none',
      siloNote: 'Lager 1 journal — ej auto Valv',
    },
    {
      id: 'inspelning',
      label: 'Inspelning',
      href: '/widget/inspelning?autostart=1',
      contentClass: 'EVIDENCE',
      siloNote: 'Journal/röst — WORM vid explicit spar',
    },
    {
      id: 'kanslomemory',
      label: 'Känslokort',
      href: '/mabra',
      contentClass: 'PLAY',
      siloNote: 'Vit — REFLECTION/PLAY, ingen Kunskap-RAG',
    },
    {
      id: 'snabb-dagbok',
      label: 'Snabb rad',
      href: '/dagbok?mode=snabb',
      contentClass: 'REFLECTION',
      siloNote: 'Journal Snabb — weave opt-in separat',
    },
  ],
  day: [
    {
      id: 'quiz',
      label: 'Frågesport',
      href: '/widget/snabbval',
      contentClass: 'FACT',
      siloNote: 'Kunskap bank — ej Valv-auto',
    },
    {
      id: 'paralys',
      label: 'Mikrosteg',
      href: '/planering?tab=handling',
      contentClass: 'none',
      siloNote: 'P3 Kanban — manuell start',
    },
    {
      id: 'dagbok',
      label: 'Dagbok',
      href: '/dagbok',
      contentClass: 'REFLECTION',
      siloNote: 'Lager 1 — ej auto-promotion Valv',
    },
    {
      id: 'uppgift',
      label: 'Uppgift',
      href: '/planering?tab=fokus',
      contentClass: 'none',
      siloNote: 'Paralys-Brytaren via planering',
    },
  ],
  evening: [
    {
      id: 'kasam',
      label: 'KASAM',
      href: '/vardagen?tab=kompasser',
      contentClass: 'REFLECTION',
      siloNote: 'Kvällskompass — KasamEvening i modul',
    },
    {
      id: 'reflektion',
      label: 'Reflektion',
      href: '/dagbok?tab=reflektion',
      contentClass: 'REFLECTION',
      siloNote: 'Journal wizard — WORM',
    },
    {
      id: 'anteckning',
      label: 'Anteckning',
      href: '/widget/anteckning',
      contentClass: 'none',
      siloNote: 'Lager 1 — ej auto Valv',
    },
    {
      id: 'planering',
      label: 'Fokus',
      href: '/planering?tab=fokus',
      contentClass: 'none',
      siloNote: 'P3 — länk, ingen gamification',
    },
  ],
};

export function getCompassWidgets(flow: CompassFlow): CompassWidgetDef[] {
  return COMPASS_WIDGET_CATALOG[flow];
}
</file>

<file path="docs/design/ICON-STYLE-GUIDE.md">
# Ikonstil — Premium Helros (kanon från 2026-05-26)

**Låsta produktikoner:** [`.context/locked-icons.md`](../../.context/locked-icons.md) (D1 · M2). **App-ikon upplåst** — [`phone-icon-variants/PREVIEW.md`](./themes/phone-icon-variants/PREVIEW.md)  
**Chrome (meny/dock/hero):** [`icons-proposals/2026-05-26-v4-round2-dna/`](./icons-proposals/2026-05-26-v4-round2-dna/) — 10×10 kategorier, D1-skiva + unik glyph. `npm run icons:proposals-v4`  
**v3 (5 stilar):** [`icons-proposals/2026-05-26-v3-chassis/`](./icons-proposals/2026-05-26-v3-chassis/)  
**Äldre:** [`icons-proposals/2026-05-26-remaining/`](./icons-proposals/2026-05-26-remaining/) (3 varianter)

## Referensbilder

| | |
|---|---|
| Hem-kompass | `docs/design/galleri/KOMPASS-LOCKED-kanon.png` |
| Låst trio | `docs/design/icons-proposals/2026-05-26-v2-premium/` |

## Visuellt språk

| Element | Värde |
|---------|--------|
| Disk / bakgrund | **D1-låst:** `#3d3420` → `#141210` → `#080808`; alternativ teal-kant `#1e3a35` |
| Metall | Linear guld `#f5e6b8` → `#d4af37` → `#8a6b1a` |
| Eld / aktiv | `#fff3c4` → `#e8a020` / `#ffb74d` |
| Glöd | `feGaussianBlur` 1–6px, vit-guld prick |
| Ringar | Dubbel: solid + `stroke-dasharray` |
| Geometri | 8-spets ros, sacred linjer 45°, stjärna nordost |
| Storlek UI | 24×24 (meny/dock), 32×32 (hero-orbit), 48×48 (mark), 512 app |

## Nivåer

| Nivå | Användning | Detalj |
|------|------------|--------|
| **L3** | Appikon (telefon/PWA) | P1–P5 kompassvarianter — ej B1 Kanon ros som mall |
| **Android** | PNG 1024 | `npm run android:icons:phone -- <png>` → `mipmap-*/ic_launcher*.png` |
| **L2** | D1, M2, Valv, hub-ikoner | Disk + guld + 1 accent |
| **L1** | Hero-orbit, små submenyer | Förenklad emboss, `currentColor` + disk valfritt |

## Teknik (React)

- SVG i `src/modules/core/ui/` eller modul-`components/`.
- Unika gradient-`id` via `useId()` när samma sida har flera instanser.
- `aria-hidden` på dekoration; `aria-label` på interaktiv knapp runt ikon.
- Lucide endast för **tillfälliga** states (laddar, chevron, stäng) — inte hub-chrome.

## Färger per hub (Pack J)

Hub-ikoner kan ta **disk-tint** från hub (teal Familjen, hamn-guld, etc.) men behåll **guldlinje** — se [`COLOR-POLICY.md`](./COLOR-POLICY.md).

## Checklista ny ikon

1. Matchar L2/L3-tabellen ovan?
2. Fungerar på 24px (testa i `preview.html`)?
3. Registrerad i [`theme-lab/ICON-DECISIONS.md`](./theme-lab/ICON-DECISIONS.md)?
4. Inte samma form som låst D1/M2 (ingen förvirring)?

## Förbjudet utan beslut

- Vite-lila / generisk SPA-favicon
- Rena Lucide-hubbar (Compass, Users) i drawer/dock när premium-ersättare finns
- Flat enfärg utan disk (utom loader/chevron)
</file>

<file path="docs/design/KOMPASS-MODUL-SPEC.md">
# Kompasser — avlånga moduler (Hem + Hamn)

**Beslut 2026-05-23** · Tema: nordisk skymning, **2px mjuka guldkanter**, tydliga linjer utan hård kant.

---

## Princip

| Gammalt | Nytt |
|--------|------|
| En stor glass-hub som fyller skärmen | **Tre separata avlånga moduler** (Morgon · Dag · Kväll) |
| Chip-rad + panel i samma låda | Varje kompass = **egen rad**; expanderar **endast den du trycker** |
| Hela Hamn = ett BentoCard | Hamn = **moduler staplade** (Kompassråd · BIFF · laddning) |

---

## Modul (CSS: `.elongated-module`)

```
┌─────────────────────────────────────────────┐
│ ○  Morgonkompass          ● aktiv    ⌄    │
│    Ett mikrosteg för lugn start…           │
├─────────────────────────────────────────────┤  ← expanderad
│    [fråga + val + Spara]                     │
└─────────────────────────────────────────────┘
```

- **Höjd collapsed:** ~56–64px (ikon + titel + en rad lead)
- **Kant:** `1.5px solid rgba(212,175,55,0.28)` — mjuk, inte skarp box
- **Radius:** `14px` (`rounded-[0.875rem]`)
- **Aktiv tidskompass:** diskret prick `●` + lätt guldglöd (inte hela skärmen)
- **Kompass-ikon i modul:** liten (20px), **inte** stor hero-disc på Hem

---

## Hem (`/`)

| Zon | Innehåll |
|-----|----------|
| 1 | `CompassModuleStrip` — 3 kompassmoduler |
| 2 | **Widget under varje kompass** — snabbstart (frågesport, känslomemory, kurs, inspelning, anteckning, …) |
| 3 | Snabbmoduler (avlånga): Dagbok · Uppgift · Frågesport · Lucka *(global — kan slås ihop med rad 2)* |
| 4 | `AdaptiveMemoryCards` — oförändrat under |

**Plan 2026-05-29:** [`docs/evaluations/2026-05-29-kompass-widget-snabbstart-plan.md`](../evaluations/2026-05-29-kompass-widget-snabbstart-plan.md) — widget per Morgon/Dag/Kväll + designstädning.

Kod: `HomeCompassModules.tsx`, `HomeActionHub.tsx`, `CompassModuleStrip.tsx`, `HomeHeroKanon` / `DagensRiktningCard`.

---

## Hamn (`/hamn`)

| Modul | Innehåll |
|-------|----------|
| **Kompassråd** | Kort råd från aktiv tidskompass + länk expandera |
| **BIFF** | Befintlig analys i egen avlång modul |
| **Laddning 1–5** | P2 — diskret rad under kompass |

Kod: `HamnModuleStack.tsx`.

---

## Tid & K1/K2/K3

Visuell kompass-disc (LivskompassHero) är **valfri P2** i modulhuvudet. Nu: line-ikon + text. Se [`KOMPASS-TRE-TIDPUNKTER.md`](./references/KOMPASS-TRE-TIDPUNKTER.md).

Mockup: [`kompass-moduler-hem.png`](./references/kompass-moduler-hem.png).
</file>

<file path="docs/evaluations/2026-05-29-kompass-widget-snabbstart-plan.md">
# Kompasser — widget under varje kompass (snabbstart + design)

**Datum:** 2026-05-29  
**Utlösare:** Hem `DagensRiktningCard` + önskemål om snabbstart och visuell städning.  
**Kanon:** [`docs/design/KOMPASS-MODUL-SPEC.md`](../design/KOMPASS-MODUL-SPEC.md) · [`docs/specs/modules/De-3-Kompasserna-SPEC.md`](../specs/modules/De-3-Kompasserna-SPEC.md) · [`docs/design/references/KOMPASS-TRE-TIDPUNKTER.md`](../design/references/KOMPASS-TRE-TIDPUNKTER.md)

## Nuläge (kod)

| Yta | Vad som finns |
|-----|----------------|
| **Hem scenic** | `HomeHeroKanon` → `DagensRiktningCard` (en aktiv tidskompass + check-in) |
| **Hem alt.** | `HomeActionHub` → `CompassModuleStrip` (3 avlånga) + `HomeQuickModules` (global snabbval under alla) |
| **Hamn** | `HamnModuleStack` — kompassråd + BIFF |
| **Snabbval idag** | Dagbok · Uppgift · Frågesport · Lucka (`HomeQuickModules`) — **inte** kopplat per kompass |

**Gap:** Snabbstart ligger **under hela kompassblocket**, inte **under respektive Morgon / Dag / Kväll**.

---

## Målbild

Varje kompass (Morgon · Dag · Kväll) har **egen widget-rad direkt under** huvudraden (collapsed eller expanded):

```
┌─ Morgonkompass ────────────────────────┐
│ ○  Morgonkompass              ⌄      │
├──────────────────────────────────────┤
│  SNABBSTART (widget, 2×2 eller scroll) │
│  [Frågesport] [Känslomemory] [Kurs] …  │
└──────────────────────────────────────┘
```

Samma mönster för Dag och Kväll. På Hem scenic kan widgeten ligga under `DagensRiktningCard` när expanderad, eller alltid synlig som kompakt rad under kortet.

---

## Widget-innehåll (första våg)

| Widget | Route / modul | Silo / regel |
|--------|----------------|--------------|
| **Frågesport** | `HomeVaultLearningPanel` quiz / Kunskap | Kunskap — ej Valv-auto |
| **Känslomemory** | MåBra känslokort / lek-bank | Vit — `content_class` PLAY/REFLECTION |
| **Snabbkurs** | Kunskap kort läge / kb micro | FACT bank — kurator seed |
| **Inspelning** | Dagbok röst / widget inspelning | Lager 1 journal — WORM |
| **Anteckning** | Dagbok snabb rad / inkast | Lager 1 — ej auto Valv |
| **Paralys** | Dag-kompass only | Manuell start |
| **KASAM-steg** | Kväll only | Befintlig `KasamEvening` |
| **Planering mikrosteg** | `/planering` fokus | P3 kanban — länk |

**Princip:** Widget = **deep link eller mini-panel** — max **en** primär interaktion synlig; resten bakom «Mer».

---

## Design (städning)

| Element | Beslut |
|---------|--------|
| **Ikoner** | K1/K2/K3 appikon per kompass (`/icons/compass-time/`) — redan på `DagensRiktningCard` |
| **Kant** | 2px mjuk guld (`KOMPASS-MODUL-SPEC`) — samma som elongated-module |
| **Widget-rad** | Horisontell scroll eller 2×2 grid; L2 line-ikoner + kort etikett |
| **Hem scenic** | Hälsning under kompass-bakgrund; kort glass; widget **inte** över bakgrundskompass |
| **Ingen** | Streak-gamification, turkos/lila glow, fjärde RAG-silo |

**Referens:** [`docs/design/WIDGET-BAR-SPEC.md`](../design/WIDGET-BAR-SPEC.md) (Fyren) — **separat** från kompass-widget; dela tokens, inte layout.

---

## Implementation (faser)

| Fas | Leverans | Filer (plan) |
|-----|----------|----------------|
| **P0** | Spec + `COMPASS_WIDGET_CATALOG` konstant | `compassWidgetCatalog.ts`, uppdatera denna eval |
| **P1** | Widget under `ElongatedModule` i `CompassModuleStrip` | `CompassModuleStrip.tsx`, `CompassQuickWidgetRail.tsx` |
| **P1b** | Widget under `DagensRiktningCard` (scenic Hem) | `DagensRiktningCard.tsx` |
| **P2** | Visuell redesign 3 moduler + K1/K2/K3 | `ElongatedModule`, `index.css` |
| **P3** | Hamn: samma widget under Kompassråd-modul | `HamnModuleStack.tsx` |
| **P4** | `/vardagen` tab — widget synkad med aktiv flik | `DashboardPage.tsx` |

**Ej i scope:** Auto-promotion till Valv; LLM-genererade nya FACT utan bank (U6).

---

## Acceptance

- [x] Morgon, Dag, Kväll har var sin widget-rad (minst 3 shortcuts vardera, kompass-specifika där relevant).
- [x] Frågesport, anteckning, inspelning nås utan att lämna kompassflödet mer än ett steg.
- [ ] `npm run smoke:locked-ux` + `npm run smoke:compass` gröna efter P1.
- [x] Design review mot `KOMPASS-MODUL-SPEC` (2px guld, progressive disclosure).

---

## Kommando (när du vill bygga)

`kör kompass-widget P1` — implementera efter godkänd eval (ingen kod förrän explicit).
</file>

<file path="docs/specs/modules/De-3-Kompasserna-SPEC.md">
# De-3-Kompasserna-SPEC

**Källa:** Notebook #1–#5 (extern AI) + kodgranskning 2026-05-21.  
**Konsoliderad till:** [`.context/modules/kompasser.md`](../../.context/modules/kompasser.md)  
**Design:** [`docs/specs/design-master.md`](../design-master.md)

---

## Låsta beslut (notebook #1–#5)

| # | Beslut |
|---|--------|
| 1 | **Paralys-Brytaren:** manuell start (*"Hjälp mig börja"*). Låg energi får **föreslå** mikrosteg — ingen auto-övertagning av skärmen. |
| 2 | **Notiser:** MVP = **in-app** tids-default vid öppning. Fas 2 = **lokala ljudlösa** push max 2–3/dag. **Inte** FCM i första bygget. |
| 3 | **Crazymaking:** **bro/knapp only** till Valv/Speglar. **Ingen** auto-skriv till `reality_vault`. |
| 4 | **`checkins`:** **WORM** vid spara (append-only). Felskrivning = ny post — ingen edit. |
| 5 | **Missad morgon:** default **Dag** efter ~12:00. Morgon valfri. **Ingen** hard reset, **ingen** skuld/streak. |
| 6 | **Silo:** Kompass (Silo 1) skriver **aldrig** auto till `reality_vault` (Lager 2). |
| 7 | **Tidsvy:** default-flik efter klockan; **fri** navigering mellan kompasser. |
| 8 | **Dagskompass:** **egen vy** i `/vardagen` — inte flytande overlay över andra moduler. |
| 9 | **Paralys-session:** *"Ge mig 3 till"* tillåtet i samma session; Zero Footprint vid **Klar** / navigera bort. |
| 10 | **Sanningens Ankare (morgon):** MVP = Silo 1 (intention). **Ej** auto-dump från `reality_vault`. |

---

## 1. Syfte och användarbehov

Kognitivt avlastande dygnsrytm för ADHD/GAD under hypervigilans och allostatisk belastning. **Ett mikrosteg i taget** — aldrig hela dagen på en skärm.

| Kompass | Syfte |
|---------|--------|
| **Morgonkompassen** (Sacred Feature) | Intention och riktning — *Sanningens Ankare* (kuraterad, lågaffektiv) innan externt brus |
| **Dagskompassen / Pulskompassen** | Nödbroms vid akut stress — people-pleasing, vagus/landning |
| **Kvällskompassen** | KASAM (Begriplighet, Hanterbarhet, Meningsfullhet) — stäng dagen, filtrera crazymaking |

**UX-princip:** Obsidian Calm, ingen skuld vid missad kompass, inga streaks/RSD-triggers.

---

## 2. Route och ingång

| Punkt | Beslut |
|-------|--------|
| **Primär route** | `/vardagen` (kluster Vardagen, tab kompasser) |
| **Redirect** | `/kompasser` → `/vardagen` (tom `?tab` = kompasser) |
| **Komponent** | `DashboardPage` (embedded i `VardagenPage`) |
| **AuthGate** | **done** på `/vardagen` |
| **Ingång** | FloatingDock Sprout, HomePage bento |
| **Notiser (fas 2)** | Deep-link till rätt tidskompass, max 2–3/dag |

Sub-rutter `/morgon`, `/dag`, `/kvall` — **post-MVP** (idag: flikar + tids-default).

---

## 3. UX-flöde (Progressive disclosure)

### Målbild

1. **Inträde:** Default kompass efter lokal tid (morgon ~05–11, dag ~11–17, kväll ~17–05) — användaren kan byta flik fritt.
2. **Morgon (Sacred):** Energi/intention (planerat: sliders). Ingen att-göra-lista. Valfritt förslag vid låg energi — inte auto-Paralys.
3. **Dag:** Check-in + manuell **Paralys-Brytaren** (`breakDownResponse`) — max 3 mikrosteg i taget; *"Ge mig 3 till"* i samma session.
4. **Kväll:** KASAM tre steg (planerat). Vid crazymaking-flagga: diskret bro till `/dagbok?tab=speglar` eller `/dagbok?tab=bevis` — **ingen** auto-WORM.
5. **Klar:** Spara → WORM `checkins` → validering → Zero Footprint (rensa state vid unmount / Klar / kill switch).

### Idag (kod)

[`DashboardPage.tsx`](../../../src/modules/wellbeing/compasses/components/DashboardPage.tsx): flikar Morgon/Dag/Kväll, KASAM kväll, Paralys, tids-default, `saveCheckIn`. **MVP done**.

### Planerat — widget snabbstart (2026-05-29)

Under **varje** kompass (Morgon · Dag · Kväll): kompakt widget-rad för snabbstart (frågesport, känslomemory, snabbkurs, inspelning, anteckning, m.m.) + visuell omdesign (K1/K2/K3, 2px guld). Se [`docs/evaluations/2026-05-29-kompass-widget-snabbstart-plan.md`](../../evaluations/2026-05-29-kompass-widget-snabbstart-plan.md).

---

## 4. Visuell design (Obsidian Calm)

| Element | Token |
|---------|--------|
| Bakgrund | `#020617` |
| Yta | `#0f172a` + glass blur |
| Morgon / aktivt val | Guld `#FDE68A` |
| Fortsätt / AI | Indigo `#818CF8` |
| Spara / Klar | Emerald `#2DD4BF` |
| Typografi | Outfit + Inter |

**Förbjudet:** lila (utöver indigo), turkos, regnbåge, naturteman, count-up/streaks, röda "missad dag"-markeringar.

Paralys-läge: dimma irrelevant UI (~20% opacitet); ett mikrosteg-kort i fokus.

---

## 5. Datamodell (Firestore, WORM)

**Collection:** `checkins` — append-only (`update`/`delete`: false i [`firestore.rules`](../../../firestore.rules)).

### Idag (klient `saveCheckIn`)

| Fält | Typ | Notering |
|------|-----|----------|
| `userId` / `ownerId` | string | Auth UID |
| `questionId` | string | `compass_morning` \| `compass_day` \| `compass_evening` |
| `questionText` | string? | Frågetext |
| `optionSelected` | string | Vald pill |
| `taskCategory` | string? | `morning` \| `day` \| `evening` |
| `createdAt` | serverTimestamp | WORM |

Klient: [`firestore.ts`](../../../src/modules/core/firebase/firestore.ts).

### Planerat (utökning — bakåtkompatibel)

| Fält | Typ | Notering |
|------|-----|----------|
| `energyLevel` | number 1–5 | Morgon/dag |
| `stressLevel` | number 1–10 | Valfritt |
| `kasamData` | map | `comprehensible`, `manageable`, `meaningful` — kväll |
| `paralysisTriggered` | boolean | Paralys-session |
| `microStepsCompleted` | number | Räknare i session |

**Ej planerat:** redigering av sparad post. **Ej planerat:** auto-skriv till `reality_vault`.

---

## 6. Backend och agenter

| Del | Implementation | Status |
|-----|----------------|--------|
| **Spara check-in** | Klient `saveCheckIn` | **done** |
| **Paralys-Brytaren** | Callable `breakDownResponse` + `ParalysPanel` | **done** |
| **Speglings-Coachen** | `speglingsMirror` | **done** (bro kväll) |
| **compassFilter** | Zustand + `getDefaultCompassByTime` vid öppning | **done** |
| **Crazymaking-detektion** | Bro-UI efter KASAM | **done** — ingen auto-valv-write |
| **Minne-ingest** | Auto från `checkins` | **planned** (Kunskap-SPEC; ej MVP) |

Prompter: [`functions/src/sharedRules.ts`](../../../functions/src/sharedRules.ts).

---

## 7. Säkerhet

| Invariant | Status |
|-----------|--------|
| **Silo 1 → Lager 2** | Kompass skriver **inte** auto till `reality_vault` |
| **WORM checkins** | **done** (rules) |
| **AuthGate** | **done** (`/vardagen`) |
| **Zero Footprint** | Form state rensas vid Klar/unmount; morgon-session reset vid ny dag/logout — **partial** |
| **Kill Switch** | Global `useShakeToKill` → `/` — **done**; kompass-specifik reset **planned** |
| **CMEK** | GCP drift |
| **Notis-tak** | Max 2–3/dag — **planned** (lokal) |

Valv-bevis: behåll **Fyren 3s + PIN** (Sacred) — separat från Vardagen-inloggning.

---

## 8. Status idag vs planerat

| Område | Status |
|--------|--------|
| `DashboardPage` Morgon/Dag/Kväll | **done** |
| `saveCheckIn` → `checkins` | **done** |
| `compassFilter` synkad med flik | **done** |
| `/kompasser` → `/vardagen` redirect | **done** |
| WORM Firestore rules | **done** |
| Strikt ett steg i taget (UI) | **done** (KASAM + Paralys) |
| Tids-default flik (klocka) | **done** |
| AuthGate `/vardagen` | **done** |
| Paralys-Brytaren UI + `breakDownResponse` | **done** |
| KASAM kväll (3 steg) | **done** |
| Crazymaking-bro (ej auto-valv) | **done** |
| Notiser in-app → lokal push | **planned** fas 2 |
| Kväll → Måbra / Barnen | **done** |
| `checkins` → `kampspar` | **planned** |
| Sanningens Ankare (morgon, read-only preview) | **planned** |

---

## 9. Acceptanskriterier

| # | Kriterium | Kod |
|---|-----------|-----|
| 1 | Max en primär fråga/interaktion synlig (mikrosteg ett i taget vid Paralys) | **done** |
| 2 | Paralys returnerar mikrosteg; *"Ge mig 3 till"* fungerar i session | **done** |
| 3 | Crazymaking = **knapp** till Valv/Speglar — ingen auto-WORM | **done** |
| 4 | `saveCheckIn` WORM — ingen frontend-edit efter spara | **done** |
| 5 | Zero Footprint vid Klar / unmount från kompass | **done** |
| 6 | Default flik efter tid; missad morgon utan skuld | **done** |
| 7 | ≤3 notiser per kalenderdygn (fas 2) | **planned** |
| 8 | Kompass isolerad från `reality_vault` utan explicit användarval | **done** (ingen auto-write) |

---

## 10. Kopplingar till andra moduler

| Modul | Koppling |
|-------|----------|
| **Verklighetsvalvet** | Crazymaking-bro — användaren sparar bevis **explicit** |
| **Speglar** | Alternativ bro vid känsla vs fakta |
| **Måbra** | Låg energi dag/kväll — valfri länk efter kväll |
| **Barnen** | Kväll — valfri påminnelse om livslogg (ej tvång) |
| **Kunskap / Minne** | Historiska `checkins` → RAG (planerat, ej MVP) |
| **Dossier** | `checkins` kan ingå i framtida export — ej MVP |

---

## 11. Navigation

- **Kluster:** Vardagen (`ClusterGrid`)
- **Dock:** Sprout → `/vardagen`
- **Redirect:** `/kompasser` → `/vardagen`
- **Planerat:** dölj synliga flikar; tidsstyrd en-vy; notis deep-links

Se [`docs/specs/navigation-master.md`](../navigation-master.md).

---

## 12. Tidigare diskussioner att bevara

- Morgonkompassen sätter riktning **innan** ex-bruset — Sacred, kravlös.
- **Future discounting:** inga rigida scheman; dynamisk dagsform (PDA-vänligt).
- Morgon **inga** aggressiva notiser vid uppvaknande.
- Paralys = externt arbetsminne, inte livscoach/JADE.
- Vagus/fysiologiska mikrosteg vid paralys (vatten, 4-7-8) före kognitiva listor.

---

## 13. Avvisade idéer

| Idé | Varför avvisad |
|-----|----------------|
| Streaks / count-up / röda "broken chain" | RSD, prestationsångest |
| Strikta klockslag (morgon stängd kl 10) | Straffar oregelbunden dygnsrytm |
| Auto Paralys vid stress >8 | Hypervigilans, falska larm |
| Hard reset morgon kl 12 | Skuld |
| Auto-kopiera kompass-text till `reality_vault` | Bryter Silo + WORM + explicit trigger |
| Flytande dagskompass över hela appen | Kognitivt brus |
| FCM-notiser i MVP | Integritet/komplexitet — lokal först |
| `checkins` redigerbar samma dag | Bryter WORM-invariant |
| Turkos/regnbåge UI | Bryter design-master |
| Stjärnbilder / gamification | Kladd §G — avvisat |
| Paralys auto vid lågt humör | Kladd §I.1 — **avvisat**; manuell knapp |
| Livs-Coachen i Ekonomi | Kladd routing — avvisat |

## 14. Kladd-synk (2026-05-21)

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md) §F, §I.

| Kladd | Kod |
|-------|-----|
| Morgon/dag/kväll + checkins | **done** |
| Paralys UI | **done** |
| KASAM kväll | **done** |
| Crazymaking-bro (ej auto-valv) | **done** |

---

## Implementera ("kör kompasser")

**MVP done** (2026-05-21). Smoke: `npm run smoke:compass`.

**Nästa fas:**

1. Notiser (lokal push max 2–3/dag)
2. Sanningens Ankare från valv (read-only preview)
3. `checkins` → `kampspar` (Kunskap, ej MVP)
</file>

<file path="src/modules/core/home/panels/HomeTaskPanel.tsx">
import { ParalysPanel } from '../../../wellbeing/compasses/components/ParalysPanel';

export function HomeTaskPanel() {
  return (
    <div className="home-module-panel">
      <ParalysPanel onDone={() => undefined} />
    </div>
  );
}
</file>

<file path="src/modules/core/home/panels/HomeVaultLearningPanel.tsx">
import { useCallback, useEffect, useState } from 'react';
import { Check, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { useStore } from '../../store';
import { getKampsparEntries } from '../../firebase/firestore';
import { callKnowledgeVault } from '../../../evidence/kompis/api/knowledgeVaultService';
import { ingestKampsparEntry } from '../../../evidence/kompis/api/kampsparService';
import {
  detectKnowledgeGap,
  extractQuestion,
  learningPrompt,
} from '../vaultLearningUtils';

type Props = {
  mode: 'quiz' | 'gap';
  onSaved?: () => void;
};

export function HomeVaultLearningPanel({ mode, onSaved }: Props) {
  const user = useStore((s) => s.user);
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('');
  const [reason, setReason] = useState('');
  const [answer, setAnswer] = useState('');
  const [loadingQ, setLoadingQ] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuestion = useCallback(async () => {
    if (!user) return;
    setLoadingQ(true);
    setError(null);
    setSaved(false);
    setAnswer('');

    try {
      if (mode === 'gap') {
        const entries = await getKampsparEntries(user.uid);
        const local = detectKnowledgeGap(entries);
        if (local) {
          setQuestion(local.question);
          setSubject(local.subject);
          setReason(local.reason);
          return;
        }
      }

      const result = await callKnowledgeVault(learningPrompt(mode));
      const q = extractQuestion(result.answer);
      setQuestion(q);
      setSubject(mode === 'gap' ? q.replace(/^Vem är\s/i, '').replace(/\?$/, '') : '');
      setReason(
        mode === 'gap'
          ? 'Valvet hittade ett gap i kunskapsbanken.'
          : 'Valvet vill lära sig mer om dig.',
      );
    } catch {
      if (mode === 'gap') {
        setQuestion('Vem är Elisabeth Franck?');
        setSubject('Elisabeth Franck');
        setReason('Exempel-lucka — fyll i relation så uppdateras Minne.');
      } else {
        setQuestion('Vad hjälper dig att landa efter en tung dag?');
        setSubject('');
        setReason('Standardfråga — valvet saknar svar här.');
      }
    } finally {
      setLoadingQ(false);
    }
  }, [mode, user]);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  const handleSave = async () => {
    if (!user || answer.trim().length < 2) return;
    setSaving(true);
    setError(null);
    try {
      const title =
        subject.trim().length > 0
          ? `Relation: ${subject.trim()}`
          : mode === 'quiz'
            ? `Profil: ${question.slice(0, 60)}`
            : `Lucka: ${question.slice(0, 60)}`;

      await ingestKampsparEntry({
        title,
        content: answer.trim(),
        category: subject ? 'relation' : 'profil',
        entryType: 'fakta',
        tags: [mode === 'gap' ? 'lucka' : 'quiz', 'profil', ...(subject ? [subject.toLowerCase()] : [])],
        source: mode === 'gap' ? 'vault_gap' : 'vault_quiz',
      });

      setSaved(true);
      onSaved?.();
    } catch {
      setError('Kunde inte uppdatera Kunskapsvalvet.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <p className="text-sm text-text-muted">Logga in för att spela med Kunskapsvalvet.</p>;
  }

  return (
    <div className="home-module-panel">
      <div className="home-module-panel__question-box">
        <p className="text-[10px] uppercase tracking-widest text-text-dim">
          {mode === 'gap' ? 'Lucka i minnet' : 'Fråga från valvet'}
        </p>
        {loadingQ ? (
          <p className="mt-2 flex items-center gap-2 text-sm text-text-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> Hämtar fråga…
          </p>
        ) : (
          <p className="mt-2 font-display text-lg text-accent">{question}</p>
        )}
        {reason && !loadingQ && <p className="mt-2 text-xs text-text-dim">{reason}</p>}
      </div>

      {mode === 'gap' && subject && (
        <label className="mt-3 block text-xs text-text-dim">
          Person / begrepp
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input-glass mt-1 w-full"
          />
        </label>
      )}

      <textarea
        value={answer}
        onChange={(e) => {
          setAnswer(e.target.value);
          setSaved(false);
        }}
        rows={3}
        placeholder={
          mode === 'gap'
            ? 'T.ex. Min mamma och barnens farmor.'
            : 'Ditt svar — sparas i Minne med embedding.'
        }
        className="input-glass mt-3 w-full"
      />

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      {saved && (
        <p className="mt-2 flex items-center gap-2 text-sm text-success">
          <Check className="h-4 w-4" /> Minne uppdaterat — valvet lär sig.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={saving || answer.trim().length < 2}
          onClick={handleSave}
          className="btn-pill--success inline-flex items-center gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Uppdatera valvet
        </button>
        <button
          type="button"
          disabled={loadingQ}
          onClick={loadQuestion}
          className="btn-pill--ghost inline-flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Ny fråga
        </button>
      </div>
    </div>
  );
}
</file>

<file path="src/modules/core/home/compassAdaptiveCards.ts">
import type { CompassFlow } from '../../wellbeing/compasses/utils/compassTime';
import { getDefaultCompassByTime } from '../../wellbeing/compasses/utils/compassTime';

export type CheckInSnapshot = {
  id: string;
  questionId?: string;
  questionText?: string;
  optionSelected?: string;
  taskCategory?: string;
  taskNote?: string;
  createdAt?: string;
};

export type AdaptiveMemoryCard = {
  id: string;
  title: string;
  prompt: string;
  actionLabel: string;
  to: string;
  search?: string;
  hash?: string;
  tone: 'gold' | 'indigo' | 'lavender' | 'emerald';
};

function isToday(iso?: string): boolean {
  if (!iso) return false;
  const d = iso.slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  return d === today;
}

function latestForFlow(checkins: CheckInSnapshot[], flow: CompassFlow): CheckInSnapshot | null {
  return (
    checkins.find(
      (c) =>
        c.taskCategory === flow ||
        c.questionId === `compass_${flow}` ||
        (flow === 'evening' && c.optionSelected === 'kasam')
    ) ?? null
  );
}

function kasamFollowUp(taskNote?: string): AdaptiveMemoryCard | null {
  if (!taskNote) return null;
  try {
    const parsed = JSON.parse(taskNote) as { kasam?: Record<string, string> };
    const k = parsed.kasam;
    if (!k) return null;
    const entries = [
      { key: 'meaningful', label: 'Meningsfullhet', q: 'Vill du utveckla vad som gav mening idag?' },
      { key: 'manageable', label: 'Hanterbarhet', q: 'Vill du logga ett litet steg som kändes hanterbart?' },
      { key: 'comprehensible', label: 'Begriplighet', q: 'Vill du skriva ner vad som var begripligt?' },
    ];
    const weakest = entries.find((e) => !(k[e.key]?.trim().length >= 2));
    if (weakest) {
      return {
        id: `kasam-${weakest.key}`,
        title: weakest.label,
        prompt: weakest.q,
        actionLabel: 'Öppna dagbok',
        to: '/dagbok',
        tone: 'gold',
      };
    }
  } catch {
    return null;
  }
  return null;
}

function cardsFromMorning(option: string): AdaptiveMemoryCard[] {
  switch (option) {
    case 'Andning 2 min':
      return [
        {
          id: 'morning-breath',
          title: 'Morgon — andning',
          prompt: 'Du valde lugn start. Vill du köra 4-7-8 i två minuter nu?',
          actionLabel: 'Måbra',
          to: '/mabra',
          tone: 'lavender',
        },
        {
          id: 'morning-minne',
          title: 'Minne',
          prompt: 'Skriv en rad om dagens intention — så minns Kunskapsvalvet.',
          actionLabel: 'Inkast',
          to: '/',
          hash: 'inkast-lite',
          tone: 'emerald',
        },
      ];
    case 'En uppgift':
      return [
        {
          id: 'morning-task',
          title: 'Morgon — ett steg',
          prompt: 'Du valde en uppgift. Bryt ner den till ett enda mikrosteg i Kompasser.',
          actionLabel: 'Paralys-brytare',
          to: '/vardagen',
          tone: 'emerald',
        },
      ];
    case 'Inget — vila':
      return [
        {
          id: 'morning-rest',
          title: 'Morgon — vila',
          prompt: 'Vila räcker. Vill du bara läsa Sanningens Ankare utan att prestera?',
          actionLabel: 'Dagbok',
          to: '/dagbok',
          tone: 'gold',
        },
      ];
    default:
      return [];
  }
}

function cardsFromDay(option: string): AdaptiveMemoryCard[] {
  switch (option) {
    case 'Trött':
      return [
        {
          id: 'day-tired',
          title: 'Dag — trött',
          prompt: 'Kroppen signalerar trötthet. Ett kort andningssteg kan sänka pulsen.',
          actionLabel: 'Måbra',
          to: '/mabra',
          tone: 'lavender',
        },
      ];
    case 'Spänd':
      return [
        {
          id: 'day-tense',
          title: 'Dag — spänd',
          prompt: 'Spänning i kroppen. Vill du prova 4-7-8 innan nästa beslut?',
          actionLabel: 'Andning',
          to: '/mabra',
          tone: 'lavender',
        },
        {
          id: 'day-minne-tense',
          title: 'Minne',
          prompt: 'Logga vad som spände — neutralt, utan att lösa.',
          actionLabel: 'Inkast',
          to: '/',
          hash: 'inkast-lite',
          tone: 'emerald',
        },
      ];
    case 'Orolig':
      return [
        {
          id: 'day-anxious',
          title: 'Dag — orolig',
          prompt: 'Oro i systemet. Spegla känslan mot fakta — utan att fixa.',
          actionLabel: 'Speglar',
          to: '/dagbok',
          search: '?tab=speglar',
          tone: 'gold',
        },
      ];
    case 'Stabil':
      return [
        {
          id: 'day-stable',
          title: 'Dag — stabil',
          prompt: 'Stabil bas idag. Vad är ett faktum du vill minnas i Kunskapsvalvet?',
          actionLabel: 'Inkast',
          to: '/',
          hash: 'inkast-lite',
          tone: 'emerald',
        },
      ];
    default:
      return [];
  }
}

/** Bygger 1–4 små kort utifrån dagens kompass-svar (eller uppmaning att checka in). */
export function buildAdaptiveMemoryCards(
  checkins: CheckInSnapshot[],
  options?: { omitCompassPrompts?: boolean },
): AdaptiveMemoryCard[] {
  const todayCheckins = checkins.filter((c) => isToday(c.createdAt));
  const flow = getDefaultCompassByTime();
  const cards: AdaptiveMemoryCard[] = [];
  const omitCompassPrompts = options?.omitCompassPrompts ?? false;

  const morning = latestForFlow(todayCheckins, 'morning');
  const day = latestForFlow(todayCheckins, 'day');
  const evening = latestForFlow(todayCheckins, 'evening');

  if (!omitCompassPrompts) {
    if (flow === 'morning' && !morning) {
      cards.push({
        id: 'prompt-morning',
        title: 'Morgonkompass',
        prompt: 'Vilket mikrosteg ger dig lugnast start idag?',
        actionLabel: 'Svara i Kompasser',
        to: '/vardagen',
        tone: 'emerald',
      });
    }
    if (flow === 'day' && !day && morning) {
      cards.push({
        id: 'prompt-day',
        title: 'Dagskompass',
        prompt: 'Hur mår kroppen just nu?',
        actionLabel: 'Svara i Kompasser',
        to: '/vardagen',
        tone: 'emerald',
      });
    }
    if (flow === 'evening' && !evening) {
      cards.push({
        id: 'prompt-evening',
        title: 'Kvällskompass',
        prompt: 'KASAM — tre korta steg för att landa dagen.',
        actionLabel: 'Kväll i Kompasser',
        to: '/vardagen',
        tone: 'emerald',
      });
    }
  }

  if (morning?.optionSelected) {
    cards.push(...cardsFromMorning(morning.optionSelected));
  }
  if (day?.optionSelected) {
    cards.push(...cardsFromDay(day.optionSelected));
  }
  if (evening?.optionSelected === 'kasam') {
    const follow = kasamFollowUp(evening.taskNote);
    if (follow) cards.push(follow);
    else {
      cards.push({
        id: 'evening-done',
        title: 'Kväll klar',
        prompt: 'KASAM sparad. Vill du lägga en rad i Minne om dagen?',
        actionLabel: 'Inkast',
        to: '/',
        hash: 'inkast-lite',
        tone: 'emerald',
      });
    }
  }

  if (cards.length === 0 && checkins.length === 0 && !omitCompassPrompts) {
    cards.push({
      id: 'fallback-compass',
      title: 'Kompasser',
      prompt: 'Börja med en check-in — då anpassas korten efter dina svar.',
      actionLabel: 'Öppna Kompasser',
      to: '/vardagen',
      tone: 'emerald',
    });
  }

  const seen = new Set<string>();
  return cards.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  }).slice(0, 4);
}
</file>

<file path="src/modules/core/home/DagensRiktningCompassIcon.tsx">
import {
  COMPASS_FLOW_TIME_ICON,
  COMPASS_TIME_ICON_SRC,
} from '../../wellbeing/compasses/config/compassTimeIcons';
import type { CompassFlow } from '../../wellbeing/compasses/utils/compassTime';

type Props = {
  activeFlow: CompassFlow;
};

/** Aktuell tidskompass (K1–K3) — en ikon, stor. */
export function DagensRiktningCompassIcon({ activeFlow }: Props) {
  const { iconId, shortLabel } = COMPASS_FLOW_TIME_ICON[activeFlow];

  return (
    <div
      className="dagens-riktning-card__compass-chip dagens-riktning-card__compass-chip--solo"
      role="img"
      aria-label={`Kompass: ${shortLabel}`}
      title={shortLabel}
    >
      <img
        src={COMPASS_TIME_ICON_SRC[iconId]}
        alt=""
        className="dagens-riktning-card__compass-chip-img"
        width={64}
        height={64}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
</file>

<file path="src/modules/core/home/HomeActionHub.tsx">
import { useMemo } from 'react';
import { CompassModuleStrip } from '../../wellbeing/compasses/components/CompassModuleStrip';
import { KompassradPanel } from '../../wellbeing/compasses/components/KompassradPanel';
import { getDefaultCompassByTime } from '../../wellbeing/compasses/utils/compassTime';
import { EVENING_HERO, getFlowConfig } from '../../wellbeing/compasses/config/compassFlows';
import { HomeQuickModules } from './HomeQuickModules';

type Props = {
  onCheckInSaved?: () => void;
};

/** Hem — avlånga kompassmoduler + snabbmoduler (inte en enda glass-hub). */
export function HomeActionHub({ onCheckInSaved }: Props) {
  const flow = getDefaultCompassByTime();
  const flowMeta = flow === 'evening' ? EVENING_HERO : getFlowConfig(flow)!;

  const greeting = useMemo(
    () => ({
      eyebrow: `Hem · ${flowMeta.label}`,
      title: flowMeta.heroTitle,
      lead: flowMeta.heroLead,
    }),
    [flowMeta.heroLead, flowMeta.heroTitle, flowMeta.label],
  );

  return (
    <header className="home-action-hub space-y-4">
      <div className="home-action-hub__head px-0.5">
        <p className="home-page__eyebrow">{greeting.eyebrow}</p>
        <h2 className="home-page__title text-xl">{greeting.title}</h2>
        <p className="home-page__lead text-xs">{greeting.lead}</p>
      </div>

      <KompassradPanel />
      <CompassModuleStrip onCheckInSaved={onCheckInSaved} />
      <HomeQuickModules onSaved={onCheckInSaved} />
    </header>
  );
}
</file>

<file path="src/modules/core/home/HomeGreeting.tsx">
import { getTimeGreeting, useHomeDisplayName } from './utils/homeGreeting';

const TAGLINES = [
  'Ett steg i taget — kompassen visar riktning.',
  'Lågaffektiv start. Ingen prestation krävs.',
  'Din eld tänds av små handlingar, inte av stress.',
] as const;

function taglineForHour(h: number): string {
  if (h >= 17 || h < 5) return TAGLINES[2];
  if (h >= 12) return TAGLINES[1];
  return TAGLINES[0];
}

export function HomeGreeting() {
  const name = useHomeDisplayName();
  const now = new Date();
  const greeting = getTimeGreeting(now);
  const tagline = taglineForHour(now.getHours());

  return (
    <header className="home-greeting">
      <p className="home-greeting__eyebrow">Styr med mening</p>
      <h2 className="home-greeting__title">
        <span className="home-greeting__salutation">{greeting},</span>{' '}
        <span className="home-greeting__name">{name}</span>
        <span className="home-greeting__star" aria-hidden>
          {' '}
          ✦
        </span>
      </h2>
      <p className="home-greeting__tagline">{tagline}</p>
    </header>
  );
}
</file>

<file path="src/modules/core/home/kognitivSkoldVariants.ts">
/** K01–K10 — synkad med `scripts/generate_kognitiv_skold_variants.mjs` */
export const KOGNITIV_SKOLD_VARIANT_IDS = [
  'K01-sjo-solnedgang',
  'K02-aurora-fjall',
  'K03-obsidian-stjarna',
  'K04-hamn-ember',
  'K05-regn-dimma',
  'K06-nordic-flat',
  'K07-frost-is',
  'K08-valv-marmor',
  'K09-astrolab-sacred',
  'K10-urban-rim',
] as const;

export type KognitivSkoldVariantId = (typeof KOGNITIV_SKOLD_VARIANT_IDS)[number];

export const DEFAULT_KOGNITIV_SKOLD_VARIANT: KognitivSkoldVariantId = 'K06-nordic-flat';

export const KOGNITIV_SKOLD_STORAGE_KEY = 'livskompass.kSkold';

export type KognitivSkoldTokens = {
  id: KognitivSkoldVariantId;
  title: string;
  panelTop: string;
  panelBottom: string;
  shield: string;
  rim: string;
  gold: string;
  glow: string;
};

export const KOGNITIV_SKOLD_VARIANTS: Record<KognitivSkoldVariantId, KognitivSkoldTokens> = {
  'K01-sjo-solnedgang': {
    id: 'K01-sjo-solnedgang',
    title: 'Sjö solnedgång',
    panelTop: '#1a2830',
    panelBottom: '#0a1210',
    shield: '#0d3b3b',
    rim: '#d4af37',
    gold: '#f5e6b8',
    glow: '#ffb74d',
  },
  'K02-aurora-fjall': {
    id: 'K02-aurora-fjall',
    title: 'Aurora fjällsjö',
    panelTop: '#0a1020',
    panelBottom: '#1a0830',
    shield: '#0a2838',
    rim: '#7ec8e3',
    gold: '#c8e6ff',
    glow: '#4dd0e1',
  },
  'K03-obsidian-stjarna': {
    id: 'K03-obsidian-stjarna',
    title: 'Obsidian stjärnhimmel',
    panelTop: '#0c0a14',
    panelBottom: '#080810',
    shield: '#121018',
    rim: '#9a8b6a',
    gold: '#e8dcc8',
    glow: '#fff8e7',
  },
  'K04-hamn-ember': {
    id: 'K04-hamn-ember',
    title: 'Hamn ember',
    panelTop: '#2a1810',
    panelBottom: '#120c08',
    shield: '#2a1f14',
    rim: '#c97b4a',
    gold: '#ffd9a8',
    glow: '#ff8a50',
  },
  'K05-regn-dimma': {
    id: 'K05-regn-dimma',
    title: 'Regn dimma',
    panelTop: '#0f2e2a',
    panelBottom: '#081818',
    shield: '#0f2e2a',
    rim: '#5ee0b8',
    gold: '#b8f0d8',
    glow: '#2ee6a6',
  },
  'K06-nordic-flat': {
    id: 'K06-nordic-flat',
    title: 'Nordic flat guld',
    panelTop: '#0a1614',
    panelBottom: '#12151f',
    shield: '#142220',
    rim: '#d4af37',
    gold: '#d4af37',
    glow: '#d4af37',
  },
  'K07-frost-is': {
    id: 'K07-frost-is',
    title: 'Frost is',
    panelTop: '#1a2830',
    panelBottom: '#0e1820',
    shield: '#1a2830',
    rim: '#b8d4e8',
    gold: '#e8f4ff',
    glow: '#ffffff',
  },
  'K08-valv-marmor': {
    id: 'K08-valv-marmor',
    title: 'Valv marmor',
    panelTop: '#1c1a18',
    panelBottom: '#101010',
    shield: '#1c1a18',
    rim: '#d4af37',
    gold: '#f0e0b0',
    glow: '#c9a227',
  },
  'K09-astrolab-sacred': {
    id: 'K09-astrolab-sacred',
    title: 'Astrolab sacred',
    panelTop: '#0c2a28',
    panelBottom: '#081410',
    shield: '#0c2a28',
    rim: '#d4af37',
    gold: '#f5e6b8',
    glow: '#ffe082',
  },
  'K10-urban-rim': {
    id: 'K10-urban-rim',
    title: 'Urban dusk',
    panelTop: '#101820',
    panelBottom: '#080c12',
    shield: '#101820',
    rim: '#8b7cf6',
    gold: '#d4af37',
    glow: '#64ffda',
  },
};

export function isKognitivSkoldVariantId(value: string | null | undefined): value is KognitivSkoldVariantId {
  return Boolean(value && (KOGNITIV_SKOLD_VARIANT_IDS as readonly string[]).includes(value));
}

export function resolveKognitivSkoldVariantId(
  value: string | null | undefined,
): KognitivSkoldVariantId {
  return isKognitivSkoldVariantId(value) ? value : DEFAULT_KOGNITIV_SKOLD_VARIANT;
}
</file>

<file path="src/modules/core/home/useKognitivSkoldVariant.ts">
import { useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_KOGNITIV_SKOLD_VARIANT,
  KOGNITIV_SKOLD_STORAGE_KEY,
  KOGNITIV_SKOLD_VARIANTS,
  type KognitivSkoldVariantId,
  resolveKognitivSkoldVariantId,
} from './kognitivSkoldVariants';

function readFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('kSkold');
}

function readFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(KOGNITIV_SKOLD_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Hem-hero K01–K10. Dev: `?kSkold=K03-obsidian-stjarna` sparas i localStorage. */
export function useKognitivSkoldVariant() {
  const [variantId, setVariantId] = useState<KognitivSkoldVariantId>(() =>
    resolveKognitivSkoldVariantId(readFromUrl() ?? readFromStorage()),
  );

  useEffect(() => {
    const fromUrl = readFromUrl();
    if (fromUrl) {
      const resolved = resolveKognitivSkoldVariantId(fromUrl);
      setVariantId(resolved);
      try {
        localStorage.setItem(KOGNITIV_SKOLD_STORAGE_KEY, resolved);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const tokens = useMemo(() => KOGNITIV_SKOLD_VARIANTS[variantId], [variantId]);

  return {
    variantId,
    tokens,
    defaultVariantId: DEFAULT_KOGNITIV_SKOLD_VARIANT,
  };
}
</file>

<file path="src/modules/wellbeing/compasses/api/compassService.ts">
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../../core/firebase/init';

export type MicroStep = {
  instruction: string;
  estimatedSeconds: number;
  physicalAnchor: string;
};

const breakDownCallable = httpsCallable<{ text: string }, { microSteps: MicroStep[] }>(
  functions,
  'breakDownResponse',
);

export async function fetchMicroSteps(text: string): Promise<MicroStep[]> {
  const result = await breakDownCallable({ text });
  const steps = result.data?.microSteps;
  if (!Array.isArray(steps) || steps.length === 0) {
    throw new Error('Inga mikrosteg returnerades.');
  }
  return steps;
}
</file>

<file path="src/modules/wellbeing/compasses/components/CompassModuleStrip.tsx">
import { useState } from 'react';
import { ElongatedModule } from '../../../core/ui/ElongatedModule';
import type { ElongatedModuleTone } from '../../../core/ui/ElongatedModule';
import { COMPASS_FLOWS, EVENING_HERO } from '../config/compassFlows';
import type { CompassFlow } from '../utils/compassTime';
import { getDefaultCompassByTime } from '../utils/compassTime';
import { DashboardPage } from './DashboardPage';
import { CompassQuickWidgetRail } from './CompassQuickWidgetRail';

const FLOW_TONE: Record<CompassFlow, ElongatedModuleTone> = {
  morning: 'gold',
  day: 'emerald',
  evening: 'lavender',
};

const ALL_FLOWS: {
  id: CompassFlow;
  label: string;
  lead: string;
  icon: (typeof COMPASS_FLOWS)[0]['icon'];
}[] = [
  ...COMPASS_FLOWS.map((f) => ({
    id: f.id,
    label: f.heroTitle,
    lead: f.heroLead,
    icon: f.icon,
  })),
  {
    id: 'evening',
    label: EVENING_HERO.heroTitle,
    lead: EVENING_HERO.heroLead,
    icon: EVENING_HERO.icon,
  },
];

type Props = {
  onCheckInSaved?: () => void;
};

/** Tre avlånga kompassmoduler — en expanderad i taget. */
export function CompassModuleStrip({ onCheckInSaved }: Props) {
  const timeFlow = getDefaultCompassByTime();
  const [expanded, setExpanded] = useState<CompassFlow | null>(timeFlow);

  const toggle = (id: CompassFlow) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <div className="home-module-stack" aria-label="Kompasser">
      {ALL_FLOWS.map((flow) => {
        const isExpanded = expanded === flow.id;
        const showRail = isExpanded || timeFlow === flow.id;
        return (
          <div key={flow.id} className="compass-module-block">
            <ElongatedModule
              id={`compass-module-${flow.id}`}
              title={flow.label}
              lead={flow.lead}
              icon={flow.icon}
              tone={FLOW_TONE[flow.id]}
              recommended={timeFlow === flow.id}
              expanded={isExpanded}
              onToggle={() => toggle(flow.id)}
            >
              {showRail ? <CompassQuickWidgetRail flow={flow.id} className="compass-quick-widget-rail--in-module" /> : null}
              <DashboardPage
                variant="module"
                forcedFlow={flow.id}
                onCheckInSaved={onCheckInSaved}
              />
            </ElongatedModule>
            {showRail && !isExpanded ? (
              <CompassQuickWidgetRail flow={flow.id} compact className="compass-quick-widget-rail--below" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
</file>

<file path="src/modules/wellbeing/compasses/components/DashboardPage.tsx">
import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { Sun, Check, Loader2 } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { useStore } from '../../../core/store';
import { getVaultLogs, saveCheckIn } from '../../../core/firebase/firestore';
import type { VaultLog } from '../../../core/types/firestore';
import type { CompassFlow } from '../utils/compassTime';
import {
  COMPASS_FLOWS,
  EVENING_HERO,
  MORNING_ANCHOR,
  getFlowConfig,
} from '../config/compassFlows';
import { useCompassTimeFlow } from '../hooks/useCompassTimeFlow';
import { ParalysPanel } from './ParalysPanel';
import { KasamEvening } from './KasamEvening';

type DashboardPageProps = {
  embedded?: boolean;
  variant?: 'page' | 'hero' | 'hub' | 'module';
  /** När satt (t.ex. CompassModuleStrip): ingen FlowTabs, låst flöde. */
  forcedFlow?: CompassFlow;
  onCheckInSaved?: () => void;
};

function resetSessionState() {
  return {
    selected: null as string | null,
    saved: false,
    saving: false,
    error: null as string | null,
    showParalys: false,
  };
}

export function DashboardPage({
  embedded: _embedded = false,
  variant = 'page',
  forcedFlow,
  onCheckInSaved,
}: DashboardPageProps) {
  const timeHook = useCompassTimeFlow();
  const { timeFlow, switchFlow } = timeHook;
  const activeFlow = forcedFlow ?? timeHook.activeFlow;
  const hideFlowTabs = variant === 'module' || forcedFlow != null;
  const user = useStore((s) => s.user);

  const [session, setSession] = useState(resetSessionState);
  const [anchorLogs, setAnchorLogs] = useState<(VaultLog & { id: string })[]>([]);

  const clearSession = useCallback(() => {
    setSession(resetSessionState());
  }, []);

  const handleSwitchFlow = (id: CompassFlow) => {
    switchFlow(id);
    clearSession();
  };

  useEffect(() => () => clearSession(), [clearSession]);

  useEffect(() => {
    if (activeFlow !== 'morning' || !user) {
      setAnchorLogs([]);
      return;
    }
    getVaultLogs(user.uid)
      .then((logs) => {
        const pinned = logs.filter((l) => l.pinned);
        const pick = pinned.length > 0 ? pinned : logs.slice(0, 2);
        setAnchorLogs(pick.slice(0, 3));
      })
      .catch(() => setAnchorLogs([]));
  }, [activeFlow, user]);

  const heroMeta =
    activeFlow === 'evening'
      ? EVENING_HERO
      : getFlowConfig(activeFlow)!;

  if (activeFlow === 'evening') {
    if (!user) {
      return (
        <CompassShell
          variant={variant}
          heroMeta={heroMeta}
          timeFlow={timeFlow}
          activeFlow={activeFlow}
        >
          {!hideFlowTabs && (
            <FlowTabs activeFlow={activeFlow} onSwitch={handleSwitchFlow} />
          )}
          <p className="text-sm text-text-muted">Logga in för att spara kvällskompass.</p>
        </CompassShell>
      );
    }
    return (
      <CompassShell
        variant={variant}
        heroMeta={heroMeta}
        timeFlow={timeFlow}
        activeFlow={activeFlow}
      >
        {!hideFlowTabs && (
          <FlowTabs activeFlow={activeFlow} onSwitch={handleSwitchFlow} />
        )}
        <KasamEvening
          userId={user.uid}
          onKlar={clearSession}
          onSaved={onCheckInSaved}
        />
      </CompassShell>
    );
  }

  const flow = getFlowConfig(activeFlow)!;
  const { selected, saved, saving, error, showParalys } = session;

  const handleSave = async () => {
    if (!selected || !user) return;
    setSession((s) => ({ ...s, saving: true, error: null }));
    try {
      await saveCheckIn(user.uid, {
        questionId: `compass_${activeFlow}`,
        questionText: flow.question,
        optionSelected: selected,
        taskCategory: activeFlow,
      });
      setSession((s) => ({ ...s, saved: true, saving: false }));
      onCheckInSaved?.();
    } catch {
      setSession((s) => ({
        ...s,
        saving: false,
        error: 'Kunde inte spara check-in. Kontrollera Firestore-regler och .env.',
      }));
    }
  };

  return (
    <CompassShell
      variant={variant}
      heroMeta={heroMeta}
      timeFlow={timeFlow}
      activeFlow={activeFlow}
    >
      {!hideFlowTabs && (
        <FlowTabs activeFlow={activeFlow} onSwitch={handleSwitchFlow} />
      )}

      {activeFlow === 'morning' && (
        <div className="space-y-3">
          <p className="rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm text-gold/90">
            {MORNING_ANCHOR}
          </p>
          {anchorLogs.length > 0 && (
            <div className="rounded-xl border border-border-strong bg-surface/30 px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-text-dim mb-2">
                Sanningens Ankare (read-only)
              </p>
              <ul className="space-y-2">
                {anchorLogs.map((log) => (
                  <li key={log.id} className="text-sm text-text-muted line-clamp-2">
                    {(log.truth || '').slice(0, 120)}
                    {(log.truth || '').length > 120 ? '…' : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className={showParalys ? 'pointer-events-none opacity-20' : ''}>
        {!showParalys && (
          <BentoCard
            title={variant === 'hero' || variant === 'module' ? undefined : flow.label}
            icon={
              variant === 'hero' || variant === 'module' ? undefined : (
                <flow.icon className="h-4 w-4" />
              )
            }
            className={
              variant === 'hero' || variant === 'module'
                ? 'border-0 bg-transparent p-0 shadow-none'
                : ''
            }
          >
            <p className="mb-4 text-sm text-text-muted">{flow.question}</p>
            <div className="space-y-2">
              {flow.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    setSession((s) => ({ ...s, selected: opt, saved: false, error: null }))
                  }
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    selected === opt
                      ? 'border-accent/50 bg-accent/10 text-accent'
                      : 'border-border-strong text-text-muted hover:border-accent/20'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {selected && !saved && (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !user}
                className="btn-pill--success mt-4"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Spara check-in
              </button>
            )}

            {saved && (
              <div className="mt-4 space-y-2">
                <p className="flex items-center gap-2 text-sm text-success">
                  <Check className="h-4 w-4" /> Check-in sparad.
                </p>
                <button type="button" onClick={clearSession} className="btn-pill--ghost text-sm">
                  Klar
                </button>
              </div>
            )}

            {error && <p className="mt-2 text-sm text-danger">{error}</p>}

            {!user && selected && !saved && (
              <p className="mt-2 text-sm text-text-muted">Logga in för att spara.</p>
            )}

            {activeFlow === 'morning' && selected === 'Inget — vila' && !saved && (
              <button
                type="button"
                onClick={() => {
                  handleSwitchFlow('day');
                  setSession((s) => ({ ...s, showParalys: true, selected: null, saved: false }));
                }}
                className="btn-pill--ghost mt-3 w-full text-sm"
              >
                Vill du ha ett mikrosteg?
              </button>
            )}
          </BentoCard>
        )}
      </div>

      {activeFlow === 'day' && (
        <>
          {!showParalys && !saved && (
            <button
              type="button"
              onClick={() => setSession((s) => ({ ...s, showParalys: true }))}
              className="btn-pill--secondary w-full text-sm"
            >
              Hjälp mig börja (Paralys)
            </button>
          )}
          {showParalys && (
            <ParalysPanel onDone={() => setSession((s) => ({ ...s, showParalys: false }))} />
          )}
        </>
      )}
    </CompassShell>
  );
}

type HeroMeta = {
  heroTitle: string;
  heroLead: string;
  label: string;
};

function CompassShell({
  variant,
  heroMeta,
  timeFlow,
  activeFlow,
  children,
}: {
  variant: 'page' | 'hero' | 'hub' | 'module';
  heroMeta: HeroMeta;
  timeFlow: CompassFlow;
  activeFlow: CompassFlow;
  children: ReactNode;
}) {
  const autoHint =
    activeFlow === timeFlow
      ? 'Aktiv för tid på dygnet'
      : `Tidsläge just nu: ${TIME_LABEL[timeFlow]}`;

  if (variant === 'hero') {
    return (
      <div className="space-y-4">
        <div>
          <p className="home-page__eyebrow">Hem · {heroMeta.label}</p>
          <h2 className="home-page__title">{heroMeta.heroTitle}</h2>
          <p className="home-page__lead">{heroMeta.heroLead}</p>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-text-dim">{autoHint}</p>
        </div>
        {children}
      </div>
    );
  }

  if (variant === 'hub' || variant === 'module') {
    return <div className="space-y-3">{children}</div>;
  }

  return <div className="space-y-6">{children}</div>;
}

const TIME_LABEL: Record<CompassFlow, string> = {
  morning: 'Morgon',
  day: 'Dag',
  evening: 'Kväll',
};

function FlowTabs({
  activeFlow,
  onSwitch,
}: {
  activeFlow: CompassFlow;
  onSwitch: (id: CompassFlow) => void;
}) {
  const tabs: { id: CompassFlow; label: string; icon: typeof Sun }[] = [
    ...COMPASS_FLOWS.map((f) => ({ id: f.id, label: f.label, icon: f.icon })),
    { id: 'evening', label: EVENING_HERO.label, icon: EVENING_HERO.icon },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSwitch(id)}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-widest ${
            activeFlow === id ? 'chip--active' : 'chip--idle'
          }`}
        >
          <Icon className="h-3 w-3" />
          {label}
        </button>
      ))}
    </div>
  );
}
</file>

<file path="src/modules/wellbeing/compasses/components/KasamEvening.tsx">
import { useState } from 'react';
import { Check, Loader2, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BentoCard } from '../../../core/ui/BentoCard';
import { saveCheckIn } from '../../../core/firebase/firestore';

const KASAM_STEPS = [
  { key: 'comprehensible' as const, label: 'Begriplighet', question: 'Vad var begripligt idag?' },
  { key: 'manageable' as const, label: 'Hanterbarhet', question: 'Vad kändes hanterbart?' },
  { key: 'meaningful' as const, label: 'Meningsfullhet', question: 'Vad gav mening — även litet?' },
];

type KasamData = Record<(typeof KASAM_STEPS)[number]['key'], string>;

type Props = {
  userId: string;
  onKlar: () => void;
  onSaved?: () => void;
};

export function KasamEvening({ userId, onKlar, onSaved }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [kasam, setKasam] = useState<Partial<KasamData>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = KASAM_STEPS[stepIndex];
  const currentValue = current ? (kasam[current.key] ?? '') : '';

  const handleNext = () => {
    if (!current || currentValue.trim().length < 2) {
      setError('Skriv minst ett par ord.');
      return;
    }
    setError(null);
    setKasam((k) => ({ ...k, [current.key]: currentValue.trim() }));
    if (stepIndex < KASAM_STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    }
  };

  const handleSave = async () => {
    if (!current || currentValue.trim().length < 2) {
      setError('Skriv minst ett par ord.');
      return;
    }
    const full: KasamData = {
      comprehensible: kasam.comprehensible ?? '',
      manageable: kasam.manageable ?? '',
      meaningful: kasam.meaningful ?? '',
    };
    full[current.key] = currentValue.trim();

    setSaving(true);
    setError(null);
    try {
      await saveCheckIn(userId, {
        questionId: 'compass_evening',
        questionText: 'KASAM — kvällskompass',
        optionSelected: 'kasam',
        taskCategory: 'evening',
        taskNote: JSON.stringify({ kasam: full }),
      });
      setSaved(true);
      onSaved?.();
    } catch {
      setError('Kunde inte spara. Kontrollera Firestore-regler.');
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div className="space-y-4">
        <p className="flex items-center gap-2 text-sm text-success">
          <Check className="h-4 w-4" /> Kvällskompass sparad.
        </p>
        <BentoCard title="Crazymaking?" description="Bro only — inget sparas automatiskt">
          <div className="flex flex-col gap-2">
            <Link to="/dagbok?tab=speglar" className="btn-pill--ghost text-sm">
              Jämför känsla med fakta (Speglar)
            </Link>
            <Link to="/dagbok?tab=bevis" className="btn-pill--ghost text-sm">
              Dokumentera neutralt (Bevis)
            </Link>
          </div>
        </BentoCard>
        <div className="flex flex-col gap-2">
          <Link to="/mabra" className="btn-pill--ghost text-sm">
            Landning (Måbra)
          </Link>
          <Link to="/familjen" className="btn-pill--ghost text-sm">
            Livslogg barnen
          </Link>
          <button type="button" onClick={onKlar} className="btn-pill--success text-sm">
            Klar
          </button>
        </div>
      </div>
    );
  }

  return (
    <BentoCard title="Kväll — KASAM" icon={<Moon className="h-4 w-4" />}>
      <p className="mb-1 text-xs uppercase tracking-widest text-text-muted">
        Steg {stepIndex + 1} av {KASAM_STEPS.length}: {current.label}
      </p>
      <p className="mb-4 text-sm text-text-muted">{current.question}</p>
      <textarea
        value={currentValue}
        onChange={(e) => setKasam((k) => ({ ...k, [current.key]: e.target.value }))}
        rows={3}
        className="w-full rounded-xl border border-border-strong bg-surface/50 px-4 py-3 text-sm"
      />
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      {stepIndex < KASAM_STEPS.length - 1 ? (
        <button type="button" onClick={handleNext} className="btn-pill--secondary mt-4">
          Nästa
        </button>
      ) : (
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="btn-pill--success mt-4"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Spara kväll'}
        </button>
      )}
    </BentoCard>
  );
}
</file>

<file path="src/modules/wellbeing/compasses/components/KompassradPanel.tsx">
import { getCompassAdvice, getCompassFlowMeta } from '../utils/compassAdvice';

const TAGS = [
  { id: 'biff', label: 'BIFF' },
  { id: 'no-jade', label: 'Ingen JADE' },
  { id: 'parallel', label: 'Parallellt föräldraskap' },
] as const;

/** D3 — dagens kompassråd + taggar (Hamn/Hem). */
export function KompassradPanel() {
  const meta = getCompassFlowMeta();
  const advice = getCompassAdvice(meta.flow);

  return (
    <div className="elongated-module elongated-module--gold p-4">
      <p className="text-[10px] uppercase tracking-widest text-text-dim">Kompassråd · {meta.label}</p>
      <p className="mt-1 font-display text-base text-accent">{advice}</p>
      <p className="mt-2 text-xs text-text-muted">{meta.heroLead}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {TAGS.map((t) => (
          <span
            key={t.id}
            className="rounded-full border border-accent/25 bg-accent/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-accent/80"
          >
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}
</file>

<file path="src/modules/wellbeing/compasses/components/ParalysPanel.tsx">
import { useState } from 'react';
import { Loader2, Zap } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { fetchMicroSteps, type MicroStep } from '../api/compassService';

const BATCH_SIZE = 3;

type Props = {
  onDone: () => void;
};

export function ParalysPanel({ onDone }: Props) {
  const [taskText, setTaskText] = useState('');
  const [steps, setSteps] = useState<MicroStep[]>([]);
  const [cursor, setCursor] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visible = steps.slice(cursor, cursor + BATCH_SIZE);
  const hasMore = cursor + BATCH_SIZE < steps.length;

  const loadSteps = async (append: boolean) => {
    const trimmed = taskText.trim();
    if (trimmed.length < 3) {
      setError('Skriv kort vad som känns tungt.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const next = await fetchMicroSteps(trimmed);
      if (append) {
        setSteps((prev) => [...prev, ...next]);
        setCursor((prev) => prev + BATCH_SIZE);
      } else {
        setSteps(next);
        setCursor(0);
      }
    } catch {
      setError('Kunde inte hämta mikrosteg. Kontrollera inloggning och deployade functions.');
    } finally {
      setLoading(false);
    }
  };

  if (steps.length === 0) {
    return (
      <BentoCard title="Paralys-Brytaren" icon={<Zap className="h-4 w-4" />}>
        <p className="mb-3 text-sm text-text-muted">
          Ett mikrosteg i taget. Ingen auto-start — du väljer när.
        </p>
        <textarea
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Vad känns överväldigande just nu?"
          rows={3}
          className="w-full rounded-xl border border-border-strong bg-surface/50 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted"
        />
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        <button
          type="button"
          disabled={loading}
          onClick={() => loadSteps(false)}
          className="btn-pill--secondary mt-4"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Hjälp mig börja'}
        </button>
      </BentoCard>
    );
  }

  return (
    <div className="space-y-4 opacity-100">
      <div className="rounded-xl border border-accent/30 bg-accent/5 px-3 py-2 text-xs text-text-muted">
        Fokus: steg {Math.min(cursor + 1, steps.length)} av {steps.length}
      </div>
      {visible.map((step, i) => (
        <BentoCard
          key={`${cursor}-${i}-${step.instruction.slice(0, 24)}`}
          title={`Mikrosteg ${cursor + i + 1}`}
          className={i === 0 ? '' : 'opacity-60'}
        >
          <p className="text-sm text-text-primary">{step.instruction}</p>
          <p className="mt-2 text-xs text-text-muted">
            ~{step.estimatedSeconds}s · {step.physicalAnchor}
          </p>
        </BentoCard>
      ))}
      <div className="flex flex-col gap-2">
        {hasMore && (
          <button
            type="button"
            disabled={loading}
            onClick={() => setCursor((c) => c + BATCH_SIZE)}
            className="btn-pill--ghost text-sm"
          >
            Nästa steg i listan
          </button>
        )}
        <button
          type="button"
          disabled={loading}
          onClick={() => loadSteps(true)}
          className="btn-pill--secondary text-sm"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ge mig 3 till'}
        </button>
        <button type="button" onClick={onDone} className="btn-pill--success text-sm">
          Klar
        </button>
      </div>
    </div>
  );
}
</file>

<file path="src/modules/wellbeing/compasses/config/compassTimeIcons.ts">
import type { CompassFlow } from '../utils/compassTime';

/** K1–K3 — docs/design/references/KOMPASS-TRE-TIDPUNKTER.md */
export type CompassTimeIconId = 'kvall' | 'skymning' | 'soluppgang';

export const COMPASS_TIME_ICON_SRC: Record<CompassTimeIconId, string> = {
  kvall: '/icons/compass-time/kvall.png',
  skymning: '/icons/compass-time/skymning.png',
  soluppgang: '/icons/compass-time/soluppgang.png',
};

export const COMPASS_FLOW_TIME_ICON: Record<
  CompassFlow,
  { iconId: CompassTimeIconId; shortLabel: string }
> = {
  morning: { iconId: 'soluppgang', shortLabel: 'Morgon' },
  day: { iconId: 'skymning', shortLabel: 'Dag' },
  evening: { iconId: 'kvall', shortLabel: 'Kväll' },
};

export const COMPASS_FLOW_ORDER: CompassFlow[] = ['morning', 'day', 'evening'];
</file>

<file path="src/modules/wellbeing/compasses/hooks/useCompassTimeFlow.ts">
import { useCallback, useEffect, useState } from 'react';
import { useStore } from '../../../core/store';
import { getDefaultCompassByTime, type CompassFlow } from '../utils/compassTime';

/** Aktiv kompass-flöde — följer klockan och uppdateras vid tidsgränser (SPEC §3). */
export function useCompassTimeFlow() {
  const setCompassFilter = useStore((s) => s.setCompassFilter);
  const [timeFlow, setTimeFlow] = useState<CompassFlow>(() => getDefaultCompassByTime());
  const [manualFlow, setManualFlow] = useState<CompassFlow | null>(null);

  const refreshTimeFlow = useCallback(() => {
    setTimeFlow(getDefaultCompassByTime());
  }, []);

  useEffect(() => {
    refreshTimeFlow();
    const id = window.setInterval(refreshTimeFlow, 60_000);
    const onVis = () => {
      if (document.visibilityState === 'visible') refreshTimeFlow();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [refreshTimeFlow]);

  useEffect(() => {
    setManualFlow(null);
  }, [timeFlow]);

  const activeFlow = manualFlow ?? timeFlow;

  useEffect(() => {
    setCompassFilter(activeFlow);
  }, [activeFlow, setCompassFilter]);

  const switchFlow = useCallback((id: CompassFlow) => {
    setManualFlow(id);
  }, []);

  return { activeFlow, timeFlow, switchFlow };
}
</file>

<file path="src/modules/wellbeing/compasses/utils/compassTheme.ts">
/** K1–K3 — docs/design/references/KOMPASS-TRE-TIDPUNKTER.md */
export type CompassThemeId = 'kvall' | 'skymning' | 'soluppgang';

export function getCompassThemeByTime(date = new Date()): CompassThemeId {
  const h = date.getHours();
  if (h >= 17 && h < 21) return 'kvall';
  if (h >= 5 && h < 9) return 'soluppgang';
  return 'skymning';
}
</file>

<file path="src/modules/wellbeing/compasses/utils/compassTime.ts">
export type CompassFlow = 'morning' | 'day' | 'evening';

/** Tids-default per De-3-Kompasserna-SPEC §3 (morgon 05–11, dag 11–17, kväll övrigt). */
export function getDefaultCompassByTime(date = new Date()): CompassFlow {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'day';
  return 'evening';
}
</file>

<file path="src/modules/wellbeing/compasses/index.ts">
export { DashboardPage } from './components/DashboardPage';
export { VardagenPage, parseVardagenTab } from './components/VardagenPage';
export type { VardagenTab } from './components/VardagenPage';
</file>

<file path="src/modules/wellbeing/compasses/README.md">
# kompasser

> De 3 Kompasserna — dygnsrytm (morgon/dag/kväll), ett mikrosteg i taget.

## Syfte

ADHD/GAD-stöd: Morgon (intention), Dag (puls + Paralys-Brytaren), Kväll (KASAM + crazymaking-bro). **Skriver inte** auto till Valv.

## Route och ingång

| | |
|---|---|
| **Route** | `/vardagen` (kompasser-flik) |
| **Redirect** | `/kompasser` → `/vardagen` |
| **AuthGate** | ja |
| **Dock** | Sprout |

## Viktiga filer

| Fil | Roll |
|-----|------|
| `components/VardagenPage.tsx` | Vardagen + Kunskap-flikar |
| `components/DashboardPage.tsx` | Kompasser-orkestrator |
| `components/ParalysPanel.tsx` | Paralys-Brytaren |
| `components/KasamEvening.tsx` | Kväll KASAM 3 steg |
| `api/compassService.ts` | `saveCheckIn`, `breakDownResponse` |
| `utils/compassTime.ts` | Tids-default vid öppning |

## Data

| Collection | Innehåll |
|------------|----------|
| `checkins` | WORM — morgon/dag/kväll, `taskNote` för KASAM JSON |

## Beror på

- `core` — layout, auth, UI
- `functions/` — Paralys callable

## Kopplingar

- **kompis** — Kunskap-flik i Vardagen
- **speglings_system**, **verklighetsvalvet**, **mabra**, **barnens_livsloggar** — crazymaking-broar
- **dagbok** — skild (ingen auto-write)

## Minne / AI

| | |
|---|---|
| **Permanent lagring** | `checkins` — WORM |
| **RAG / chatt** | Nej |
| **PDF / samlad export** | — |
| **Planerat** | opt-in sammanfattning → `kampspar` |

## Mer läsning

- [module_plan.md](./module_plan.md)
- [Kontext (.context)](../../../.context/modules/wellbeing/compasses.md)
- [De-3-Kompasserna-SPEC](../../../docs/specs/modules/De-3-Kompasserna-SPEC.md)

**Smoke:** `npm run smoke:compass`
</file>

<file path="src/modules/wellbeing/compasses/components/VardagenPage.tsx">
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { BentoCard } from '../../../core/ui/BentoCard';
import { TabBar } from '../../../core/ui/TabBar';
import { useStore } from '../../../core/store';
import { EconomyPage } from '../../economy';
import { getDefaultCompassByTime } from '../utils/compassTime';
import { DashboardPage } from './DashboardPage';
import { vaultDrawerPath } from '../../../core/navigation/navTruth';
import { useHubTab } from '../../../core/navigation/hooks/useHubTab';

export type VardagenTab = 'kompasser' | 'ekonomi';

export function parseVardagenTab(raw: string | null): VardagenTab {
  if (raw === 'ekonomi') return 'ekonomi';
  return 'kompasser';
}

export function VardagenPage() {
  const { tabs, activeTab, setTab, legacyRedirect } = useHubTab('vardagen', {
    legacyTabRedirects: {
      kunskap: {
        pathname: '/dagbok',
        search: (() => {
          const vaultPath = vaultDrawerPath('kunskapsbank');
          const qIndex = vaultPath.indexOf('?');
          return qIndex >= 0 ? vaultPath.slice(qIndex) : '';
        })(),
      },
    },
  });
  const tab = activeTab as VardagenTab;
  const setCompassFilter = useStore((s) => s.setCompassFilter);

  useEffect(() => {
    if (tab === 'kompasser') {
      setCompassFilter(getDefaultCompassByTime());
    }
  }, [tab, setCompassFilter]);

  if (legacyRedirect) {
    return <Navigate to={legacyRedirect} replace />;
  }

  return (
    <div className="space-y-6">
      <BentoCard title="Vardagen" description="Rytm · ekonomi">
        <p className="mb-4 text-sm text-text-muted">
          Daglig struktur och vardagsstress. Kunskap finns bakom Valv — se menyn.
        </p>
        <TabBar tabs={tabs} active={activeTab} onChange={setTab} />
      </BentoCard>

      {tab === 'kompasser' && <DashboardPage embedded />}
      {tab === 'ekonomi' && <EconomyPage embedded />}
    </div>
  );
}
</file>

<file path="src/modules/wellbeing/compasses/config/compassFlows.ts">
import type { LucideIcon } from 'lucide-react';
import { Sun, Cloud, Moon } from 'lucide-react';
import type { CompassFlow } from '../utils/compassTime';

export const MORNING_ANCHOR =
  'Min hjärna är inte trasig. Den reagerar helt normalt på en onormal situation.';

export type CompassFlowConfig = {
  id: CompassFlow;
  label: string;
  icon: LucideIcon;
  question: string;
  options: string[];
  heroTitle: string;
  heroLead: string;
};

export const COMPASS_FLOWS: CompassFlowConfig[] = [
  {
    id: 'morning',
    label: 'Morgon',
    icon: Sun,
    question: 'Vilket mikrosteg ger dig lugnast start idag?',
    options: ['Andning 2 min', 'En uppgift', 'Inget — vila'],
    heroTitle: 'Morgonkompass',
    heroLead: 'Ett mikrosteg för lugn start — anpassas efter morgon (05–11).',
  },
  {
    id: 'day',
    label: 'Dag',
    icon: Cloud,
    question: 'Hur mår kroppen just nu?',
    options: ['Stabil', 'Trött', 'Spänd', 'Orolig'],
    heroTitle: 'Dagskompass',
    heroLead: 'Kroppscheck — anpassas efter dag (12–16).',
  },
];

export const EVENING_HERO = {
  heroTitle: 'Kvällskompass',
  heroLead: 'Landa dagen med KASAM — tre korta steg efter kväll (17–04).',
  label: 'Kväll',
  icon: Moon,
};

export function getFlowConfig(flow: CompassFlow): CompassFlowConfig | null {
  return COMPASS_FLOWS.find((f) => f.id === flow) ?? null;
}
</file>

<file path="src/modules/wellbeing/compasses/utils/compassAdvice.ts">
import { EVENING_HERO, getFlowConfig } from '../config/compassFlows';
import type { CompassFlow } from './compassTime';
import { getDefaultCompassByTime } from './compassTime';

/**
 * Korta råd på Hem / Hamn / Kompassråd (svenska, lågaffektivt).
 * Kväll: «landa» = verb (stänga dagen), inte substantivet «land».
 */
export const COMPASS_ADVICE: Record<CompassFlow, string> = {
  morning: 'Ett mikrosteg räcker. Du behöver inte planera hela dagen nu.',
  day: 'Börja med kroppen — sedan logistik, ett steg i taget.',
  evening: 'Landa dagen lugnt. Gränser får vänta till i morgon om det känns tungt.',
};

export function getCompassAdvice(flow: CompassFlow): string {
  return COMPASS_ADVICE[flow];
}

export function getCompassFlowMeta(flow: CompassFlow = getDefaultCompassByTime()) {
  if (flow === 'evening') {
    return {
      flow,
      label: EVENING_HERO.label,
      heroLead: EVENING_HERO.heroLead,
      heroTitle: EVENING_HERO.heroTitle,
    };
  }
  const cfg = getFlowConfig(flow)!;
  return {
    flow,
    label: cfg.label,
    heroLead: cfg.heroLead,
    heroTitle: cfg.heroTitle,
  };
}
</file>

<file path="src/modules/wellbeing/compasses/module_plan.md">
# kompasser — module plan

## Overview

De 3 Kompasserna — Morgonkompassen (Sacred), Dagskompassen, Kvällskompassen. Mikro-check-ins → Firestore `checkins`.

**Route:** `/vardagen` (tab kompasser) · **Redirect:** `/kompasser` → `/vardagen`  
**Canonical:** `.context/modules/wellbeing/compasses.md` · **Spec:** `docs/specs/modules/De-3-Kompasserna-SPEC.md` (notebook #1–#5 konsoliderad, beslut låsta 2026-05-21)

## Låsta beslut (implementationsreferens)

| Beslut | Val |
|--------|-----|
| Paralys | Manuell; *"Ge mig 3 till"* i session |
| Notiser | In-app default → lokal push max 2–3/dag |
| Crazymaking | Knapp till Valv/Speglar — **ingen** auto-WORM |
| checkins | WORM append-only |
| Missad morgon | Default dag, ingen skuld |
| Silo | Ingen auto-write `reality_vault` |

## Files

| Path | Role |
|------|------|
| `components/VardagenPage.tsx` | Tab kompasser / ekonomi / kunskap |
| `components/DashboardPage.tsx` | Tids-default, morgon/dag/kväll, Klar-reset |
| `components/ParalysPanel.tsx` | `breakDownResponse`, Ge mig 3 till |
| `components/KasamEvening.tsx` | KASAM 3 steg + crazymaking-broar |
| `api/compassService.ts` | Callable wrapper |
| `utils/compassTime.ts` | `getDefaultCompassByTime` |
| `../core/store/index.ts` | `compassFilter` — synkas med aktiv flik |
| `../core/routing/AppRoutes.tsx` | `/kompasser` redirect |
| `../core/firebase/firestore.ts` | `saveCheckIn` → `checkins` |

## Flows (DashboardPage)

| id | Label | questionId | Syfte |
|----|-------|------------|-------|
| `morning` | Morgon | `compass_morning` | Sacred — intention |
| `day` | Dag | `compass_day` | Puls / Paralys |
| `evening` | Kväll | `compass_evening` | KASAM (planerat 3 steg) |

## Status

| Area | Kladd 2026-05-21 | Kod | Status |
|------|------------------|-----|--------|
| Morgon/Dag/Kväll + checkins | Dygnsrytm ADHD | Ja | **done** |
| Paralys auto vid lågt humör | **Nej** — manuell | Nej | **avvisat** |
| Paralys-Brytaren UI | Master §G | Ja | **done** |
| KASAM kväll 3 steg | Kladd | Ja | **done** |
| Crazymaking-bro | Ej auto-WORM | Ja | **done** |
| AuthGate + tids-default | Kladd | Ja | **done** |
| Notiser 2–3/dag | In-app först | Nej | **planned** |
| Bro Måbra/Barnen kväll | Kladd | Ja | **done** |
| Widget under varje kompass (snabbstart) | Eval 2026-05-29 | Nej | **planned** P1 |
| Kompass UI redesign (K1/K2/K3 + städning) | Eval 2026-05-29 | Delvis Hem | **planned** P2 |

**Plan widget:** [`docs/evaluations/2026-05-29-kompass-widget-snabbstart-plan.md`](../../../docs/evaluations/2026-05-29-kompass-widget-snabbstart-plan.md)

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md)

## Dependencies

- `core/ui/BentoCard`, chip-stilar
- `functions:breakDownResponse`, `speglingsMirror` (UI ej kopplad)

## Security notes

- Check-in uid-scoped — Firestore `isOwnerCreate`
- AuthGate på `/vardagen` — **done**
- Ingen auto-skriv till `reality_vault`

## Smoke

```bash
npm run smoke:compass
```

## Nästa fas

1. Notiser (lokal push max 2–3/dag)
2. Sanningens Ankare från valv (ej auto)
3. `energyLevel` / `kasamData` som strukturerade fält (valfritt)
</file>

<file path=".context/locked-icons.md">
# Låsta ikoner (produkt — 2026-05-29)

**Status:** D1 + M2 låsta. App-ikon: **P7** (vault-sacred-3d, prod 2026-05-29) · P6 · P8-alpha.

| ID | Plats | Komponent / fil | Status |
|----|-------|-----------------|--------|
| **D1** Gold stack | Header lockup, dock-mitt, hero-centrum, drawer-mark | `LivskompassMark.tsx` · `LivskompassBrandLockup.tsx` | LÅST |
| **M2** Orakelöga | Kompis-avatar (header) | `KompisMark.tsx` | LÅST |
| ~~**B1**~~ | Legacy | `d1-helros-2026-05-26-archive` | Arkiverad |

## Hub chrome v5 (G1 default)

- Generator: `npm run icons:proposals-v5`
- Prod: `public/icons/chrome/v5-g1-*.svg` · `ChromeV5Icon`
- Stilar G1–G5: Theme Lab (`lk.chromeIconStyle`)

## Telefonikoner

| ID | Fil |
|----|-----|
| **P7** | `vault-sacred-3d-2026-05-source.png` → `P7-vault-sacred-1024.png` (**prod**) |
| **P7-alpha** | `P7-vault-sacred-alpha-1024.png` (transparent) |
| **P6** | `P6-gold-emboss-1024.png` |
| **P8-alpha** | `P8-orbit-hub-alpha-1024.png` |

`npm run icons:phone-export` · `npm run android:icons:phone`

## Smoke

`npm run smoke:locked-icons` · `npm run smoke:locked-ux`
</file>

<file path="src/modules/core/home/livskompassHeroConfig.ts">
import type { ChromeV5Category } from '../ui/chromeIcons';

export type OrbitRing = 'cardinal' | 'intercardinal';

export type OrbitSlotConfig = {
  id: string;
  icon: ChromeV5Category;
  label: string;
  shortLabel: string;
  blurb: string;
  to: string;
  /** Degrees clockwise from north (12 o'clock). */
  angle: number;
  ring: OrbitRing;
};

/** Yttre ring — huvudzoner. Inner ring — livsmoduler. */
export const HERO_ORBIT_SLOTS: OrbitSlotConfig[] = [
  {
    id: 'rutiner',
    icon: 'rutiner',
    label: 'Rutiner och kompasser',
    shortLabel: 'Rutiner',
    blurb: 'Morgon · dag · kväll',
    to: '/vardagen?tab=kompasser',
    angle: 0,
    ring: 'cardinal',
  },
  {
    id: 'planering',
    icon: 'planering',
    label: 'Planering',
    shortLabel: 'Planering',
    blurb: 'Handling · kanban',
    to: '/planering?tab=handling',
    angle: 45,
    ring: 'intercardinal',
  },
  {
    id: 'ekonomi',
    icon: 'ekonomi',
    label: 'Ekonomi',
    shortLabel: 'Ekonomi',
    blurb: 'Veckopeng · matlåda',
    to: '/vardagen?tab=ekonomi',
    angle: 90,
    ring: 'cardinal',
  },
  {
    id: 'familjen',
    icon: 'familjen',
    label: 'Familjen',
    shortLabel: 'Familjen',
    blurb: 'Barn · middagsfråga',
    to: '/familjen',
    angle: 135,
    ring: 'intercardinal',
  },
  {
    id: 'mabra',
    icon: 'utveckling',
    label: 'Personlig utveckling',
    shortLabel: 'Utveckling',
    blurb: 'Övningar · MåBra',
    to: '/mabra',
    angle: 180,
    ring: 'cardinal',
  },
  {
    id: 'dagbok',
    icon: 'dagbok',
    label: 'Dagbok',
    shortLabel: 'Dagbok',
    blurb: 'Neutral rad · spegling',
    to: '/dagbok',
    angle: 225,
    ring: 'intercardinal',
  },
  {
    id: 'kunskap',
    icon: 'kunskap',
    label: 'Kunskap',
    shortLabel: 'Kunskap',
    blurb: 'Kunskapsbank · bakom Valv-PIN',
    to: '/dagbok?tab=bevis&vaultTab=kunskapsbank',
    angle: 270,
    ring: 'cardinal',
  },
  {
    id: 'valv',
    icon: 'valv',
    label: 'Valv',
    shortLabel: 'Valv',
    blurb: 'Bevis · mönster · orkester',
    to: '/dagbok?tab=bevis',
    angle: 315,
    ring: 'intercardinal',
  },
];

export type HeroQuickPick = {
  id: string;
  label: string;
  to: string;
  icon?: ChromeV5Category;
  /** Kompis (M2) — ingen v4-asset. */
  mark?: 'kompis';
};

/** Snabbval längs nedre kompassbåge (ikon + etikett). */
export const HERO_QUICK_PICKS: HeroQuickPick[] = [
  { id: 'checkin', label: 'Check-in', to: '/', icon: 'rutiner' },
  { id: 'dagbok', label: 'Dagbok', to: '/dagbok', icon: 'dagbok' },
  { id: 'uppgift', label: 'Uppgift', to: '/planering?tab=handling', icon: 'planering' },
  { id: 'hamn', label: 'Hamn', to: '/hamn', icon: 'hamn' },
  { id: 'kompis', label: 'Kompis', to: '/kompis', mark: 'kompis' },
];

export const COMPASS_CARDINALS = [
  { id: 'n', label: 'N', angle: 0 },
  { id: 'o', label: 'Ö', angle: 90 },
  { id: 's', label: 'S', angle: 180 },
  { id: 'v', label: 'V', angle: 270 },
] as const;

export function orbitRadiusPercent(ring: OrbitRing): number {
  return ring === 'cardinal' ? 42 : 31;
}
</file>

<file path="src/modules/core/home/DagensRiktningCard.tsx">
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { CompassQuickWidgetRail } from '../../wellbeing/compasses/components/CompassQuickWidgetRail';
import { DashboardPage } from '../../wellbeing/compasses/components/DashboardPage';
import { getCompassAdvice, getCompassFlowMeta } from '../../wellbeing/compasses/utils/compassAdvice';
import { getDefaultCompassByTime } from '../../wellbeing/compasses/utils/compassTime';
import { DagensRiktningCompassIcon } from './DagensRiktningCompassIcon';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckInSaved?: () => void;
};

export function DagensRiktningCard({ open, onOpenChange, onCheckInSaved }: Props) {
  const flow = getDefaultCompassByTime();
  const meta = getCompassFlowMeta(flow);
  const advice = getCompassAdvice(flow);

  return (
    <section className="dagens-riktning" aria-label="Dagens riktning">
      <div className={clsx('dagens-riktning-card', open && 'dagens-riktning-card--open')}>
        <div className="dagens-riktning-card__main">
          <div className="dagens-riktning-card__icon-wrap">
            <DagensRiktningCompassIcon activeFlow={flow} />
          </div>

          <div className="dagens-riktning-card__body">
            <p className="dagens-riktning-card__eyebrow">
              <span className="dagens-riktning-card__active-dot" aria-hidden />
              Dagens riktning · {meta.label}
            </p>
            <p className="dagens-riktning-card__title">{meta.heroTitle}</p>
            <p className="dagens-riktning-card__quote">{advice}</p>
          </div>
        </div>

        <div className="dagens-riktning-card__actions">
          <button
            type="button"
            className="dagens-riktning-card__cta"
            aria-expanded={open}
            onClick={() => onOpenChange(!open)}
          >
            <span>{open ? 'Stäng check-in' : 'Checka in nu'}</span>
            <ChevronDown
              className={clsx('dagens-riktning-card__cta-chevron', open && 'dagens-riktning-card__cta-chevron--open')}
              strokeWidth={1.75}
              aria-hidden
            />
          </button>
        </div>

        {open ? (
          <div className="dagens-riktning-card__panel">
            <CompassQuickWidgetRail flow={flow} className="compass-quick-widget-rail--in-module" />
            <DashboardPage
              variant="module"
              forcedFlow={flow}
              onCheckInSaved={() => {
                onCheckInSaved?.();
                onOpenChange(false);
              }}
            />
          </div>
        ) : (
          <CompassQuickWidgetRail flow={flow} compact className="compass-quick-widget-rail--below" />
        )}
      </div>
    </section>
  );
}
</file>

<file path="src/modules/core/home/HomeHeroKanon.tsx">
import { useState } from 'react';
import { HomeGreeting } from './HomeGreeting';
import { HomeStreakChip } from './HomeStreakChip';
import { DagensRiktningCard } from './DagensRiktningCard';

type Props = {
  onCheckInSaved?: () => void;
};

/**
 * Hem — scenic I-stone (HOME-HERO-KANON.md).
 * Check-in endast via DagensRiktningCard (undviker dubbel CTA mot samma panel).
 * Full kompass-hub: LivskompassHero variant=compass — P2 / theme-lab tills elongated shippar.
 */
export function HomeHeroKanon({ onCheckInSaved }: Props) {
  const [checkInOpen, setCheckInOpen] = useState(false);

  return (
    <div className="home-hero-kanon space-y-5">
      <div className="home-hero-kanon__bridge">
        <div className="home-hero-kanon__compass-stage" aria-hidden />

        <div className="home-hero-kanon__scenic-stack">
          <div className="home-hero-kanon__intro">
            <HomeGreeting />
            <HomeStreakChip />
          </div>

          <DagensRiktningCard
            open={checkInOpen}
            onOpenChange={setCheckInOpen}
            onCheckInSaved={() => {
              onCheckInSaved?.();
              setCheckInOpen(false);
            }}
          />
        </div>
      </div>

      <div className="home-hero-kanon__dots" aria-hidden>
        <span className="home-hero-kanon__dot home-hero-kanon__dot--active" />
        <span className="home-hero-kanon__dot" />
        <span className="home-hero-kanon__dot" />
        <span className="home-hero-kanon__dot" />
        <span className="home-hero-kanon__dot" />
      </div>
    </div>
  );
}
</file>

<file path="src/modules/core/home/LivskompassHero.tsx">
import { useCallback, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { LivskompassMark } from '../ui/LivskompassMark';
import { ChromeV5Icon } from '../ui/chromeIcons';
import { getHeroVisualVariant } from '../theme/chromeIconPrefs';
import { getCompassThemeByTime } from '../../wellbeing/compasses/utils/compassTheme';
import {
  COMPASS_CARDINALS,
  HERO_ORBIT_SLOTS,
  orbitRadiusPercent,
} from './livskompassHeroConfig';
import { useKognitivSkoldVariant } from './useKognitivSkoldVariant';

type Props = {
  onCenterPress?: () => void;
  /** Kompakt avlång hub (standard). `compass` = full sköld med orbit. */
  variant?: 'compact' | 'compass';
};

export function LivskompassHero({ onCenterPress, variant = 'compact' }: Props) {
  const navigate = useNavigate();
  const theme = getCompassThemeByTime();
  const { variantId, tokens } = useKognitivSkoldVariant();
  const [openOrbitId, setOpenOrbitId] = useState<string | null>(null);
  const heroVisual = getHeroVisualVariant();

  const skoldStyle = {
    '--k-shield-rim': tokens.rim,
    '--k-shield-gold': tokens.gold,
    '--k-shield-glow': tokens.glow,
    '--k-shield-fill': tokens.shield,
    '--k-panel-top': tokens.panelTop,
    '--k-panel-bottom': tokens.panelBottom,
  } as CSSProperties;

  const closeMenus = useCallback(() => setOpenOrbitId(null), []);

  const toggleOrbit = (id: string) => {
    setOpenOrbitId((prev) => (prev === id ? null : id));
  };

  const goOrbit = (to: string) => {
    navigate(to);
    closeMenus();
  };

  if (variant === 'compact') {
    return (
      <section
        className={clsx('livskompass-hero livskompass-hero--compact', `livskompass-hero--${theme}`)}
        data-k-skold={variantId}
        style={skoldStyle}
        aria-label={`Livskompassen — Kognitiv sköld (${tokens.title})`}
      >
        <div className="livskompass-hero__panel">
          <button
            type="button"
            className="livskompass-hero__compact-bar"
            aria-label="Checka in — Kognitiv sköld"
            onClick={() => onCenterPress?.()}
          >
            <span className="livskompass-hero__compact-mark" aria-hidden>
              <LivskompassMark className="livskompass-hero__compact-mark-icon" />
            </span>
            <span className="livskompass-hero__compact-copy">
              <span className="livskompass-hero__compact-title">Kognitiv sköld</span>
              <span className="livskompass-hero__compact-lead">Check-in · dagens kompass</span>
            </span>
            <ChevronRight className="livskompass-hero__compact-chevron" strokeWidth={2} aria-hidden />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className={clsx('livskompass-hero livskompass-hero--v2', `livskompass-hero--${theme}`)}
      data-k-skold={variantId}
      style={skoldStyle}
      aria-label={`Livskompassen — Kognitiv sköld (${tokens.title})`}
    >
      <div
        className={clsx(
          'livskompass-hero__panel',
          heroVisual === 'orbit-h1-alpha' && 'livskompass-hero__panel--h1-alpha',
          heroVisual === 'orbit-h1-full' && 'livskompass-hero__panel--h1-full',
        )}
      >
        <p className="livskompass-hero__shield-label">Kognitiv sköld</p>

        <div
          className="livskompass-hero__stage"
          onClick={closeMenus}
          onKeyDown={(e) => e.key === 'Escape' && closeMenus()}
          role="presentation"
        >
          <div className="livskompass-hero__face">
            <div className="livskompass-hero__ring livskompass-hero__ring--outer" aria-hidden />
            <div className="livskompass-hero__ring livskompass-hero__ring--mid" aria-hidden />

            <div className="livskompass-hero__cardinals" aria-hidden>
              {COMPASS_CARDINALS.map(({ id, label, angle }) => (
                <span
                  key={id}
                  className="livskompass-hero__cardinal"
                  style={
                    {
                      '--cardinal-angle': `${angle}deg`,
                    } as CSSProperties
                  }
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="livskompass-hero__disk">
              <div className="livskompass-hero__disk-surface" aria-hidden />
              <div className="livskompass-hero__disk-rose" aria-hidden />
              <div className="livskompass-hero__disk-orbit-ring" aria-hidden />

              {HERO_ORBIT_SLOTS.map(({ id, icon, label, shortLabel, blurb, to, angle, ring }) => {
                const open = openOrbitId === id;
                const radius = orbitRadiusPercent(ring);
                return (
                  <div
                    key={id}
                    className={clsx(
                      'livskompass-hero__orbit-wrap',
                      ring === 'intercardinal' && 'livskompass-hero__orbit-wrap--inter',
                      open && 'livskompass-hero__orbit-wrap--open',
                    )}
                    style={
                      {
                        '--orbit-angle': `${angle}deg`,
                        '--orbit-radius': `${radius}%`,
                      } as CSSProperties
                    }
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className={clsx(
                        'livskompass-hero__orbit-node',
                        open && 'livskompass-hero__orbit-node--open',
                      )}
                      aria-label={label}
                      aria-expanded={open}
                      aria-haspopup="true"
                      onClick={() => toggleOrbit(id)}
                    >
                      <span className="livskompass-hero__orbit-node-ring" aria-hidden />
                      <ChromeV5Icon category={icon} className="livskompass-hero__orbit-icon" />
                    </button>

                    <div
                      className={clsx(
                        'livskompass-hero__orbit-menu',
                        open && 'livskompass-hero__orbit-menu--visible',
                      )}
                      role="menu"
                      hidden={!open}
                    >
                      <p className="livskompass-hero__orbit-menu-label">{shortLabel}</p>
                      <p className="livskompass-hero__orbit-menu-blurb">{blurb}</p>
                      <button
                        type="button"
                        className="livskompass-hero__orbit-menu-go"
                        role="menuitem"
                        onClick={() => goOrbit(to)}
                      >
                        Öppna
                        <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                      </button>
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                className="livskompass-hero__center"
                aria-label="Checka in — dagens kompass"
                onClick={(e) => {
                  e.stopPropagation();
                  closeMenus();
                  onCenterPress?.();
                }}
              >
                <span className="livskompass-hero__center-halo" aria-hidden />
                <span className="livskompass-hero__center-gem" aria-hidden />
                <LivskompassMark className="livskompass-hero__mark" />
              </button>
            </div>
          </div>

          <p className="livskompass-hero__hint">Tryck en symbol · mitten = check-in</p>
        </div>
      </div>
    </section>
  );
}
</file>

</files>
