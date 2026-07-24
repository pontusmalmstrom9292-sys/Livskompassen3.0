/** @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET.md */
import { useEffect, useMemo, useState } from 'react';
import {
  Clock,
  ListTodo,
  PiggyBank,
  FileText,
  Loader2,
  Sparkles,
  Palmtree,
  Target,
  PartyPopper,
  Minimize2,
  Image as ImageIcon,
  FlaskConical,
  Pin,
} from 'lucide-react';
import { Input, TextArea, textStyles } from '@/design-system';
import { getBudgetSavings } from '@/core/firebase/economyFirestore';
import type { BudgetSavingsRow, UserWidget, UserWidgetStylePreset } from '@/core/types/firestore';
import { WIDGET_STYLE_PRESETS, WIDGET_STYLE_PRESET_IDS } from '../config/widgetStylePresets';
import { USER_WIDGET_HOME_SLOT_ID } from '../utils/normalizeUserWidget';
import type { WidgetBuildCapacity } from '../utils/widgetBuildCapacity';
import { HomeWidgetRenderer } from './HomeWidgetRenderer';
import { WidgetButton } from './WidgetButton';

type WidgetType = UserWidget['type'];

const TYPE_OPTIONS: {
  id: WidgetType;
  label: string;
  icon: typeof Clock;
}[] = [
  { id: 'countdown', label: 'Nedräkning', icon: Clock },
  { id: 'checklist', label: 'Checklista', icon: ListTodo },
  { id: 'linked_savings', label: 'Sparmål', icon: PiggyBank },
  { id: 'quick_note', label: 'Snabbnotis', icon: FileText },
];

/** Content-mallar — mappar till typ + stil, inom frozen MVP-types. */
const CONTENT_TEMPLATES: {
  id: string;
  label: string;
  icon: typeof Palmtree;
  type: WidgetType;
  stylePreset: UserWidgetStylePreset;
  titleHint: string;
  captionHint?: string;
}[] = [
  {
    id: 'semester',
    label: 'Semester',
    icon: Palmtree,
    type: 'countdown',
    stylePreset: 'gold_glass',
    titleHint: 'Semester',
    captionHint: 'Dagar till frihet',
  },
  {
    id: 'deadline',
    label: 'Deadline',
    icon: Target,
    type: 'countdown',
    stylePreset: 'focus',
    titleHint: 'Deadline',
    captionHint: 'Ett datum i taget',
  },
  {
    id: 'fokus',
    label: 'Fokus',
    icon: Sparkles,
    type: 'checklist',
    stylePreset: 'focus',
    titleHint: 'Fokuslista',
  },
  {
    id: 'firande',
    label: 'Firande',
    icon: PartyPopper,
    type: 'countdown',
    stylePreset: 'celebration',
    titleHint: 'Firande',
    captionHint: 'Något värt att fira',
  },
  {
    id: 'minimal',
    label: 'Minimal',
    icon: Minimize2,
    type: 'quick_note',
    stylePreset: 'minimal',
    titleHint: 'Notis',
  },
  {
    id: 'foto',
    label: 'Foto',
    icon: ImageIcon,
    type: 'quick_note',
    stylePreset: 'photo_dim',
    titleHint: 'Minnesbild',
    captionHint: 'Kort bildtext',
  },
];

