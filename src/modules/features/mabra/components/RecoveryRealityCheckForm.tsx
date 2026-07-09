import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ensureVitHub, saveVitEntry } from '@/core/firebase/vitHubFirestore';
import { CognitiveLoadStrip } from '@/core/ui/CognitiveLoadStrip';
import { Button, textStyles } from '@/design-system';

const DRAFT_STORAGE_KEY = 'livskompassen_recovery_reality_draft';
const RECOVERY_BANK_ID = 'DF-REALITY-01';
const RECOVERY_PROJECT_ID = 'recovery';
const TOTAL_STEPS = 7;

const FIELD_LIMITS = {
  triggerThought: 500,
  objectiveEvidence: 500,
  alternativeExplanation: 500,
  mostLikelyTruth: 500,
  reflectionNow: 500,
} as const;

type FieldKey = keyof typeof FIELD_LIMITS;

type RealityCheckDraft = {
  triggerThought: string;
  objectiveEvidence: string;
  alternativeExplanation: string;
  convictionIntensity: number;
  mostLikelyTruth: string;
  reflectionNow: string;
};

type StepMeta = {
  eyebrow: string;
  title: string;
  hint: string;
  field?: FieldKey;
  kind: 'text' | 'textarea' | 'intensity' | 'summary';
};

const STEP_META: StepMeta[] = [
  {
    eyebrow: 'Steg 1 · Trigger',
    title: 'Vad är tanken eller triggern?',
    hint: 'Situation eller tanke — t.ex. "Hon gör X för att skada mig". Ingen persondom behövs.',
    field: 'triggerThought',
    kind: 'textarea',
  },
  {
    eyebrow: 'Steg 2 · Bevis',
    title: 'Vad är det objektiva beviset?',
    hint: 'Fakta du faktiskt sett, hört eller kan verifiera — inte tolkning.',
    field: 'objectiveEvidence',
    kind: 'textarea',
  },
  {
    eyebrow: 'Steg 3 · Alternativ',
    title: 'Vilken är den alternativa förklaringen?',
    hint: 'En annan rimlig tolkning — neutral och möjlig.',
    field: 'alternativeExplanation',
    kind: 'textarea',
  },
  {
    eyebrow: 'Steg 4 · Intensitet',
    title: 'Hur stark känns övertygelsen?',
    hint: '1 = knappt märkbar · 10 = total säkerhet. Det finns inget facit.',
    kind: 'intensity',
  },
  {
    eyebrow: 'Steg 5 · Sanning',
    title: 'Vad är den mest sannolika sanningen?',
    hint: 'En balanserad formulering utifrån bevis och alternativ.',
    field: 'mostLikelyTruth',
    kind: 'textarea',
  },
  {
    eyebrow: 'Steg 6 · Nu',
    title: 'Hur känner du dig nu?',
    hint: 'Kropp, känsla eller temperatur — kort självreflektion.',
    field: 'reflectionNow',
    kind: 'textarea',
  },
  {
    eyebrow: 'Steg 7 · Sammanfattning',
    title: 'Granska innan du sparar',
    hint: 'Sparat blir permanent i Vit-zonen. Valv sker endast om du själv väljer det senare.',
    kind: 'summary',
  },
];

const EMPTY_DRAFT: RealityCheckDraft = {
  triggerThought: '',
  objectiveEvidence: '',
  alternativeExplanation: '',
  convictionIntensity: 5,
  mostLikelyTruth: '',
  reflectionNow: '',
};

const COPY = {
  next: 'Fortsätt',
  back: 'Tillbaka',
  save: 'Spara till Vit',
  doneWithoutSave: 'Klart utan spar',
  login: 'Logga in för att spara i Vit-zonen.',
  saveError: 'Kunde inte spara just nu. Försök igen när nätverket finns.',
  saved: 'Sparat. Du kan läsa tillbaka under historik.',
  stepRequired: 'Skriv minst en kort rad innan du går vidare.',
} as const;

function localDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function clampIntensity(value: number): number {
  return Math.min(10, Math.max(1, Math.round(value)));
}

