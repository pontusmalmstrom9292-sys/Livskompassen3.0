import { useRef, useState } from 'react';
import { FileUp, Loader2 } from 'lucide-react';
import { Button } from '@/design-system';
import { ingestKampsparEntry } from '../api/kampsparService';
import {
  fileToBase64,
  ingestKnowledgeDocument,
} from '../api/ingestKnowledgeDocumentService';
import { useStore } from '@/core/store';

const TEXT_TYPES = new Set([
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
]);

const BINARY_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
]);

export type KunskapsvalvUploadedDoc = {
  docId: string;
  title: string;
  uploadedAt: string;
  analyzed?: boolean;
};

type Props = {
  sourceLabel?: string;
  onIngested?: (doc: KunskapsvalvUploadedDoc) => void;
  variant?: 'default' | 'familjen';
};

function resolveMime(file: File): string {
  if (file.type) return file.type;
  const lower = file.name.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.md')) return 'text/markdown';
  if (lower.endsWith('.csv')) return 'text/csv';
  if (lower.endsWith('.json')) return 'application/json';
  return 'text/plain';
}

/** Laddar dokument till Minne (kampspar) — PDF/bild via Gemini, text direkt. */
export function KunskapsvalvFileIngest({
  sourceLabel = 'filuppladdning',
  onIngested,
  variant = 'default',
}: Props) {
  const user = useStore((s) => s.user);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<KunskapsvalvUploadedDoc | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length || !user) return;
    const file = files[0]!;
    const mimeType = resolveMime(file);
    setLoading(true);
    setError(null);

    try {
      const useBinaryPipeline = BINARY_TYPES.has(mimeType);
      const useTextPipeline =
        TEXT_TYPES.has(mimeType) || /\.(txt|md|csv|json)$/i.test(file.name);

      if (!useBinaryPipeline && !useTextPipeline) {
        throw new Error('Stödda format: .pdf, .txt, .md, .csv, .json, .png, .jpg, .webp');
      }

      if (useBinaryPipeline) {
        const base64 = await fileToBase64(file);
        const result = await ingestKnowledgeDocument({
          fileName: file.name,
          mimeType,
          base64,
          sourceLabel,
        });
        const doc: KunskapsvalvUploadedDoc = {
          docId: result.docId,
          title: file.name,
          uploadedAt: new Date().toISOString(),
          analyzed: result.analyzed,
        };
        setLastDoc(doc);
        onIngested?.(doc);
        return;
      }

      const content = await file.text();
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
        analyzed: false,
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

  const shellClass =
    variant === 'familjen'
      ? 'familjen-upload rounded-2xl border border-emerald-500/20 bg-surface-2/80 p-4'
      : 'rounded-2xl border border-border-subtle bg-surface/40 p-4';

  if (!user) {
    return <p className="text-xs text-text-muted">Logga in för att ladda upp till Kunskapsvalvet.</p>;
  }

  return (
    <div className={shellClass}>
      <p className="text-[10px] uppercase tracking-widest text-text-muted">
        Till Kunskapsvalvet (Minne)
      </p>
      <p className="mt-1 text-xs text-text-muted">
        PDF, bilder och text indexeras till samma bank — sökbar i Kunskapshub överallt.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,.md,.csv,.json,.png,.jpg,.jpeg,.webp,application/pdf,image/*,text/*"
        className="sr-only"
        onChange={(e) => void handleFiles(e.target.files)}
      />
      <Button
        type="button"
        variant="secondary"
        className="mt-3 inline-flex items-center gap-2 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
        {loading ? 'Analyserar…' : 'Välj PDF, bild eller text'}
      </Button>
      {lastDoc && (
        <p className="mt-2 text-xs text-accent">
          Indexerat: {lastDoc.title}
          {lastDoc.analyzed ? ' (AI-extraherad)' : ''} · id {lastDoc.docId.slice(0, 8)}…
        </p>
      )}
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
