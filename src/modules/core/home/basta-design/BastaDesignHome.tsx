import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, Anchor, MessageSquare, Plus, Check, Star, ChevronRight } from 'lucide-react';
import { saveCheckIn, getRecentCheckIns } from '@/core/firebase/firestore';
import { useStore } from '@/core/store';
import { usePlanningTasks } from '@/features/admin/planning/hooks/usePlanningTasks';
import { pickHomeDaySteps, homeStepLabel } from '@/features/admin/planning/utils/pickHomeDaySteps';
import { useJournalFlow } from '@/features/lifeJournal/diary/diary/hooks/useJournalFlow';
import { formatJournalDateKey, journalEntryDate } from '../executive/execJournalUtils';
import { useBastaDesignMotion } from './bastaDesignMotion';
import {
  BastaButton,
  BastaCard,
  BastaCardHeader,
  BastaSectionLabel,
} from './bastaDesignParts';
import { BastaDesignHero } from './BastaDesignHero';
import { HOME_SUPERHUB_ROUTES } from '../homeSuperhubRoutes';

type Props = {
  onCheckInSaved?: () => void;
};

/** Prod hem — Figma Make «bästa-design» layout med riktiga routes och data. */
export function BastaDesignHome({ onCheckInSaved }: Props) {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const { reduced, staggerContainer, staggerItem } = useBastaDesignMotion();
  const { tasks, loading: tasksLoading } = usePlanningTasks();
  const { entries, refreshEntries } = useJournalFlow({ userId: user?.uid });

  const [focusTab, setFocusTab] = useState('barnfokus');
  const [planTab, setPlanTab] = useState('handling');
  const [anchor, setAnchor] = useState('');
  const [editAnchor, setEditAnchor] = useState(true);
  const [saving, setSaving] = useState(false);

  const focusTabs = [
    { id: 'barnfokus', label: 'Barnfokus', to: '/familjen?tab=barnfokus' },
    { id: 'ky-stund', label: 'Ky stund', to: '/vardagen?tab=mabra' },
    { id: 'fysiologi', label: 'Fysiologi', to: '/vardagen?tab=mabra' },
    { id: 'meg', label: 'Meg', to: '/hjartat?tab=reflektion' },
  ];

  const planTabs = [
    { id: 'handling', label: 'Handling', to: '/planering' },
    { id: 'projekt', label: 'Projekt', to: '/projekt' },
    { id: 'habig', label: 'Habig', to: '/planering' },
    { id: 'makro', label: 'Makro', to: '/planering' },
  ];

  const daySteps = useMemo(() => pickHomeDaySteps(tasks, 3), [tasks]);

  const notes = useMemo(
    () =>
      entries.slice(0, 3).map((e) => ({
        id: e.id,
        date: journalEntryDate(e).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' }),
        type: e.mood ? e.mood.slice(0, 5) : 'Ant',
        title: e.text?.slice(0, 48) || 'Anteckning',
      })),
    [entries],
  );

  useEffect(() => {
    if (!user) return;
    let active = true;
    getRecentCheckIns(user.uid, 20)
      .then((history) => {
        if (!active) return;
        const found = history.find((c) => c.questionId === 'home_basta_design_anchor');
        if (found?.taskNote) {
          setAnchor(found.taskNote);
          setEditAnchor(false);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    refreshEntries().catch(() => undefined);
  }, [user, refreshEntries]);

  const handleAnchorSave = async () => {
    const text = anchor.trim();
    if (!user) {
      navigate(HOME_SUPERHUB_ROUTES.hjartatReflektion);
      return;
    }
    if (text.length < 2) return;
    setSaving(true);
    try {
      await saveCheckIn(user.uid, {
        questionId: 'home_basta_design_anchor',
        questionText: 'Dagens ankare',
        optionSelected: 'intention',
        taskCategory: 'morning',
        taskNote: text,
      });
      setEditAnchor(false);
      onCheckInSaved?.();
    } finally {
      setSaving(false);
    }
  };

  const todayKey = formatJournalDateKey(new Date());
  const todayEntry = entries.find((e) => formatJournalDateKey(journalEntryDate(e)) === todayKey);

  const staggerRoot = reduced
    ? {}
    : { variants: staggerContainer, initial: 'hidden' as const, animate: 'visible' as const };
  const staggerChild = reduced ? {} : { variants: staggerItem };

  return (
    <motion.div className="basta-design__main-inner basta-design__main-inner--prod" {...staggerRoot}>
      <motion.div {...staggerChild}>
        <BastaDesignHero
          todayEntry={todayEntry ? { text: todayEntry.text } : null}
          onWrite={() => navigate('/hjartat?tab=reflektion&write=true')}
        />
      </motion.div>

      <motion.div className="basta-design__grid-2" {...staggerChild}>
        <BastaCard>
          <BastaCardHeader icon={<Target size={14} />} label="Dagens fokus" />
          <h3 className="basta-design__card-title">Barnfokus</h3>
          <p className="basta-design__card-meta">Dagens fokus — ett steg i taget</p>
          <div className="basta-design__tabs-row">
            {focusTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setFocusTab(t.id);
                  navigate(t.to);
                }}
                className={`basta-design__tab ${focusTab === t.id ? 'basta-design__tab--on' : 'basta-design__tab--off'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button type="button" className="basta-design__link" onClick={() => navigate('/familjen?tab=barnfokus')}>
            Lär känna <ChevronRight size={12} aria-hidden />
          </button>
        </BastaCard>

        <BastaCard>
          <BastaCardHeader icon={<MessageSquare size={14} />} label="Fråga livscoachen" />
          <p className="basta-design__card-meta">Har du någon fråga du vill ställa?</p>
          <div className="basta-design__coach-bubble">Hur har det gått sedan senast veckan?</div>
          <div className="basta-design__btn-row">
            <BastaButton type="button" onClick={() => navigate('/vardagen?tab=mabra')}>
              Fråga
            </BastaButton>
            <BastaButton type="button" variant="ghost" onClick={() => navigate('/vardagen')}>
              Utforska
            </BastaButton>
          </div>
        </BastaCard>
      </motion.div>

      <motion.div {...staggerChild}>
        <BastaCard>
          <BastaCardHeader
            icon={<Anchor size={14} />}
            label="Dagens ankar"
            trailing={<Star size={14} className="basta-design__card-header-icon" aria-hidden />}
          />
          {editAnchor ? (
            <>
              <textarea
                className="basta-design__textarea"
                value={anchor}
                onChange={(e) => setAnchor(e.target.value)}
                placeholder="Din ankarmening kan skrivas här..."
                aria-label="Dagens ankarmening"
              />
              <BastaButton
                type="button"
                className="basta-design__btn-gold--spaced"
                disabled={saving}
                onClick={() => void handleAnchorSave()}
              >
                {saving ? 'Sparar …' : 'Spara ankar'}
              </BastaButton>
            </>
          ) : (
            <p
              className="basta-design__anchor-display"
              onClick={() => setEditAnchor(true)}
              onKeyDown={(e) => e.key === 'Enter' && setEditAnchor(true)}
              role="button"
              tabIndex={0}
            >
              {anchor.trim() || 'Ett mikrosteg räcker.'}
            </p>
          )}
        </BastaCard>
      </motion.div>

      <motion.div {...staggerChild}>
        <BastaCard>
          <BastaCardHeader icon={<Target size={14} />} label="Planering" />
          <div className="basta-design__tabs-row basta-design__tabs-row--plan">
            {planTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setPlanTab(t.id);
                  navigate(t.to);
                }}
                className={`basta-design__tab ${planTab === t.id ? 'basta-design__tab--on' : 'basta-design__tab--off'}`}
              >
                {t.label.toUpperCase()}
              </button>
            ))}
            <span className="basta-design__plan-weekday">
              {new Date().toLocaleDateString('sv-SE', { weekday: 'long' })}
            </span>
          </div>
          <BastaSectionLabel>Dagens uppgifter</BastaSectionLabel>
          {tasksLoading ? (
            <p className="basta-design__card-meta">Laddar …</p>
          ) : daySteps.length === 0 ? (
            <p className="basta-design__card-meta">Inga öppna steg idag.</p>
          ) : (
            <div className="basta-design__task-list">
              {daySteps.map((task) => {
                const done = task.status === 'done';
                return (
                  <div key={task.id} className="basta-design__check-row">
                    <div
                      className={`basta-design__checkbox ${done ? 'basta-design__checkbox--done' : 'basta-design__checkbox--open'}`}
                    >
                      {done ? <Check size={10} color="var(--bd-accent-fg)" aria-hidden /> : null}
                    </div>
                    <span className={`basta-design__task-text ${done ? 'basta-design__task-text--done' : ''}`}>
                      {homeStepLabel(task)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          <button type="button" className="basta-design__link basta-design__link--spaced" onClick={() => navigate('/planering')}>
            <Plus size={10} aria-hidden /> Lägg till uppgift
          </button>
        </BastaCard>
      </motion.div>

      <motion.div {...staggerChild}>
        <div className="basta-design__notes-header">
          <BastaSectionLabel>Tidigare anteckningar</BastaSectionLabel>
          <button type="button" className="basta-design__link basta-design__link--sm" onClick={() => navigate('/hjartat?tab=reflektion')}>
            Visa alla →
          </button>
        </div>
        {notes.length === 0 ? (
          <BastaCard>
            <p className="basta-design__card-meta">Inga anteckningar ännu.</p>
            <BastaButton type="button" onClick={() => navigate('/hjartat?tab=reflektion&write=true')}>
              Skriv första raden
            </BastaButton>
          </BastaCard>
        ) : (
          <div className="basta-design__notes-list">
            {notes.map((n) => (
              <BastaCard key={n.id} className="basta-design__note-row">
                <div className="basta-design__note-main">
                  <span className="basta-design__badge">{n.type}</span>
                  <span className="basta-design__note-title">{n.title}</span>
                </div>
                <span className="basta-design__note-date">{n.date}</span>
              </BastaCard>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
