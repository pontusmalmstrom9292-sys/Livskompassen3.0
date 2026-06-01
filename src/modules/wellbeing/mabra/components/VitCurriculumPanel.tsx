import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { CURRICULUMS, type VitCurriculum, type CurriculumExercise } from '../content/curriculumCatalog';

type Props = {
  onOpenReflection: (bankId: string) => void;
  onOpenPlay: (bankId: string) => void;
};

function ChapterExerciseButtons({
  exercises,
  onOpenReflection,
  onOpenPlay,
}: {
  exercises: readonly CurriculumExercise[];
  onOpenReflection: (bankId: string) => void;
  onOpenPlay: (bankId: string) => void;
}) {
  const [pickedId, setPickedId] = useState('');

  if (exercises.length === 0) {
    return (
      <p className="text-xs text-text-dim">Läs kapitlet — övningar finns i andra kapitel eller via länkar nedan.</p>
    );
  }

  const picked = exercises.find((ex) => ex.bankId === pickedId);

  return (
    <div className="space-y-2">
      <label className="block text-xs text-text-muted">
        Övning
        <select
          className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm"
          value={pickedId}
          onChange={(e) => setPickedId(e.target.value)}
          aria-label="Välj övning"
        >
          <option value="">Välj övning…</option>
          {exercises.map((ex) => (
            <option key={ex.bankId} value={ex.bankId}>
              {ex.kind === 'reflection' ? 'Frågekort' : 'Mikrolek'} · {ex.bankId}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        disabled={!picked}
        className="btn-pill--ghost w-full text-xs disabled:opacity-40"
        onClick={() => {
          if (!picked) return;
          if (picked.kind === 'reflection') onOpenReflection(picked.bankId);
          else onOpenPlay(picked.bankId);
        }}
      >
        Öppna övning
      </button>
    </div>
  );
}

function CurriculumDetail({
  curriculum,
  onBack,
  onOpenReflection,
  onOpenPlay,
}: {
  curriculum: VitCurriculum;
  onBack: () => void;
  onOpenReflection: (bankId: string) => void;
  onOpenPlay: (bankId: string) => void;
}) {
  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="text-xs text-accent hover:underline">
        ← Alla kurser
      </button>
      <BentoCard title={curriculum.title} description={`Våg ${curriculum.wave} · ${curriculum.theme}`}>
        <div className="space-y-6">
          {curriculum.chapters.map((ch, i) => (
            <article key={ch.kunskapFactId} className="rounded-xl border border-border-strong bg-surface/30 p-4">
              <p className="text-[10px] uppercase tracking-widest text-text-dim">
                Kapitel {i + 1} · {ch.kunskapFactId}
              </p>
              <h3 className="mt-1 font-medium text-text">{ch.title}</h3>
              <p className="mt-2 text-sm font-medium text-accent/90">{ch.factTitleSv}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{ch.factSummarySv}</p>
              <p className="mt-2 text-[10px] text-text-dim">Källa: {ch.citationHint}</p>
              <div className="mt-4">
                <ChapterExerciseButtons
                  exercises={ch.exercises}
                  onOpenReflection={onOpenReflection}
                  onOpenPlay={onOpenPlay}
                />
              </div>
            </article>
          ))}
          {curriculum.broLinks && curriculum.broLinks.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-border-strong pt-4">
              {curriculum.broLinks.map((link) => (
                <Link key={link.route} to={link.route} className="btn-pill--ghost text-xs">
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </BentoCard>
    </div>
  );
}

export function VitCurriculumPanel({ onOpenReflection, onOpenPlay }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState('');
  const selected = selectedId ? CURRICULUMS.find((c) => c.id === selectedId) : null;

  if (selected) {
    return (
      <CurriculumDetail
        curriculum={selected}
        onBack={() => setSelectedId(null)}
        onOpenReflection={onOpenReflection}
        onOpenPlay={onOpenPlay}
      />
    );
  }

  return (
    <BentoCard
      title="Dina kurser"
      description="Läs kort FACT-kapitel — gör kopplad övning. Ingen streak."
    >
      <label className="block text-xs text-text-muted">
        Kurs
        <select
          className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm"
          value={pendingId}
          onChange={(e) => setPendingId(e.target.value)}
          aria-label="Välj kurs"
        >
          <option value="">Välj kurs…</option>
          {CURRICULUMS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title} ({c.chapters.length} kapitel)
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        disabled={!pendingId}
        className="btn-pill--secondary mt-3 w-full text-sm disabled:opacity-40"
        onClick={() => setSelectedId(pendingId)}
      >
        Öppna kurs
      </button>
      <p className="mt-3 flex items-center gap-2 text-[10px] text-text-dim">
        <Sparkles className="h-3 w-3" aria-hidden />
        FACT från Kunskap-seed — övningar från MåBra-bank (U6).
      </p>
    </BentoCard>
  );
}