function readDraftFromStorage(): RealityCheckDraft {
  if (typeof window === 'undefined') return EMPTY_DRAFT;
  try {
    const raw = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return EMPTY_DRAFT;
    const parsed = JSON.parse(raw) as Partial<RealityCheckDraft>;
    return {
      triggerThought: typeof parsed.triggerThought === 'string' ? parsed.triggerThought : '',
      objectiveEvidence:
        typeof parsed.objectiveEvidence === 'string' ? parsed.objectiveEvidence : '',
      alternativeExplanation:
        typeof parsed.alternativeExplanation === 'string' ? parsed.alternativeExplanation : '',
      convictionIntensity: clampIntensity(parsed.convictionIntensity ?? 5),
      mostLikelyTruth: typeof parsed.mostLikelyTruth === 'string' ? parsed.mostLikelyTruth : '',
      reflectionNow: typeof parsed.reflectionNow === 'string' ? parsed.reflectionNow : '',
    };
  } catch {
    return EMPTY_DRAFT;
  }
}

function writeDraftToStorage(draft: RealityCheckDraft): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

function clearDraftStorage(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
}

function formatRecoveryRealityCheckText(draft: RealityCheckDraft): string {
  return [
    '--- Recovery Reality Check ---',
    `automatic_thought: ${draft.triggerThought.trim()}`,
    `evidence_for: ${draft.objectiveEvidence.trim()}`,
    `evidence_against: ${draft.alternativeExplanation.trim()}`,
    `intensity_before: ${draft.convictionIntensity}`,
    `balanced_thought: ${draft.mostLikelyTruth.trim()}`,
    `reflection_after: ${draft.reflectionNow.trim()}`,
  ].join('\n');
}

function stepRequiresInput(stepIndex: number): boolean {
  return stepIndex === 0;
}

type Props = {
  userId: string | undefined;
  onSaved?: () => void;
  onComplete?: () => void;
};

