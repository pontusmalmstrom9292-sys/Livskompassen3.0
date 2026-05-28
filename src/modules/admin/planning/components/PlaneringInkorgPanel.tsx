import { useState } from 'react';
import { Mail } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { usePlanningTasks } from '../hooks/usePlanningTasks';

/** P1 — klistra in e-post → skapa uppgift (Gmail Fas 2). */
export function PlaneringInkorgPanel() {
  const { user, addTask, error, setError } = usePlanningTasks();
  const [paste, setPaste] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCreate = async () => {
    const text = paste.trim();
    if (!text || !user) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const firstLine = text.split('\n')[0]?.slice(0, 120) ?? 'Inkorg';
      await addTask({
        title: firstLine,
        status: 'todo',
        source: 'email',
        summary: text.slice(0, 500),
      });
      setPaste('');
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte skapa uppgift.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <BentoCard
      title="Inkorg"
      description="Klistra in mejl — blir en uppgift i Handling"
      icon={<Mail className="h-4 w-4" />}
    >
      <textarea
        value={paste}
        onChange={(e) => setPaste(e.target.value)}
        placeholder="Klistra in ämne och text från mejl…"
        rows={5}
        className="input-glass w-full text-sm"
        disabled={!user || saving}
      />
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      <button
        type="button"
        disabled={!user || saving || !paste.trim()}
        onClick={() => void handleCreate()}
        className="btn-pill--accent mt-3 w-full disabled:opacity-50"
      >
        Skapa uppgift i Att göra
      </button>
      {saved && (
        <p className="mt-2 text-xs text-success">Sparat — se Handling-fliken.</p>
      )}
      <p className="mt-3 text-xs text-text-dim">
        Ex-brus och konflikt → Hamn (BIFF). Automatiska regler (`planning_email_rules`) kommer i
        Fas 2.
      </p>
    </BentoCard>
  );
}
