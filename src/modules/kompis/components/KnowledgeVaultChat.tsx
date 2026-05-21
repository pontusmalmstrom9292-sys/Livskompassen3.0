import { useState } from 'react';
import { callKnowledgeVault } from '../api/knowledgeVaultService';
import { useStore } from '../../core/store';
import { Lock } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';

export function KnowledgeVaultChat() {
  const [inputText, setInputText] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
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
    setKompisAura(true);

    try {
      const response = await callKnowledgeVault(inputText);
      setAiResponse(response);
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
    <BentoCard title="Knowledge Vault">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ställ din fråga till AI-agenten här..."
          rows={3}
          className="input-glass"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading} className="btn-pill--secondary self-end">
          {isLoading ? 'Skickar...' : 'Skicka fråga'}
        </button>
      </form>

      {error && <p className="mt-4 px-4 text-danger">{error}</p>}

      {aiResponse && (
        <div className="glass-card mt-6 p-6">
          <h3 className="mb-2 font-display font-semibold text-accent">AI-svar:</h3>
          <p className="whitespace-pre-wrap text-text-muted">{aiResponse}</p>
        </div>
      )}
    </BentoCard>
  );
}