type Props = {
  userId: string;
  nextOrder: number;
  capacity: WidgetBuildCapacity;
  onSave: (widget: Omit<UserWidget, 'userId' | 'ownerId' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
};

function defaultChecklistItems() {
  return [
    { id: `item-${Date.now()}-1`, text: 'Steg ett', done: false },
    { id: `item-${Date.now()}-2`, text: 'Steg två', done: false },
    { id: `item-${Date.now()}-3`, text: 'Steg tre', done: false },
  ];
}

export function WidgetModulerAddForm({
  userId,
  nextOrder,
  capacity,
  onSave,
  onCancel,
}: Props) {
  const [type, setType] = useState<WidgetType>('countdown');
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [targetDateTime, setTargetDateTime] = useState('');
  const [noteText, setNoteText] = useState('');
  const [caption, setCaption] = useState('');
  const [stylePreset, setStylePreset] = useState<UserWidgetStylePreset>('midnight');
  const [pinToHome, setPinToHome] = useState(false);
  const [experimentMode, setExperimentMode] = useState(false);
  const [savingsGoalId, setSavingsGoalId] = useState('');
  const [savingsGoals, setSavingsGoals] = useState<BudgetSavingsRow[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showExperiment = capacity.canExperiment && experimentMode;

  useEffect(() => {
    if (!capacity.canExperiment && experimentMode) {
      setExperimentMode(false);
    }
  }, [capacity.canExperiment, experimentMode]);

  useEffect(() => {
    if (type !== 'linked_savings') return;
    setLoadingGoals(true);
    getBudgetSavings(userId)
      .then((rows) => {
        setSavingsGoals(rows);
        setSavingsGoalId((prev) => prev || rows[0]?.id || '');
      })
      .catch(() => setSavingsGoals([]))
      .finally(() => setLoadingGoals(false));
  }, [type, userId]);

  const previewWidget = useMemo(() => {
    const shell = WIDGET_STYLE_PRESETS[stylePreset].defaultShell;
    const config: UserWidget['config'] = { shell };
    if (caption.trim()) config.caption = caption.trim().slice(0, 200);
    if (type === 'countdown') {
      if (targetDate) config.targetDate = targetDate;
      if (targetDateTime) config.targetDateTime = targetDateTime;
      if (!config.targetDate && !config.targetDateTime) {
        config.targetDate = new Date().toISOString().slice(0, 10);
      }
    } else if (type === 'checklist') {
      config.checklistItems = defaultChecklistItems();
    } else if (type === 'linked_savings') {
      config.savingsGoalId = savingsGoalId || 'preview';
    } else {
      config.noteText = noteText.trim() || 'Förhandsvisning';
    }
    return {
      id: 'preview',
      type,
      title: title.trim() || 'Förhandsvisning',
      config,
      stylePreset,
      slotId: pinToHome ? USER_WIDGET_HOME_SLOT_ID : null,
      pinnedToHome: pinToHome,
      status: 'active' as const,
    };
  }, [
    type,
    title,
    caption,
    targetDate,
    targetDateTime,
    noteText,
    savingsGoalId,
    stylePreset,
    pinToHome,
  ]);

  const applyTemplate = (templateId: string) => {
    const tpl = CONTENT_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    setType(tpl.type);
    setStylePreset(tpl.stylePreset);
    setTitle((prev) => prev || tpl.titleHint);
    if (tpl.captionHint) setCaption((prev) => prev || tpl.captionHint || '');
    setError(null);
  };

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Ge modulen ett namn.');
      return;
    }

    const shell = WIDGET_STYLE_PRESETS[stylePreset].defaultShell;
    let config: UserWidget['config'] = { shell };
    if (caption.trim()) config.caption = caption.trim().slice(0, 200);

    if (type === 'countdown') {
      if (!targetDate && !targetDateTime) {
        setError('Välj ett måldatum.');
        return;
      }
      if (targetDate) config.targetDate = targetDate;
      if (targetDateTime && showExperiment) config.targetDateTime = targetDateTime;
    } else if (type === 'checklist') {
      config = { ...config, checklistItems: defaultChecklistItems() };
    } else if (type === 'linked_savings') {
      if (!savingsGoalId) {
        setError('Välj ett sparmål i Ekonomi först.');
        return;
      }
      config = { ...config, savingsGoalId };
    } else {
      config = { ...config, noteText: noteText.trim() || '—' };
    }

    const slotId = capacity.canPinHome && pinToHome ? USER_WIDGET_HOME_SLOT_ID : null;

    setBusy(true);
    setError(null);
    try {
      await onSave({
        type,
        title: trimmedTitle,
        pinnedToHome: Boolean(slotId),
        order: nextOrder,
        schemaVersion: 1,
        stylePreset,
        slotId,
        status: 'active',
        config,
      });
      onCancel();
    } catch {
      setError('Kunde inte spara modulen. Försök igen.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="widget-moduler-add space-y-4" aria-label="Lägg till modul">
      {capacity.canUseTemplates ? (
        <div className="widget-moduler-add__templates" role="group" aria-label="Mallar">
          <p className={textStyles.eyebrow}>Mall</p>
          <div className="widget-moduler-add__template-grid">
            {CONTENT_TEMPLATES.map((tpl) => {
              const Icon = tpl.icon;
              return (
                <WidgetButton
                  key={tpl.id}
                  type="button"
                  variant="secondary"
                  className="widget-moduler-add__template min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  onClick={() => applyTemplate(tpl.id)}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
                  {tpl.label}
                </WidgetButton>
              );
            })}
          </div>
        </div>
      ) : null}

      {capacity.canExperiment ? (
        <label className="widget-moduler-add__toggle flex min-h-11 items-center gap-2">
          <input
            type="checkbox"
            checked={experimentMode}
            onChange={(e) => setExperimentMode(e.target.checked)}
            aria-label="Experimentera — visa alla typ- och stilval"
            className="h-11 w-11 shrink-0 accent-[var(--accent)]"
          />
          <FlaskConical className="h-3.5 w-3.5 text-accent" aria-hidden />
          <span className="text-xs text-text-muted">Experimentera — visa alla typ- och stilval</span>
        </label>
      ) : (
        <p className="rounded-lg border border-border/30 bg-surface-2/40 px-3 py-2 text-xs text-text-muted" role="status">
          Experimentera öppnas vid högre kapacitet (nivå {capacity.cognitiveLevel} nu).
        </p>
      )}

      <div className="widget-moduler-add__types" role="group" aria-label="Modultyp">
        {TYPE_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = type === opt.id;
          return (
            <WidgetButton
              key={opt.id}
              type="button"
              variant={active ? 'accent' : 'secondary'}
              className="widget-moduler-add__type min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              onClick={() => {
                setType(opt.id);
                setError(null);
              }}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
              {opt.label}
            </WidgetButton>
          );
        })}
      </div>

      {showExperiment ? (
        <div className="widget-moduler-add__presets" role="group" aria-label="Stilpreset">
          <p className={`mb-1.5 ${textStyles.eyebrow}`}>Stil</p>
          <div className="widget-moduler-add__preset-grid">
            {WIDGET_STYLE_PRESET_IDS.map((id) => {
              const preset = WIDGET_STYLE_PRESETS[id];
              const active = stylePreset === id;
              return (
                <WidgetButton
                  key={id}
                  type="button"
                  variant={active ? 'accent' : 'ghost'}
                  className="widget-moduler-add__preset min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  onClick={() => setStylePreset(id)}
                >
                  <span className="flex flex-col items-start gap-0.5 text-left">
                    <span>{preset.label_sv}</span>
                    <span className="text-[10px] font-normal text-text-muted">{preset.lead_sv}</span>
                  </span>
                </WidgetButton>
              );
            })}
          </div>
        </div>
      ) : null}

      <label htmlFor="widget-moduler-title" className="block space-y-1.5">
        <span className={textStyles.eyebrow}>Namn</span>
        <Input
          id="widget-moduler-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="t.ex. Semester, Veckolista…"
          className="min-h-11"
          maxLength={100}
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-[11px] uppercase tracking-widest text-text-muted">Bildtext (valfritt)</span>
        <Input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Kort rad under titeln…"
          maxLength={200}
          className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        />
      </label>

      {type === 'countdown' ? (
        <>
          <label className="block space-y-1.5">
            <span className="text-[11px] uppercase tracking-widest text-text-muted">Måldatum</span>
            <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" />
          </label>
          {showExperiment ? (
            <label className="block space-y-1.5">
              <span className="text-[11px] uppercase tracking-widest text-text-muted">
                Datum + tid (valfritt)
              </span>
              <Input
                type="datetime-local"
                value={targetDateTime}
                onChange={(e) => setTargetDateTime(e.target.value)}
                className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              />
            </label>
          ) : null}
        </>
      ) : null}

      {type === 'linked_savings' ? (
        <label className="block space-y-1.5">
          <span className="text-[11px] uppercase tracking-widest text-text-muted">Sparmål</span>
          {loadingGoals ? (
            <p className="flex items-center gap-1.5 text-xs text-text-muted">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Läser sparmål…
            </p>
          ) : savingsGoals.length === 0 ? (
            <p className="text-xs text-text-muted">Inga sparmål i Ekonomi ännu.</p>
          ) : (
            <select
              className="widget-moduler-add__select min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              value={savingsGoalId}
              onChange={(e) => setSavingsGoalId(e.target.value)}
            >
              {savingsGoals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          )}
        </label>
      ) : null}

      {type === 'quick_note' ? (
        <label className="block space-y-1.5">
          <span className="text-[11px] uppercase tracking-widest text-text-muted">Text</span>
          <TextArea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Kort påminnelse eller citat…"
            rows={3}
            className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          />
        </label>
      ) : null}

      {capacity.canPinHome ? (
        <label className="widget-moduler-add__toggle flex min-h-11 items-center gap-2">
          <input
            type="checkbox"
            checked={pinToHome}
            onChange={(e) => setPinToHome(e.target.checked)}
            aria-label="Fäst på Hem (under rutnätet)"
            className="h-11 w-11 shrink-0 accent-[var(--accent)]"
          />
          <Pin className="h-3.5 w-3.5 text-accent" aria-hidden />
          <span className="text-xs text-text-muted">Fäst på Hem (under rutnätet)</span>
        </label>
      ) : null}

      {showExperiment ? (
        <div className="widget-moduler-add__preview calm-card p-3" aria-label="Live-förhandsvisning">
          <p className={`mb-2 ${textStyles.eyebrow}`}>Förhandsvisning</p>
          <HomeWidgetRenderer widget={previewWidget} userId={userId} readOnly />
        </div>
      ) : null}

      {error ? <p className="text-xs text-danger" role="alert">{error}</p> : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <WidgetButton type="button" variant="accent" fullWidth disabled={busy} onClick={() => void handleSubmit()}>
          {busy ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Sparar…
            </>
          ) : (
            'Lägg till'
          )}
        </WidgetButton>
        <WidgetButton type="button" variant="ghost" fullWidth disabled={busy} onClick={onCancel}>
          Avbryt
        </WidgetButton>
      </div>
    </div>
  );
}