/** Kat 8 — KBT verklighetskontroll (Obsidian Calm, ett steg i taget). */
export function RecoveryRealityCheckForm({ userId, onSaved, onComplete }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<RealityCheckDraft>(EMPTY_DRAFT);
  const [hydrated, setHydrated] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(readDraftFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeDraftToStorage(draft);
  }, [draft, hydrated]);

  const step = STEP_META[stepIndex] ?? STEP_META[0];

  const updateField = useCallback((field: FieldKey, value: string) => {
    const limit = FIELD_LIMITS[field];
    setDraft((prev) => ({ ...prev, [field]: value.slice(0, limit) }));
    setFieldError(null);
    setSaved(false);
    setSaveError(null);
  }, []);

  const updateIntensity = useCallback((value: number) => {
    setDraft((prev) => ({ ...prev, convictionIntensity: clampIntensity(value) }));
    setSaved(false);
    setSaveError(null);
  }, []);

  const validateCurrentStep = useCallback((): boolean => {
    if (!stepRequiresInput(stepIndex)) return true;
    const value = draft.triggerThought.trim();
    if (!value) {
      setFieldError(COPY.stepRequired);
      return false;
    }
    return true;
  }, [draft.triggerThought, stepIndex]);

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setFieldError(null);
    setStepIndex((i) => Math.min(TOTAL_STEPS - 1, i + 1));
  };

  const handleBack = () => {
    setFieldError(null);
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const handleReset = () => {
    setDraft(EMPTY_DRAFT);
    clearDraftStorage();
    setStepIndex(0);
    setFieldError(null);
    setSaveError(null);
    setSaved(false);
    onComplete?.();
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setSaveError(null);
    try {
      await ensureVitHub(userId, RECOVERY_PROJECT_ID);
      await saveVitEntry(userId, {
        projectId: RECOVERY_PROJECT_ID,
        kind: 'memory',
        bankId: RECOVERY_BANK_ID,
        content_class: 'REFLECTION',
        responseText: formatRecoveryRealityCheckText(draft),
        cardDateKey: localDateKey(),
        zone: 'recovery',
        inputMode: 'recovery_reality_check',
      });
      clearDraftStorage();
      setSaved(true);
      onSaved?.();
    } catch {
      setSaveError(COPY.saveError);
    } finally {
      setSaving(false);
    }
  };

  const summaryRows = useMemo(
    () =>
      [
        { label: 'Trigger / tanke', value: draft.triggerThought },
        { label: 'Objektivt bevis', value: draft.objectiveEvidence },
        { label: 'Alternativ förklaring', value: draft.alternativeExplanation },
        { label: 'Övertygelse (1–10)', value: String(draft.convictionIntensity) },
        { label: 'Mest sannolik sanning', value: draft.mostLikelyTruth },
        { label: 'Känsla nu', value: draft.reflectionNow },
      ].filter((row) => row.value.trim().length > 0),
    [draft],
  );

  if (!hydrated) {
    return (
      <div className="rounded-2xl border-[0.5px] border-border bg-gradient-to-b from-surface to-surface-2 p-6">
        <Loader2 className="mx-auto h-5 w-5 animate-spin text-accent/70" aria-hidden />
      </div>
    );
  }

  return (
    <section
      aria-label="Verklighetskontroll"
      className="rounded-2xl border-[0.5px] border-border bg-gradient-to-b from-bg via-surface to-surface-2 p-4 sm:p-6"
    >
      <CognitiveLoadStrip
        label="Ett steg i taget"
        hint="Beskriv och granska — inget rätt eller fel."
      />

      <div className="mt-4 flex items-center gap-1.5" aria-hidden>
        {STEP_META.map((meta, index) => (
          <span
            key={meta.eyebrow}
            className={`h-1 flex-1 rounded-full transition-colors ${
              index <= stepIndex ? 'bg-accent/50' : 'bg-surface-3'
            }`}
          />
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <p className={textStyles.eyebrow}>
            {step.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-lg text-text">{step.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">{step.hint}</p>
        </div>

        {step.kind === 'textarea' && step.field ? (
          <label className="block text-xs text-text-dim">
            <textarea
              value={draft[step.field]}
              onChange={(e) => updateField(step.field as FieldKey, e.target.value)}
              rows={4}
              maxLength={FIELD_LIMITS[step.field]}
              className="input-glass mt-2 w-full resize-none text-sm"
              placeholder="Skriv fritt…"
            />
            <span className="mt-1 block text-right tabular-nums">
              {draft[step.field].length}/{FIELD_LIMITS[step.field]}
            </span>
          </label>
        ) : null}

        {step.kind === 'intensity' ? (
          <div className="rounded-xl border-[0.5px] border-border bg-surface-2/70 px-4 py-5">
            <p className="text-center font-display text-4xl tabular-nums text-accent">
              {draft.convictionIntensity}
            </p>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={draft.convictionIntensity}
              onChange={(e) => updateIntensity(Number(e.target.value))}
              className="mt-4 w-full accent-accent"
              aria-label="Övertygelse intensitet 1 till 10"
            />
            <div className="mt-2 flex justify-between text-[11px] text-text-dim">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
        ) : null}

        {step.kind === 'summary' ? (
          <div className="space-y-3">
            {summaryRows.length > 0 ? (
              <ul className="space-y-3 rounded-xl border-[0.5px] border-border bg-surface-2/60 p-4">
                {summaryRows.map((row) => (
                  <li key={row.label} className="border-b-[0.5px] border-border/40 pb-3 last:border-0 last:pb-0">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-text-dim">{row.label}</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-text">{row.value}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-muted">Inget att spara ännu — gå tillbaka och fyll i minst en rad.</p>
            )}

            {!userId ? (
              <p className="text-sm text-text-dim">{COPY.login}</p>
            ) : null}

            {saved ? (
              <p className="rounded-xl border-[0.5px] border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
                {COPY.saved}
              </p>
            ) : null}

            {saveError ? (
              <p className="rounded-xl border-[0.5px] border-border bg-surface-3/50 px-3 py-2 text-sm text-text-muted">
                {saveError}
              </p>
            ) : null}
          </div>
        ) : null}

        {fieldError ? (
          <p className="text-sm text-text-muted">{fieldError}</p>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
        {stepIndex > 0 ? (
          <Button type="button" onClick={handleBack} variant="ghost" className="--ghost text-sm">
            {COPY.back}
          </Button>
        ) : (
          <span />
        )}

        {stepIndex < TOTAL_STEPS - 1 ? (
          <Button type="button" onClick={handleNext} variant="secondary" className="--secondary sm:ml-auto">
            {COPY.next}
          </Button>
        ) : (
          <div className="flex w-full flex-col gap-2 sm:ml-auto sm:w-auto sm:flex-row">
            <Button type="button" onClick={handleReset} variant="ghost" className="--ghost text-sm">
              {COPY.doneWithoutSave}
            </Button>
            <Button type="button" onClick={() => void handleSave()} disabled={!userId || saving || saved || summaryRows.length === 0} variant="secondary" className="--secondary inline-flex items-center justify-center gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              {COPY.save}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
