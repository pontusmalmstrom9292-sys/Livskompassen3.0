import { useState } from 'react';
import { callKnowledgeVault, type KnowledgeVaultCitation } from '../api/knowledgeVaultService';
import { useStore } from '../../core/store';
import { Lock } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';

export function KnowledgeVaultChat() {
  const [inputText, setInputText] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [citations, setCitations] = useState<KnowledgeVaultCitation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const authLoading = useStore((s) => s.system.isLoading);
  const setKompisAura = useStore((s) => s.setKompisAura);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Du måste vara inloggad för att använda Kunskapsvalvet.');
      return;
    }
    if (!inputText.trim()) {
      setError('Vänligen skriv in en fråga.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiResponse(null);
    setCitations([]);
    setKompisAura(true);

    try {
      const result = await callKnowledgeVault(inputText);
      setAiResponse(result.answer);
      setCitations(result.citations ?? []);
      setInputText('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ett okänt fel inträffade.';
      if (message.includes('unauthenticated') || message.includes('Autentisering')) {
        setError('Inloggning krävs. Kontrollera Firebase Auth och att functions är deployade.');
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
      setKompisAura(false);
    }
  };

  if (authLoading) {
    return <p className="text-sm text-text-dim">Ansluter...</p>;
  }

  if (!isAuthenticated) {
    return (
      <BentoCard>
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-accent" />
          <p className="text-sm text-text-muted">
            Logga in via Firebase Auth för att ställa frågor till Kunskapsvalvet.
          </p>
        </div>
      </BentoCard>
    );
  }

  return (
    <BentoCard title="Kunskapsvalvet" description="Frågor mot ditt Kampspår — med källhänvisningar">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ställ din fråga mot Kampspår..."
          rows={3}
          className="input-glass"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading} className="btn-pill--secondary self-end">
          {isLoading ? 'Söker...' : 'Skicka fråga'}
        </button>
      </form>

      {error && <p className="mt-4 px-4 text-danger">{error}</p>}

      {aiResponse && (
        <div className="glass-card mt-6 p-6">
          <h3 className="mb-2 font-display font-semibold text-accent">Svar</h3>
          <p className="whitespace-pre-wrap text-text-muted">{aiResponse}</p>
          {citations.length > 0 && (
            <div className="mt-4 space-y-2 border-t border-border pt-4">
              <p className="text-[10px] uppercase tracking-widest text-success">Källor</p>
              {citations.map((c) => (
                <div key={`${c.collection}-${c.docId}`} className="rounded-xl border border-border bg-surface/40 p-3">
                  <p className="text-xs font-medium text-text">
                    {c.title} · {c.date}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-text-dim">
                    {c.collection} · {c.docId.slice(0, 8)}…
                  </p>
                  <p className="mt-1 text-sm text-text-muted">{c.excerpt}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </BentoCard>
  );
}
