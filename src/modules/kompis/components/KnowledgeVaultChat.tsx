import { useState } from 'react';
import { callKnowledgeVault } from '../api/knowledgeVaultService';

export function KnowledgeVaultChat() {
  const [inputText, setInputText] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setError('Vänligen skriv in en fråga.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiResponse(null);

    try {
      const response = await callKnowledgeVault(inputText);
      setAiResponse(response);
      setInputText('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ett okänt fel inträffade.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 w-full">
      <h2 className="text-2xl font-outfit mb-4 text-emerald-400">Knowledge Vault</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Stall din fraga till AI-agenten har..."
          rows={3}
          className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-emerald-500/50 resize-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="self-end px-6 py-2 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/50 hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Skickar...' : 'Skicka fraga'}
        </button>
      </form>

      {error && <p className="text-red-400 mt-4 px-4">{error}</p>}

      {aiResponse && (
        <div className="mt-6 border border-indigo-500/30 bg-indigo-500/10 p-6 rounded-[2rem]">
          <h3 className="text-indigo-400 font-semibold mb-2">AI-svar:</h3>
          <p className="whitespace-pre-wrap">{aiResponse}</p>
        </div>
      )}
    </div>
  );
}
