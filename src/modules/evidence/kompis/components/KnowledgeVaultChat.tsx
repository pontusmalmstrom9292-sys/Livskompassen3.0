import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  callKnowledgeVault,
  type KnowledgeVaultCitation,
  type KnowledgeVaultResult,
} from '../api/knowledgeVaultService';
import { KnowledgeCitationList } from './KnowledgeCitationList';
import { useStore } from '../../../core/store';
import { Lock, RefreshCw } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';

type KnowledgeVaultChatProps = {
  embedded?: boolean;
  onCitationClick?: (docId: string, collection: string) => void;
  activeCitationKey?: string | null;
};

function isNetworkError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('network') ||
    lower.includes('failed to fetch') ||
    lower.includes('unavailable') ||
    lower.includes('timeout') ||
    lower.includes('offline')
  );
}

export function KnowledgeVaultChat({
  embedded = false,
  onCitationClick,
  activeCitationKey,
}: KnowledgeVaultChatProps = {}) {
  const [inputText, setInputText] = useState<string>('');
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [citations, setCitations] = useState<KnowledgeVaultCitation[]>([]);
  const [moduleRoute, setModuleRoute] = useState<KnowledgeVaultResult['moduleRoute']>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const authLoading = useStore((s) => s.system.isLoading);
  const setKompisAura = useStore((s) => s.setKompisAura);

  const runQuery = async (prompt: string) => {
    if (!isAuthenticated) {
      setError('Du måste vara inloggad för att använda Kunskapsvalvet.');
      return;
    }
    if (!prompt.trim()) {
      setError('Vänligen skriv in en fråga.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiResponse(null);
    setCitations([]);
    setModuleRoute(undefined);
    setKompisAura(true);
    setLastPrompt(prompt);

    try {
      const result = await callKnowledgeVault(prompt);
      setAiResponse(result.answer);
      setCitations(result.citations ?? []);
      setModuleRoute(result.moduleRoute);
      setInputText('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ett okänt fel inträffade.';
      if (message.includes('unauthenticated') || message.includes('Autentisering')) {
        setError('Inloggning krävs. Kontrollera Firebase Auth och att functions är deployade.');
      } else if (isNetworkError(message)) {
        setError('Nätverksfel — kontrollera anslutningen och försök igen.');
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
      setKompisAura(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await runQuery(inputText);
  };

  const handleRetry = () => {
    if (lastPrompt) {
      void runQuery(lastPrompt);
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
    <BentoCard
      title={embedded ? 'Fråga Minne' : 'Kunskapsvalvet'}
      description={
        embedded
          ? 'Sök i sparade anteckningar — källor öppnas i Tidshjulet'
          : 'Frågor mot ditt Minne — med källhänvisningar'
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ställ din fråga mot Minne..."
          rows={embedded ? 2 : 3}
          className="input-glass"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading} className="btn-pill--secondary self-end">
          {isLoading ? 'Söker...' : 'Skicka fråga'}
        </button>
      </form>

      {error && (
        <div className="mt-4 flex flex-wrap items-center gap-3 px-4">
          <p className="text-danger">{error}</p>
          {lastPrompt && (
            <button
              type="button"
              onClick={handleRetry}
              disabled={isLoading}
              className="btn-pill--secondary inline-flex items-center gap-1.5 text-sm"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden />
              Försök igen
            </button>
          )}
        </div>
      )}

      {aiResponse && (
        <div className="glass-card mt-6 p-6">
          <h3 className="mb-2 font-display font-semibold text-accent">Svar</h3>
          <p className="whitespace-pre-wrap text-text-muted">{aiResponse}</p>
          {moduleRoute && (
            <Link
              to={moduleRoute.path}
              className="btn-pill--secondary mt-4 inline-flex text-sm"
            >
              Öppna {moduleRoute.label}
            </Link>
          )}
          {citations.length > 0 && (
            <div className="mt-4">
              <KnowledgeCitationList
                citations={citations}
                onCitationClick={onCitationClick}
                activeCitationKey={activeCitationKey}
              />
            </div>
          )}
        </div>
      )}
    </BentoCard>
  );
}
