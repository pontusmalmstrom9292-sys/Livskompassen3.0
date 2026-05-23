import { useRef, useState } from 'react';
import { FileUp, Loader2 } from 'lucide-react';
import { ingestKampsparEntry } from '../api/kampsparService';
import { useStore } from '../../core/store';

const TEXT_TYPES = new Set([
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
]);

export type KunskapsvalvUploadedDoc = {
  docId: string;
  title: string;
  uploadedAt: string;
};

type Props = {
  sourceLabel?: string;
  onIngested?: (doc: KunskapsvalvUploadedDoc) => void;
};

/** Laddar textdokument till Minne (kampspar) — samma silo som Kunskapsvalvet. */
export function KunskapsvalvFileIngest({ sourceLabel = 'filuppladdning', onIngested }: Props) {
  const user = useStore((s) => s.user);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<KunskapsvalvUploadedDoc | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length || !user) return;
    const file = files[0]!;
    setLoading(true);
    setError(null);

    try {
      let content = '';
      if (TEXT_TYPES.has(file.type) || /\.(txt|md|csv|json)$/i.test(file.name)) {
        content = await file.text();
      } else if (file.type === 'application/pdf') {
        throw new Error(
          'PDF analyseras via Valv-bevis (WORM) eller Drive. Här: exportera text till .txt eller klistra in i Livslogg.',
        );
      } else {
        throw new Error('Stödda format: .txt, .md, .csv, .json');
      }

      const trimmed = content.trim();
      if (trimmed.length < 12) {
        throw new Error('Filen är tom eller för kort för indexering.');
      }

      const result = await ingestKampsparEntry({
        title: file.name,
        content: trimmed.slice(0, 48_000),
        category: 'dokument',
        entryType: 'fakta',
        tags: ['kunskap_upload', sourceLabel, file.name.toLowerCase()],
        source: 'kunskap_fil',
      });

      const doc: KunskapsvalvUploadedDoc = {
        docId: result.docId,
        title: file.name,
        uploadedAt: new Date().toISOString(),
      };
      setLastDoc(doc);
      onIngested?.(doc);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Uppladdning misslyckades.');
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  if (!user) {
    return <p className="text-xs text-text-dim">Logga in för att ladda upp till Kunskapsvalvet.</p>;
  }

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface/40 p-4">
      <p className="text-[10px] uppercase tracking-widest text-text-dim">
        Till Kunskapsvalvet (Minne)
      </p>
      <p className="mt-1 text-xs text-text-muted">
        Var du än laddar upp hamnar texten i samma kunskapsbank — sökbar i hela hubben.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.md,.csv,.json,text/plain,text/markdown,text/csv,application/json"
        className="sr-only"
        onChange={(e) => void handleFiles(e.target.files)}
      />
      <button
        type="button"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="btn-pill--secondary mt-3 inline-flex items-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
        Välj dokument
      </button>
      {lastDoc && (
        <p className="mt-2 text-xs text-accent">
          Indexerat: {lastDoc.title} · id {lastDoc.docId.slice(0, 8)}…
        </p>
      )}
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
