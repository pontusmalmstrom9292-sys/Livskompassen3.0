import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Anchor, Edit2, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { saveCheckIn, getRecentCheckIns } from '@/core/firebase/firestore';
import { useStore } from '@/core/store';
import { HOME_SUPERHUB_ROUTES } from '../../homeSuperhubRoutes';

type Props = {
  onSaved?: () => void;
};

export function ExecutiveAnkareCard({ onSaved }: Props) {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const [anchor, setAnchor] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    getRecentCheckIns(user.uid, 20)
      .then((history) => {
        if (!active) return;
        const found = history.find((c) => c.questionId === 'home_executive_anchor');
        if (found?.taskNote) {
          setAnchor(found.taskNote);
          setIsEditing(false);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [user]);

  const handleSave = async () => {
    const text = anchor.trim();
    if (!user) {
      navigate(HOME_SUPERHUB_ROUTES.hjartatReflektion);
      return;
    }
    if (text.length < 2) {
      setError('Skriv minst ett par ord.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await saveCheckIn(user.uid, {
        questionId: 'home_executive_anchor',
        questionText: 'Dagens ankare',
        optionSelected: 'intention',
        taskCategory: 'morning',
        taskNote: text,
      });
      setIsEditing(false);
      onSaved?.();
    } catch {
      setError('Kunde inte spara.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="exec-home-card exec-home-card--ankare">
      <header className="exec-home-card__head">
        <Anchor className="h-4 w-4 text-accent" strokeWidth={1.5} />
        <p className="exec-home-label mb-0">DAGENS ANKARE</p>
        {!isEditing && anchor.trim() ? (
          <button
            type="button"
            className="ml-auto text-text-dim hover:text-accent"
            aria-label="Redigera ankare"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
        ) : (
          <Star className="ml-auto h-3.5 w-3.5 fill-accent text-accent" />
        )}
      </header>

      {isEditing ? (
        <div className="mt-3 space-y-2">
          <textarea
            className="exec-home-input w-full resize-none"
            rows={2}
            placeholder="Ett mikrosteg räcker."
            value={anchor}
            onChange={(e) => setAnchor(e.target.value)}
          />
          <button
            type="button"
            className="exec-home-btn exec-home-btn--primary"
            disabled={saving}
            onClick={() => void handleSave()}
          >
            {saving ? 'Sparar…' : 'Spara ankare'}
          </button>
          {error ? <p className="text-xs text-danger">{error}</p> : null}
        </div>
      ) : (
        <button
          type="button"
          className={clsx('mt-3 w-full text-left')}
          onClick={() => setIsEditing(true)}
        >
          <p className="font-display-serif text-base tracking-wide text-accent-light">
            {anchor.trim() || 'Ett mikrosteg räcker.'}
          </p>
          <p className="mt-1 text-[10px] text-text-dim">Inte hela dagen — bara det viktigaste nu.</p>
        </button>
      )}
    </article>
  );
}
