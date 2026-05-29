import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
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
  if (exercises.length === 0) {
    return (
      <p className="text-xs text-text-dim">Läs kapitlet — övningar finns i andra kapitel eller via länkar nedan.</p>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {exercises.map((ex) => (
        <button
          key={ex.bankId}
          type="button"
          onClick={() => (ex.kind === 'reflection' ? onOpenReflection(ex.bankId) : onOpenPlay(ex.bankId))}
          className="btn-pill--ghost text-xs"
        >
          {ex.kind === 'reflection' ? 'Frågekort' : 'Mikrolek'} · {ex.bankId}
        </button>
      ))}
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
      <ul className="space-y-2">
        {CURRICULUMS.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => setSelectedId(c.id)}
              className="flex w-full items-center gap-3 rounded-xl border border-border-strong bg-surface/20 px-4 py-3 text-left transition hover:border-accent/30"
            >
              <BookOpen className="h-5 w-5 shrink-0 text-accent/80" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-text">{c.title}</span>
                <span className="block text-[10px] uppercase tracking-wider text-text-dim">
                  {c.chapters.length} kapitel
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-text-dim" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex items-center gap-2 text-[10px] text-text-dim">
        <Sparkles className="h-3 w-3" aria-hidden />
        FACT från Kunskap-seed — övningar från MåBra-bank (U6).
      </p>
    </BentoCard>
  );
}
