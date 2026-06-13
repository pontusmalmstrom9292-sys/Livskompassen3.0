import { useEffect, useState, type FormEvent } from 'react';
import { ProtectedModule } from './layout/ProtectedModule';
import { useStore } from '../modules/core/store';
import { useMorningStore } from '../store/MorningStore';

export default function Morgonkompassen() {
  const user = useStore(s => s.user);
  const { 
    dailyIntent, 
    intentions, 
    isLoading, 
    error, 
    setDailyIntent, 
    addIntention, 
    toggleIntention, 
    removeIntention,
    fetchMorningData 
  } = useMorningStore();

  const [newIntention, setNewIntention] = useState('');

  useEffect(() => {
    if (user?.uid) {
      fetchMorningData(user.uid);
    }
  }, [user?.uid, fetchMorningData]);

  const handleAddIntention = (e: FormEvent) => {
    e.preventDefault();
    if (newIntention.trim()) {
      addIntention(newIntention.trim());
      setNewIntention('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 flex items-center justify-center">
        <p className="text-[#818CF8] animate-pulse">Laddar din morgonkompass...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500 bg-[#020617] min-h-screen">
        <p>Ett fel uppstod: {error}</p>
      </div>
    );
  }

  return (
    <ProtectedModule>
      <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans">
        <div className="max-w-2xl mx-auto space-y-10">
          <header className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-[#FDE68A]">Morgonkompassen</h1>
            <p className="text-gray-400">Din dagliga planeringscentral för avsikt och fokus.</p>
          </header>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-[#FDE68A]">Daglig Avsikt</h2>
            <input 
              type="text"
              value={dailyIntent}
              onChange={(e) => setDailyIntent(e.target.value)}
              placeholder="Vad är din viktigaste avsikt idag?"
              className="w-full bg-black/30 border border-[#818CF8]/30 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#818CF8] focus:ring-1 focus:ring-[#818CF8] transition-all"
            />
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl">
            <h2 className="text-xl font-semibold mb-6 text-[#FDE68A]">Fokus & Uppgifter</h2>
            
            <form onSubmit={handleAddIntention} className="flex gap-3 mb-6">
              <input 
                type="text"
                value={newIntention}
                onChange={(e) => setNewIntention(e.target.value)}
                placeholder="Lägg till ett nytt fokus..."
                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#818CF8] focus:ring-1 focus:ring-[#818CF8] transition-colors"
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-[#818CF8]/20 text-[#818CF8] hover:bg-[#818CF8]/30 border border-[#818CF8]/30 rounded-lg font-medium transition-colors"
              >
                Lägg till
              </button>
            </form>

            <ul className="space-y-3">
              {intentions.map(intention => (
                <li 
                  key={intention.id} 
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    intention.completed 
                      ? 'bg-white/5 border-white/5 opacity-50' 
                      : 'bg-black/20 border-white/10 hover:border-[#818CF8]/50'
                  }`}
                >
                  <button 
                    onClick={() => toggleIntention(intention.id)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
                      intention.completed 
                        ? 'border-[#FDE68A] bg-[#FDE68A]' 
                        : 'border-gray-500 hover:border-[#818CF8]'
                    }`}
                  >
                    {intention.completed && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#020617]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <span className={`flex-1 text-lg ${intention.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                    {intention.text}
                  </span>
                  <button 
                    onClick={() => removeIntention(intention.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-2"
                    aria-label="Ta bort"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
              {intentions.length === 0 && (
                <li className="text-center p-6 text-gray-500 italic border border-dashed border-white/10 rounded-xl">
                  Inget fokus tillagt ännu.
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </ProtectedModule>
  );
}
