import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Anchor, Edit2, Star } from 'lucide-react';
import { Button, TextArea } from '@/design-system';
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
    <article className="calm-card exec-home-card exec-home-card--ankare">
      <header className="exec-home-card__head">
        <Anchor className="h-4 w-4 text-accent" strokeWidth={1.5} />
        <p className="exec-home-label mb-0">DAGENS ANKARE</p>
        {!isEditing && anchor.trim() ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ml-auto inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-text-muted transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
            aria-label="Redigera ankare"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Star className="ml-auto h-3.5 w-3.5 fill-accent text-accent" aria-hidden />
        )}
      </header>
      <p className="mt-1 text-[10px] text-text-muted">Inte hela dagen — bara det viktigaste nu.</p>

      {isEditing ? (
        <div className="mt-3 space-y-2">
          <TextArea
            className="exec-home-input min-h-11 w-full resize-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
            rows={2}
            placeholder="Ett mikrosteg räcker."
            value={anchor}
            onChange={(e) => setAnchor(e.target.value)}
            aria-label="Dagens ankare"
          />
          <Button
            type="button"
            variant="accent"
            className="exec-home-btn exec-home-btn--primary min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            disabled={saving}
            onClick={() => void handleSave()}
          >
            {saving ? 'Sparar…' : 'Spara ankare'}
          </Button>
          {error ? (
            <p className="text-xs text-danger" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      ) : (
        <Button
          type="button"
          variant="ghost"
          className="mt-3 min-h-11 w-full rounded-lg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
          onClick={() => setIsEditing(true)}
        >
          <p className="font-display-serif text-base tracking-wide text-accent-light">
            {anchor.trim() || 'Ett mikrosteg räcker.'}
          </p>
          <p className="mt-1 text-[10px] text-text-muted">Inte hela dagen — bara det viktigaste nu.</p>
        </Button>
      )}
    </article>
  );
}
