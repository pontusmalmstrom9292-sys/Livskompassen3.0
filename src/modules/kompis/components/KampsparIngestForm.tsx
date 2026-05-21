import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { ingestKampsparEntry } from '../api/kampsparService';

type Props = {
  onSaved?: () => void;
};

export function KampsparIngestForm({ onSaved }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await ingestKampsparEntry({
        title: title.trim(),
        content: content.trim(),
        category: category.trim() || undefined,
        eventDate: eventDate || undefined,
        source: 'manual',
      });
      setTitle('');
      setContent('');
      setCategory('');
      setEventDate('');
      setSuccess(true);
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte spara.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BentoCard title="Lägg till i Minne" description="Ett steg — titel och text räcker">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel (t.ex. Skolmeeting mars)"
          className="input-glass"
          disabled={loading}
          maxLength={200}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Fakta, milstolpar, utmaningar, rutiner..."
          rows={4}
          className="input-glass"
          disabled={loading}
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Kategori (valfritt)"
            className="input-glass"
            disabled={loading}
          />
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="input-glass"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !title.trim() || !content.trim()}
          className="btn-pill--success flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Spara i Minne
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      {success && (
        <p className="mt-3 text-sm text-success">Sparat. Posten syns i Tidshjulet och i Kunskapsvalvet.</p>
      )}
    </BentoCard>
  );
}
