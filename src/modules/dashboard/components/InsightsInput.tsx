import React, { useState } from 'react';
import { useStore } from '../../core/store';
import { useDashboardStore } from '../store/dashboardStore';

export function InsightsInput() {
  const user = useStore(state => state.user);
  const { addInsight } = useDashboardStore();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    if (!user?.uid) {
      setError('Du måste vara inloggad för att spara insikter.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await addInsight(user.uid, {
        title: title.trim(),
        content: content.trim(),
        // other fields can be added here if needed
      });
      
      // Reset form on success
      setTitle('');
      setContent('');
      setSuccessMsg('Insikt sparad!');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError((err as Error).message || 'Ett fel uppstod vid sparande.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-card mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-md transition-[border-color,box-shadow] focus-within:border-accent/35 focus-within:ring-1 focus-within:ring-accent/20">
      <h2 className="text-xl font-semibold mb-4 text-white">Lägg till ny insikt</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="insight-title" className="block text-sm font-medium text-white/80 mb-1">
            Titel
          </label>
          <input
            id="insight-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
            placeholder="T.ex. Veckans reflektion"
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <label htmlFor="insight-content" className="block text-sm font-medium text-white/80 mb-1">
            Beskrivning
          </label>
          <textarea
            id="insight-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all min-h-[100px] resize-y"
            placeholder="Vad har du kommit fram till?"
            disabled={isSubmitting}
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 text-sm">
            {successMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || !content.trim()}
          className="min-h-11 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 font-medium text-white shadow-sm transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-white/40"
        >
          {isSubmitting ? 'Sparar...' : 'Spara Insikt'}
        </button>
      </form>
    </div>
  );
}
