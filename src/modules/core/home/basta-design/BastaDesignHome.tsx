import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Anchor,
  MessageSquare,
  PenLine,
  Plus,
  Check,
  Star,
  ChevronRight,
} from 'lucide-react';
import { saveCheckIn, getRecentCheckIns } from '@/core/firebase/firestore';
import { useStore } from '@/core/store';
import { usePlanningTasks } from '@/features/admin/planning/hooks/usePlanningTasks';
import { pickHomeDaySteps, homeStepLabel } from '@/features/admin/planning/utils/pickHomeDaySteps';
import { useJournalFlow } from '@/features/lifeJournal/diary/diary/hooks/useJournalFlow';
import { formatJournalDateKey, journalEntryDate } from '../executive/execJournalUtils';
import { useBastaDesignMotion } from './bastaDesignMotion';
import { BastaCard, BastaGoldDivider, BastaSectionLabel } from './bastaDesignParts';
import { HOME_SUPERHUB_ROUTES } from '../homeSuperhubRoutes';

type Props = {
  onCheckInSaved?: () => void;
};

/** Prod hem — Figma-ref layout med riktiga routes och data. */
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
      <motion.div className="basta-design__hero" {...staggerChild}>
        <img
          src="/design/home-hero-scenic.png"
          alt="Solnedgång över berg och vatten"
          className="basta-design__hero-img"
        />
        <div className="basta-design__hero-overlay" />
        <div className="basta-design__hero-content">
          <div className="basta-design__hero-main">
            <BastaSectionLabel>Dagens reflektion</BastaSectionLabel>
            {todayEntry ? (
              <p className="basta-design__hero-title" style={{ fontSize: '1rem', fontStyle: 'italic' }}>
                &ldquo;{todayEntry.text?.slice(0, 120)}&rdquo;
              </p>
            ) : (
              <>
                <h2 className="basta-design__hero-title">
                  Stanna upp.
                  <br />
                  <em>Känn efter.</em>
                </h2>
                <p className="basta-design__hero-lead">
                  En stund för dig själv,
                  <br />
                  är aldrig bortkastad.
                </p>
              </>
            )}
            <button
              type="button"
              className="basta-design__btn-gold"
              onClick={() => navigate('/hjartat?tab=reflektion&write=true')}
            >
              <PenLine size={12} />
              Skriv nu
            </button>
          </div>
          <aside className="basta-design__hero-aside">
            <p className="basta-design__hero-aside-label">Reflektionsfråga</p>
            <p>Du är den trygga hamnen — även när världen känns splittrad.</p>
            <BastaGoldDivider />
            <p className="basta-design__hero-aside-label">Vad vill din inre röst säga — en sak?</p>
            <p className="basta-design__hero-aside-foot">Skriv det första som dyker upp...</p>
          </aside>
        </div>
      </motion.div>

      <motion.div className="basta-design__grid-2" {...staggerChild}>
        <BastaCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Target size={14} color="var(--bd-accent)" />
            <BastaSectionLabel>Dagens fokus</BastaSectionLabel>
          </div>
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
            Lär känna <ChevronRight size={12} />
          </button>
        </BastaCard>

        <BastaCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <MessageSquare size={14} color="var(--bd-accent)" />
            <BastaSectionLabel>Fråga livscoachen</BastaSectionLabel>
          </div>
          <p className="basta-design__card-meta">Har du någon fråga du vill ställa?</p>
          <div className="basta-design__coach-bubble">Hur har det gått sedan senast veckan?</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="basta-design__btn-gold" onClick={() => navigate('/vardagen?tab=mabra')}>
              Fråga
            </button>
            <button type="button" className="basta-design__btn-ghost" onClick={() => navigate('/vardagen')}>
              Utforska
            </button>
          </div>
        </BastaCard>
      </motion.div>

      <motion.div {...staggerChild}>
        <BastaCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Anchor size={14} color="var(--bd-accent)" />
              <BastaSectionLabel>Dagens ankar</BastaSectionLabel>
            </div>
            <Star size={14} color="var(--bd-accent)" />
          </div>
          {editAnchor ? (
            <>
              <textarea
                className="basta-design__textarea"
                value={anchor}
                onChange={(e) => setAnchor(e.target.value)}
                placeholder="Din ankarmening kan skrivas här..."
              />
              <button
                type="button"
                className="basta-design__btn-gold"
                style={{ marginTop: '0.75rem' }}
                disabled={saving}
                onClick={() => void handleAnchorSave()}
              >
                {saving ? 'Sparar …' : 'Spara ankar'}
              </button>
            </>
          ) : (
            <p
              className="basta-design__card-meta"
              style={{ fontFamily: 'var(--bd-font-serif)', fontStyle: 'italic', cursor: 'pointer' }}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Target size={14} color="var(--bd-accent)" />
            <BastaSectionLabel>Planering</BastaSectionLabel>
          </div>
          <div className="basta-design__tabs-row">
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
            <span style={{ marginLeft: 'auto', fontSize: '0.625rem', color: 'var(--bd-text-muted)' }}>
              {new Date().toLocaleDateString('sv-SE', { weekday: 'long' })}
            </span>
          </div>
          <BastaSectionLabel>Dagens uppgifter</BastaSectionLabel>
          {tasksLoading ? (
            <p className="basta-design__card-meta">Laddar …</p>
          ) : daySteps.length === 0 ? (
            <p className="basta-design__card-meta">Inga öppna steg idag.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {daySteps.map((task) => {
                const done = task.status === 'done';
                return (
                  <div key={task.id} className="basta-design__check-row">
                    <div
                      className={`basta-design__checkbox ${done ? 'basta-design__checkbox--done' : 'basta-design__checkbox--open'}`}
                    >
                      {done ? <Check size={10} color="var(--bd-accent-fg)" /> : null}
                    </div>
                    <span className={`basta-design__task-text ${done ? 'basta-design__task-text--done' : ''}`}>
                      {homeStepLabel(task)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          <button type="button" className="basta-design__link" style={{ marginTop: '0.75rem' }} onClick={() => navigate('/planering')}>
            <Plus size={10} /> Lägg till uppgift
          </button>
        </BastaCard>
      </motion.div>

      {notes.length > 0 ? (
        <motion.div {...staggerChild}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <BastaSectionLabel>Tidigare anteckningar</BastaSectionLabel>
            <button type="button" className="basta-design__link" style={{ fontSize: '0.625rem' }} onClick={() => navigate('/hjartat?tab=reflektion')}>
              Visa alla →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {notes.map((n) => (
              <BastaCard key={n.id} className="basta-design__note-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                  <span className="basta-design__badge">{n.type}</span>
                  <span className="basta-design__task-text" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {n.title}
                  </span>
                </div>
                <span style={{ fontSize: '0.625rem', color: 'var(--bd-text-muted)', flexShrink: 0 }}>{n.date}</span>
              </BastaCard>
            ))}
          </div>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
