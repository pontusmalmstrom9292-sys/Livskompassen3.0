/**
 * EXTERN RITNING — Gemini mock Livskompassen App (2026-05-22)
 * Inkorg only. Not part of Vite build. Mock data + local BIFF/JADE.
 * Canonical app: src/
 */

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Heart, 
  Shield, 
  Lock, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  Search, 
  Eye, 
  EyeOff, 
  Copy, 
  Layers, 
  Grid, 
  HelpCircle, 
  ArrowRight,
  RotateCcw,
  Zap,
  Moon,
  TrendingUp,
  Activity,
  UserCheck
} from 'lucide-react';

export default function App() {
  // System states
  const [menuStyle, setMenuStyle] = useState('horizon'); // 'horizon' (Grid) or 'orbit' (Circular Wheel)
  const [cognitiveLoad, setCognitiveLoad] = useState('normal'); // 'normal' or 'high' (triggers System A: Safe Mode)
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, biff, valvet, korsreferens, vagus
  
  // System B: BIFF Bait-Detektor states
  const [biffInput, setBiffInput] = useState('');
  const [showMaskedBait, setShowMaskedBait] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [extractedLogistics, setExtractedLogistics] = useState('');
  const [baitsFound, setBaitsFound] = useState('');
  const [biffDrafts, setBiffDrafts] = useState({ standard: '', strict: '', minimalist: '' });

  // System C: Korsreferens-Motorn states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  // Jade Analyzer
  const [jadeInput, setJadeInput] = useState('');
  const [jadeWarnings, setJadeWarnings] = useState([]);

  // WORM Animation trigger
  const [wormChecked, setWormChecked] = useState(false);
  const [showNotification, setShowNotification] = useState(null);

  // Breathing Coach states
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathText, setBreathText] = useState('Redo? Tryck på start');
  const [breathStage, setBreathStage] = useState(0); // 0: in, 1: håll, 2: ut

  // Mock static data for Reality Check (WORM vs Logs)
  const [mockWormData] = useState([
    { id: 'w1', title: 'Hämtning tisdag v.19', date: '2026-05-12', note: 'Kasper överlämnad kl 15:00 av pappa vid skolan. Inga anmärkningar. Kasper glad och pigg.', tags: ['hämtning', 'skola'] },
    { id: 'w2', title: 'Sömnrapport Kasper', date: '2026-05-15', note: 'Kasper sov ostört 19:30 - 07:00. Ingen mardröm noterad.', tags: ['sömn', 'hälsa'] },
    { id: 'w3', title: 'Ekonomi underhåll', date: '2026-05-01', note: 'Swish-överföring gjord i enlighet med överenskommelse.', tags: ['ekonomi'] },
    { id: 'w4', title: 'Arvids utvecklingssamtal', date: '2026-05-10', note: 'Möte med lärare Helena. Arvid följer sin plan perfekt och visar hög trivsel.', tags: ['skola', 'arvid'] }
  ]);

  const [mockLogData] = useState([
    { date: '2026-05-12', label: 'Sömn Kasper', score: 5, comment: 'Stabil natt' },
    { date: '2026-05-13', label: 'Sömn Kasper', score: 4, comment: 'Somnade lätt' },
    { date: '2026-05-14', label: 'Sömn Kasper', score: 5, comment: 'Utvilad inför skolan' },
    { date: '2026-05-15', label: 'Sömn Kasper', score: 5, comment: 'Trygg och stabil' }
  ]);

  // Toast helper
  const triggerToast = (msg) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(null), 3500);
  };

  // Breathing loop
  useEffect(() => {
    let timer;
    if (breathingActive) {
      const runCycle = () => {
        setBreathStage(0);
        setBreathText('Andas in djupt... (Fyll magen)');
        timer = setTimeout(() => {
          setBreathStage(1);
          setBreathText('Håll andan... (Slappna av i axlarna)');
          timer = setTimeout(() => {
            setBreathStage(2);
            setBreathText('Andas ut långsamt... (Aktivera vagusnerven)');
            timer = setTimeout(() => {
              runCycle();
            }, 5000);
          }, 4000);
        }, 4000);
      };
      runCycle();
    } else {
      setBreathText('Redo? Tryck på start');
      setBreathStage(-1);
    }
    return () => clearTimeout(timer);
  }, [breathingActive]);

  // JADE Analyzer triggers
  useEffect(() => {
    const warnings = [];
    const lowerText = jadeInput.toLowerCase();
    
    if (lowerText.includes('för att') || lowerText.includes('eftersom')) {
      warnings.push('Förklaring upptäckt ("eftersom"/"för att"). Du behöver inte motivera dina beslut för ditt ex.');
    }
    if (lowerText.includes('du måste förstå') || lowerText.includes('fatta')) {
      warnings.push('Försök till övertalning upptäckt ("du måste förstå"). Detta bjuder in till vidare argumentation.');
    }
    if (lowerText.includes('förlåt') || lowerText.includes('ursäkta')) {
      warnings.push('Onödig ursäkt upptäckt. Detta kan användas som bekräftelse på skuld.');
    }
    if (lowerText.includes('faktum är') || lowerText.includes('sanningen')) {
      warnings.push('Försvar upptäckt ("faktum är"). Håll dig enbart till korta logistiska påståenden.');
    }
    setJadeWarnings(warnings);
  }, [jadeInput]);

  // Preset toxic message for testing the Bait Detector
  const loadExampleBait = () => {
    setBiffInput(
      "Du hämtar alltid Kasper alldeles för sent och struntar helt i hans rutiner. Han var jättetrött hela tisdagen efter ditt slarv! Du måste förstå att jag måste ta över alla helger om du fortsätter förstöra hans skolgång. Svara direkt hur du tänker lösa detta inför tisdag kl 15:00."
    );
    setAnalyzed(false);
    triggerToast("Exempel-meddelande laddat. Tryck på Sortera.");
  };

  // BIFF Sorter
  const processBiff = () => {
    if (!biffInput.trim()) {
      triggerToast("Skriv eller ladda ett meddelande först.");
      return;
    }
    setAnalyzed(true);
    setExtractedLogistics("Bekräftelse av hämttid för Kasper på tisdag kl 15:00.");
    setBaitsFound(
      "Anklagelser om att du alltid är sen, påståenden om slarv och hot om att ta över helger/förstöra skolgång samt krav på känslomässig förklaring (JADE-fälla)."
    );
    
    setBiffDrafts({
      standard: "Hej. Jag bekräftar att hämttiden för Kasper på tisdag kl 15:00 står kvar enligt schema. Vänliga hälsningar.",
      strict: "Hämtning sker på tisdag kl 15:00 enligt gällande schema.",
      minimalist: "Bekräftas. Tisdag 15:00."
    });
    
    triggerToast("Analys färdig! Beten maskerade.");
  };

  // System C: Reality Cross-Reference Search engine
  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResult(null);
      return;
    }

    const lowerQuery = q.toLowerCase();
    
    // Filter WORM entries
    const matchingWorm = mockWormData.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.note.toLowerCase().includes(lowerQuery) ||
      item.tags.some(t => t.toLowerCase().includes(lowerQuery))
    );

    // Filter Health Logs
    const matchingLogs = mockLogData.filter(item => 
      item.label.toLowerCase().includes(lowerQuery) ||
      item.comment.toLowerCase().includes(lowerQuery)
    );

    setSearchResult({
      worm: matchingWorm,
      logs: matchingLogs
    });
  };

  return (
    <div className="min-h-screen bg-[#05080E] text-slate-100 font-sans antialiased flex flex-col justify-between max-w-md mx-auto shadow-2xl relative border-x border-slate-900 overflow-hidden pb-24">
      
      {/* Dynamic Glow effects based on cognitive state */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full blur-[80px] pointer-events-none transition-all duration-1000 ${
        cognitiveLoad === 'high' ? 'bg-emerald-500/10' : 'bg-blue-500/15'
      }`}></div>

      {/* Styled Inline Keyframes for UI Polish */}
      <style>{`
        @keyframes borderGlow {
          0% { border-color: rgba(245, 197, 66, 0.2); box-shadow: 0 0 5px rgba(245, 197, 66, 0.1); }
          50% { border-color: rgba(245, 197, 66, 0.6); box-shadow: 0 0 15px rgba(245, 197, 66, 0.25); }
          100% { border-color: rgba(245, 197, 66, 0.2); box-shadow: 0 0 5px rgba(245, 197, 66, 0.1); }
        }
        .worm-active-shield {
          animation: borderGlow 2.5s infinite ease-in-out;
        }
        .text-mask {
          filter: blur(4px);
          user-select: none;
          opacity: 0.6;
          transition: all 0.3s ease;
        }
        .text-mask:hover {
          filter: blur(2px);
        }
        .breath-ring-in {
          transform: scale(1.15);
          background-color: rgba(16, 185, 129, 0.15);
          transition: all 4s ease-in-out;
        }
        .breath-ring-hold {
          transform: scale(1.15);
          background-color: rgba(245, 197, 66, 0.15);
          transition: all 4s ease-in-out;
        }
        .breath-ring-out {
          transform: scale(0.9);
          background-color: rgba(16, 185, 129, 0.05);
          transition: all 5s ease-in-out;
        }
      `}</style>

      {/* Toast Alert Box */}
      {showNotification && (
        <div className="absolute top-16 left-4 right-4 bg-slate-950/95 border border-amber-500/30 backdrop-blur-lg text-amber-300 py-3.5 px-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-fade-in">
          <div className="p-1 rounded-full bg-amber-500/20 text-amber-400">
            <Check size={16} />
          </div>
          <span className="text-xs font-semibold">{showNotification}</span>
        </div>
      )}

      {/* MAIN SYSTEM HEADER */}
      <header className="px-5 pt-5 pb-4 bg-[#05080E]/90 border-b border-slate-900 sticky top-0 z-40 backdrop-blur-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#0F172A] border border-slate-800 flex items-center justify-center">
              <Compass className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-100">LIVSKOMPASSEN <span className="text-amber-400">2.0</span></h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Det kognitiva exoskelettet</p>
            </div>
          </div>

          {/* SYSTEM A Selector - Cognitive load switch */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-900">
            <button 
              onClick={() => { setCognitiveLoad('normal'); triggerToast("Normal UI återställt."); }}
              className={`p-1.5 rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-1 ${
                cognitiveLoad === 'normal' ? 'bg-slate-900 text-amber-400 border border-slate-800' : 'text-slate-500'
              }`}
            >
              Klar sikt
            </button>
            <button 
              onClick={() => { setCognitiveLoad('high'); triggerToast("Safe Mode aktiverat: Minimal kognitiv stress."); }}
              className={`p-1.5 rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-1 ${
                cognitiveLoad === 'high' ? 'bg-amber-400/20 text-amber-300 border border-amber-500/30' : 'text-slate-500'
              }`}
            >
              <Zap size={10} className="text-amber-400 animate-bounce" />
              Extrem trötthet
            </button>
          </div>
        </div>

        {/* Style/Layout Switcher (Döljs i Safe Mode) */}
        {cognitiveLoad === 'normal' && (
          <div className="flex justify-between items-center text-xs text-slate-400 bg-[#090D16] px-3 py-2 rounded-xl border border-slate-900">
            <span className="font-medium text-slate-500">Struktur & Gränssnitt:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setMenuStyle('horizon')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition ${
                  menuStyle === 'horizon' ? 'bg-slate-900 text-amber-400 border border-slate-800' : 'hover:text-slate-200'
                }`}
              >
                <Grid size={12} /> Horizon Grid
              </button>
              <button 
                onClick={() => setMenuStyle('orbit')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition ${
                  menuStyle === 'orbit' ? 'bg-slate-900 text-amber-400 border border-slate-800' : 'hover:text-slate-200'
                }`}
              >
                <Compass size={12} /> Orbit Menu
              </button>
            </div>
          </div>
        )}
      </header>

      {/* CORE CONTENT SCROLLER */}
      <main className="flex-1 px-4 py-4 overflow-y-auto space-y-4">

        {/* ========================================== */}
        {/* SYSTEM A: SAFE MODE (EXTREM TRÖTTHET)    */}
        {/* ========================================== */}
        {cognitiveLoad === 'high' ? (
          <div className="space-y-4 animate-fade-in">
            {/* Soft, low-stimulus banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-slate-950 border border-emerald-500/20">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1 mb-1">
                <Check size={12} /> Säkert läge aktivt
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Ditt nervsystem är trött just nu. Vi har döljt alla formulär och inställningar. Fokusera bara på att andas eller stänga ute bruset.
              </p>
            </div>

            {/* Acute Vagus Breathing Button */}
            <div className="p-5 rounded-2xl bg-[#09121F] border-2 border-emerald-400/30 text-center space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Steg 1: Lugna kroppen</span>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">Vagus-andning (4-4-5)</h3>
              </div>
              
              {/* Giant pulsing tactile breath area */}
              <div className="w-32 h-32 rounded-full bg-slate-950 border border-emerald-500/20 mx-auto flex items-center justify-center relative">
                <div className={`absolute rounded-full w-28 h-28 border border-emerald-400/30 ${
                  breathStage === 0 ? 'breath-ring-in' :
                  breathStage === 1 ? 'breath-ring-hold' :
                  breathStage === 2 ? 'breath-ring-out' : 'scale-90 opacity-40'
                }`}></div>
                <div className="w-12 h-12 rounded-full bg-emerald-950 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
              </div>

              <p className="text-xs font-semibold text-slate-200 px-4 min-h-[32px] flex items-center justify-center leading-relaxed">
                {breathText}
              </p>

              <button 
                onClick={() => setBreathingActive(!breathingActive)}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                  breathingActive ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500 text-slate-950'
                }`}
              >
                {breathingActive ? 'Pausa andning' : 'Börja andas nu'}
              </button>
            </div>

            {/* Extreme Low Friction Log Option */}
            <div className="p-4 rounded-2xl bg-[#0E1629] border border-slate-800 space-y-3">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Steg 2: Enkel bekräftelse</span>
                <h4 className="text-xs font-bold text-slate-300 mt-0.5">Spara bara humör (Ingen text krävs)</h4>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Trött/Eftersläpning', 'Lugn/Stabil', 'Spänd/Stressad'].map((tag) => (
                  <button 
                    key={tag}
                    onClick={() => triggerToast(`Status sparad: ${tag}. Bra kämpat!`)}
                    className="py-3 px-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-bold hover:border-amber-400 hover:text-amber-400 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Micro assurance statement */}
            <p className="text-center text-[10px] text-slate-500 italic max-w-xs mx-auto">
              "Ingen prestation, inga krav. Du är den stabila hamnen för dina barn oavsett."
            </p>
          </div>
        ) : (
          /* ========================================== */
          /* NORMAL MODE: FULL INTERACTIVE      */
          /* ========================================== */
          <div className="space-y-4">

            {/* --- LAYOUT OPTION 1: HORIZON GRID (Categorized Dashboard) --- */}
            {menuStyle === 'horizon' && activeTab === 'dashboard' && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Zero-Pressure Progress Bar */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0C1221] to-[#060A13] border border-slate-800/80 shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hälsa & KASAM</span>
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Hanterbarhet stabil
                    </span>
                  </div>
                  {/* Gentle pulsing progress line */}
                  <div className="w-full bg-slate-950 rounded-full h-2 mb-2 p-0.5 border border-slate-900 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 h-1 rounded-full animate-pulse" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    "Kompassen väntar på dig — ingen stress, logga när du har kapacitet."
                  </p>
                </div>

                {/* Horizon Grid Kvadranter */}
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* QUARTER 1: AKUT (Red/Vagus) */}
                  <button 
                    onClick={() => setActiveTab('vagus')}
                    className="p-4 rounded-2xl bg-[#110D12] hover:bg-[#1A121C] border border-red-500/20 text-left transition relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-12 h-12 bg-red-500/5 rounded-full blur-lg group-hover:bg-red-500/15"></div>
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full block mb-2 animate-pulse"></span>
                    <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">🚨 AKUT</h3>
                    <p className="text-[10px] text-slate-500 mt-1 leading-tight">Nervsystem på högvarv / RSD-panik</p>
                    <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-red-400">
                      Vagus-andning <ArrowRight size={10} />
                    </div>
                  </button>

                  {/* QUARTER 2: SKÖLD (Gold/BIFF) */}
                  <button 
                    onClick={() => setActiveTab('biff')}
                    className="p-4 rounded-2xl bg-[#14120E] hover:bg-[#1F1B12] border border-amber-500/20 text-left transition relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/5 rounded-full blur-lg group-hover:bg-amber-500/15"></div>
                    <span className="w-2.5 h-2.5 bg-amber-400 rounded-full block mb-2"></span>
                    <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">🛡️ SKÖLD</h3>
                    <p className="text-[10px] text-slate-500 mt-1 leading-tight">Inkommande meddelande / Loggning</p>
                    <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-amber-400">
                      BIFF-detektor <ArrowRight size={10} />
                    </div>
                  </button>

                  {/* QUARTER 3: HAMNEN (Emerald/Stabilitet) */}
                  <button 
                    onClick={() => setActiveTab('korsreferens')}
                    className="p-4 rounded-2xl bg-[#0D1311] hover:bg-[#121F1A] border border-emerald-500/20 text-left transition relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-full blur-lg group-hover:bg-emerald-500/15"></div>
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full block mb-2"></span>
                    <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">🌱 HAMNEN</h3>
                    <p className="text-[10px] text-slate-500 mt-1 leading-tight">Verklighetskontroll & fakta</p>
                    <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                      Korsreferens-motor <ArrowRight size={10} />
                    </div>
                  </button>

                  {/* QUARTER 4: RETREAT (Blue/Vila) */}
                  <button 
                    onClick={() => setActiveTab('valvet')}
                    className="p-4 rounded-2xl bg-[#0D101A] hover:bg-[#121629] border border-blue-500/20 text-left transition relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/5 rounded-full blur-lg group-hover:bg-blue-500/15"></div>
                    <span className="w-2.5 h-2.5 bg-blue-400 rounded-full block mb-2"></span>
                    <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">⏳ VALVET</h3>
                    <p className="text-[10px] text-slate-500 mt-1 leading-tight">Oföränderliga WORM-bevis</p>
                    <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-blue-400">
                      Säkra minnen <ArrowRight size={10} />
                    </div>
                  </button>

                </div>

                {/* Instant Vagus SOS Bar */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#111A30] to-[#090E1B] border border-blue-500/10 flex items-center justify-between shadow-xl">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Snabbreglering</span>
                    <h4 className="text-xs font-bold text-slate-200">Känner du stress eller RSD-påslag?</h4>
                    <p className="text-[10px] text-slate-500">Andas i 2 minuter för att lugna vagusnerven.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('vagus')}
                    className="p-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl transition font-bold text-[10px] uppercase tracking-wider shrink-0 ml-3"
                  >
                    Börja
                  </button>
                </div>

              </div>
            )}

            {/* --- LAYOUT OPTION 2: THE ORBIT MENU (Svajp-kompass hjulet) --- */}
            {menuStyle === 'orbit' && activeTab === 'dashboard' && (
              <div className="space-y-4 text-center py-6 animate-fade-in">
                
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fokusera kompassen</h3>
                <p className="text-[11px] text-slate-500 italic max-w-xs mx-auto">
                  Svajpa eller rotera hjulet mentalt. Klicka på valfritt livsområde för att öppna den kognitiva skölden.
                </p>

                {/* Highly interactive graphical orbit node dial */}
                <div className="relative w-72 h-72 mx-auto flex items-center justify-center my-6">
                  {/* Outer orbit structure */}
                  <div className="absolute w-full h-full rounded-full border border-dashed border-slate-800 animate-spin-slow"></div>
                  <div className="absolute w-4/5 h-4/5 rounded-full border border-slate-900 flex items-center justify-center">
                    <div className="absolute w-2/3 h-2/3 rounded-full border border-amber-400/10 bg-[#070B13]/80 shadow-2xl flex flex-col items-center justify-center">
                      {/* Active Center Compass Rose */}
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-widest animate-pulse">Kompass</span>
                      <Compass className="w-10 h-10 text-amber-400 mt-1" />
                    </div>
                  </div>

                  {/* Node positions around center */}
                  {/* NORTH: Sköld (BIFF) */}
                  <button 
                    onClick={() => setActiveTab('biff')}
                    className="absolute top-2 left-1/2 -translate-x-1/2 p-2 rounded-xl bg-[#14120E] border border-amber-500/30 hover:border-amber-400 transition shadow-lg w-16"
                  >
                    <Shield className="w-5 h-5 text-amber-400 mx-auto" />
                    <span className="text-[9px] font-bold block mt-1 uppercase text-slate-300">Sköld</span>
                  </button>

                  {/* SOUTH: Valvet (WORM) */}
                  <button 
                    onClick={() => setActiveTab('valvet')}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 p-2 rounded-xl bg-[#0D101A] border border-blue-500/30 hover:border-blue-400 transition shadow-lg w-16"
                  >
                    <Lock className="w-5 h-5 text-blue-400 mx-auto" />
                    <span className="text-[9px] font-bold block mt-1 uppercase text-slate-300">Valv</span>
                  </button>

                  {/* WEST: Akut (SOS) */}
                  <button 
                    onClick={() => setActiveTab('vagus')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-[#110D12] border border-red-500/30 hover:border-red-400 transition shadow-lg w-16"
                  >
                    <Activity className="w-5 h-5 text-red-500 mx-auto animate-pulse" />
                    <span className="text-[9px] font-bold block mt-1 uppercase text-slate-300">Akut</span>
                  </button>

                  {/* EAST: Hamnen (Korsreferens) */}
                  <button 
                    onClick={() => setActiveTab('korsreferens')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-[#0D1311] border border-emerald-500/30 hover:border-emerald-400 transition shadow-lg w-16"
                  >
                    <Search className="w-5 h-5 text-emerald-400 mx-auto" />
                    <span className="text-[9px] font-bold block mt-1 uppercase text-slate-300">Fakta</span>
                  </button>

                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-900 inline-block">
                  <span className="text-amber-400 text-xs font-bold">Tryggt tips:</span>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-normal">
                    Om du känner dig anklagad just nu, välj **SKÖLD** för att processa texten och ta bort betet direkt.
                  </p>
                </div>

              </div>
            )}

            {/* ======================================================= */}
            {/* TAB: SYSTEM B (BIFF TRIAGE / DETEKTOR & JADE DETECT)  */}
            {/* ======================================================= */}
            {activeTab === 'biff' && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Intro module */}
                <div className="p-4 rounded-2xl bg-[#0E1629] border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Kognitiv sköld</span>
                    <span className="text-[10px] text-slate-500">I samarbete med Hamnen</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">BIFF-Detektor & Bait-Sökare</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Låt systemet söka efter JADE-fällor och dolda aggressioner innan du läser meddelandet. Spara din energi och se logistiken direkt.
                  </p>
                </div>

                {/* Input block */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Inkommande text</span>
                    <button 
                      onClick={loadExampleBait}
                      className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded-lg hover:bg-amber-400/20 transition"
                    >
                      Ladda exempelmeddelande
                    </button>
                  </div>

                  <textarea
                    value={biffInput}
                    onChange={(e) => { setBiffInput(e.target.value); setAnalyzed(false); }}
                    placeholder="Klistra in meddelandet eller sms:et här..."
                    className="w-full h-24 p-3 bg-[#060A13] border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-amber-400/50 resize-none"
                  />

                  <button 
                    onClick={processBiff}
                    className="w-full py-3 bg-amber-400 text-slate-950 hover:bg-amber-300 transition font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10"
                  >
                    <Shield size={14} /> Kör BIFF Triage & Sortering
                  </button>
                </div>

                {/* Output analysis (System B Logic with mask) */}
                {analyzed && (
                  <div className="space-y-3 animate-fade-in">
                    
                    {/* The Bait block with masking/blur */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-red-500/20 space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                        <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider flex items-center gap-1">
                          <AlertTriangle size={12} /> Känslomässigt brus (90% Sorterat bort)
                        </span>
                        <button 
                          onClick={() => setShowMaskedBait(!showMaskedBait)}
                          className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 font-semibold"
                        >
                          {showMaskedBait ? <EyeOff size={12} /> : <Eye size={12} />} 
                          {showMaskedBait ? 'Dölj/Maskera' : 'Visa dolda anklagelser'}
                        </button>
                      </div>

                      <div className="bg-[#090D16] p-3 rounded-xl border border-slate-900">
                        <p className={`text-xs text-slate-400 leading-relaxed font-light ${!showMaskedBait ? 'text-mask' : ''}`}>
                          {baitsFound}
                        </p>
                        {!showMaskedBait && (
                          <span className="text-[9px] text-amber-400/60 block mt-2 italic font-semibold">
                            * Systemet har maskerat/suddigt anklagelserna för att dämpa din stressrespons. Du behöver inte läsa detta.
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Logistics Block */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/20 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                        Logistisk kärna (De 10% du ska besvara)
                      </span>
                      <div className="bg-[#090D16] p-3 rounded-xl border border-slate-900 text-xs text-slate-200 font-semibold">
                        {extractedLogistics}
                      </div>
                    </div>

                    {/* 3 BIFF Options with single copy click */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-3">
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                        Färdiga svar utan JADE (Välj & kopiera)
                      </span>

                      <div className="space-y-3">
                        {/* Option 1: Standard */}
                        <div className="p-3 bg-[#0E1629] rounded-xl border border-slate-800 space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-amber-400">Alternativ 1: Standard BIFF</span>
                            <button 
                              onClick={() => { navigator.clipboard.writeText(biffDrafts.standard); triggerToast("Kopierat standard-svar!"); }}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                            >
                              <Copy size={10} /> Kopiera
                            </button>
                          </div>
                          <p className="text-xs text-slate-200 italic font-mono bg-[#05080E] p-2 rounded">
                            "{biffDrafts.standard}"
                          </p>
                        </div>

                        {/* Option 2: Strict */}
                        <div className="p-3 bg-[#0E1629] rounded-xl border border-slate-800 space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-amber-400">Alternativ 2: Ultra-Kort / Strikt</span>
                            <button 
                              onClick={() => { navigator.clipboard.writeText(biffDrafts.strict); triggerToast("Kopierat strikt-svar!"); }}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                            >
                              <Copy size={10} /> Kopiera
                            </button>
                          </div>
                          <p className="text-xs text-slate-200 italic font-mono bg-[#05080E] p-2 rounded">
                            "{biffDrafts.strict}"
                          </p>
                        </div>

                        {/* Option 3: Minimalist */}
                        <div className="p-3 bg-[#0E1629] rounded-xl border border-slate-800 space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-amber-400">Alternativ 3: Minimalist</span>
                            <button 
                              onClick={() => { navigator.clipboard.writeText(biffDrafts.minimalist); triggerToast("Kopierat minimalistiskt svar!"); }}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                            >
                              <Copy size={10} /> Kopiera
                            </button>
                          </div>
                          <p className="text-xs text-slate-200 italic font-mono bg-[#05080E] p-2 rounded">
                            "{biffDrafts.minimalist}"
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* --- JADE Detector Area --- */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-slate-300">Skriv eget svar / JADE-Test</h4>
                      <p className="text-[10px] text-slate-500">Skriv och testa om du råkar försvara eller förklara dig.</p>
                    </div>
                  </div>

                  <textarea 
                    value={jadeInput}
                    onChange={(e) => setJadeInput(e.target.value)}
                    placeholder="Skriv ett eget utkast till svar här för att testa mot JADE..."
                    className="w-full h-16 p-2.5 bg-[#060A13] border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-amber-400/40"
                  />

                  {/* Dynamic JADE Alerts */}
                  {jadeWarnings.length > 0 ? (
                    <div className="p-3 bg-amber-400/10 border border-amber-500/30 rounded-xl space-y-1.5 animate-pulse">
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
                        <AlertTriangle size={12} /> JADE-Fälla Upptäckt:
                      </span>
                      {jadeWarnings.map((warning, index) => (
                        <p key={index} className="text-[10px] text-slate-300 font-medium">
                          • {warning}
                        </p>
                      ))}
                    </div>
                  ) : jadeInput.trim() ? (
                    <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/20 rounded-xl flex items-center gap-1.5">
                      <Check size={12} className="text-emerald-400" />
                      <span className="text-[10px] text-slate-300 font-semibold">Svaret ser ut att vara fritt från JADE-fällor.</span>
                    </div>
                  ) : null}
                </div>

              </div>
            )}

            {/* ======================================================= */}
            {/* TAB: SYSTEM C (KORSREFERENS-MOTORN / REALITY CHECK)   */}
            {/* ======================================================= */}
            {activeTab === 'korsreferens' && (
              <div className="space-y-4 animate-fade-in">
                
                <div className="p-4 rounded-2xl bg-[#0E1629] border border-slate-800">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">System C: Fakta vs Gaslighting</span>
                  <h3 className="text-sm font-bold text-slate-100 mt-0.5">Korsreferens-Motorn</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Motverka desinformation. Sök i ditt stängda Verklighetsvalv (WORM) och korrelera direkt med historisk loggdata på ett och samma ställe.
                  </p>
                </div>

                {/* Reality Sökare */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-3">
                  <div className="relative">
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={handleSearch}
                      placeholder="Skriv 'sömn' eller 'skola' för att korsreferera..."
                      className="w-full pl-9 pr-4 py-2.5 bg-[#060A13] border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/40"
                    />
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                  </div>

                  {!searchQuery && (
                    <div className="p-3 bg-[#060A13] rounded-xl text-center space-y-1">
                      <span className="text-[11px] text-slate-500 font-bold block">Snabb sök-demonstration</span>
                      <p className="text-[10px] text-slate-600">Klicka på ett förslag för att söka:</p>
                      <div className="flex gap-2 justify-center mt-2">
                        <button 
                          onClick={() => handleSearch({ target: { value: 'Sömn' } })}
                          className="px-2.5 py-1 bg-[#101726] border border-slate-800 rounded-lg text-[10px] text-emerald-400"
                        >
                          Sömn
                        </button>
                        <button 
                          onClick={() => handleSearch({ target: { value: 'Skola' } })}
                          className="px-2.5 py-1 bg-[#101726] border border-slate-800 rounded-lg text-[10px] text-emerald-400"
                        >
                          Skola
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Search outcome */}
                  {searchResult && (
                    <div className="space-y-3 animate-fade-in">
                      
                      {/* Section 1: WORM Documents */}
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                          Säkrade WORM-bevis i Verklighetsvalvet ({searchResult.worm.length})
                        </h4>
                        {searchResult.worm.length > 0 ? (
                          searchResult.worm.map(item => (
                            <div key={item.id} className="p-3 bg-[#0D1221] border border-amber-500/20 rounded-xl space-y-1.5">
                              <div className="flex justify-between text-[10px] text-slate-500">
                                <span className="font-bold text-amber-400 uppercase tracking-wider">Säkrad post</span>
                                <span>{item.date}</span>
                              </div>
                              <h5 className="text-xs font-bold text-slate-200">{item.title}</h5>
                              <p className="text-[11px] text-slate-400 leading-normal italic">"{item.note}"</p>
                              <div className="flex gap-1.5">
                                {item.tags.map(t => (
                                  <span key={t} className="text-[9px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-500">
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-[11px] text-slate-500 italic">Inga matchande WORM-bevis hittades.</p>
                        )}
                      </div>

                      {/* Section 2: Aggregated Logs */}
                      <div className="space-y-2 border-t border-slate-900 pt-3">
                        <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                          Historisk Loggdata ({searchResult.logs.length})
                        </h4>
                        {searchResult.logs.length > 0 ? (
                          <div className="bg-[#090D16] p-3 rounded-xl border border-slate-900 space-y-2">
                            <span className="text-[10px] text-slate-500 block">Objektiva mätningar från kompassen:</span>
                            {searchResult.logs.map((log, i) => (
                              <div key={i} className="flex justify-between items-center text-xs text-slate-300 py-1 border-b border-slate-900/60 last:border-none">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono text-slate-500">{log.date}</span>
                                  <span className="font-medium">{log.label}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-emerald-400 font-bold">{log.score}/5</span>
                                  <span className="text-[10px] text-slate-500">({log.comment})</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-500 italic">Ingen relaterad loggdata funnen.</p>
                        )}
                      </div>

                      {/* Solid summary */}
                      <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-[10px] text-emerald-300 leading-normal">
                        <strong>Verklighetskontroll bekräftad:</strong> Dina sparade data motbevisar påståenden om bristande rutiner. Lita på dina WORM-loggningar, de kan inte manipuleras i efterhand.
                      </div>

                    </div>
                  )}

                </div>

              </div>
            )}

            {/* ======================================================= */}
            {/* TAB: SYSTEM C (WORM VERKLIGHETSVALVET ARCHIVE)         */}
            {/* ======================================================= */}
            {activeTab === 'valvet' && (
              <div className="space-y-4 animate-fade-in">
                
                <div className="p-4 rounded-2xl bg-[#0E1629] border border-slate-800">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Verklighetsvalvet (WORM)</span>
                  <h3 className="text-sm font-bold text-slate-100 mt-0.5">Säkrat och oföränderligt arkiv</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Skriv ned händelser direkt medan ditt minne är färskt. Med WORM (Write Once, Read Many) kan informationen inte ändras eller manipuleras i efterhand.
                  </p>
                </div>

                {/* Golden Shield Animation interactive component */}
                <div className={`p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-3 transition-all duration-500 ${
                  wormChecked ? 'worm-active-shield bg-[#14120E]' : ''
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-300">Skapa ny bevispost</span>
                    <div className="flex items-center gap-1">
                      <Lock size={12} className={wormChecked ? 'text-amber-400' : 'text-slate-600'} />
                      <span className="text-[10px] font-semibold text-slate-500">WORM skydd</span>
                    </div>
                  </div>

                  <input 
                    type="text"
                    placeholder="Titel på händelse..."
                    className="w-full px-3 py-2 bg-[#060A13] border border-slate-800 rounded-xl text-xs text-slate-200"
                  />
                  <textarea 
                    placeholder="Skriv endast ren fakta utan känslor (t.ex. datum, tid, exakta ord, närvarande personer)..."
                    className="w-full h-16 px-3 py-2 bg-[#060A13] border border-slate-800 rounded-xl text-xs text-slate-300 resize-none"
                  />

                  {/* Toggle WORM with visual impact */}
                  <label className="flex items-center gap-2 cursor-pointer p-2 bg-[#090D16] rounded-xl border border-slate-900">
                    <input 
                      type="checkbox"
                      checked={wormChecked}
                      onChange={(e) => {
                        setWormChecked(e.target.checked);
                        if (e.target.checked) triggerToast("WORM-skydd aktiverat! Guldskölden är låst.");
                      }}
                      className="rounded border-slate-800 bg-[#060A13] text-amber-400 focus:ring-0 focus:ring-offset-0"
                    />
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-300 block">Säkra som WORM-bevis</span>
                      <span className="text-[9px] text-slate-500 block">Skrivskyddar inlägget permanent i databasen</span>
                    </div>
                  </label>

                  <button 
                    onClick={() => {
                      triggerToast("Händelse låst och arkiverad i Verklighetsvalvet.");
                      setWormChecked(false);
                    }}
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/10"
                  >
                    Lås och spara bevis
                  </button>
                </div>

                {/* List over locked proofs */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tidigare låsta bevis</span>
                  {mockWormData.map(item => (
                    <div key={item.id} className="p-3 bg-[#0E1629] border border-slate-800/60 rounded-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 h-full w-1.5 bg-amber-400/40"></div>
                      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                        <span className="font-bold text-amber-400 flex items-center gap-1">
                          <Lock size={10} /> OFÖRÄNDERLIG (WORM)
                        </span>
                        <span>{item.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                      <p className="text-xs text-slate-400 leading-normal italic mt-1">"{item.note}"</p>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ======================================================= */}
            {/* TAB: SYSTEM A (VAGUS / ANIMAL SOOTHE COACH)           */}
            {/* ======================================================= */}
            {activeTab === 'vagus' && (
              <div className="space-y-4 animate-fade-in">
                
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0F1C2A] to-[#0A111F] border border-emerald-500/20 text-center space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
                  
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Kroppslig Stressreglering</span>
                    <h3 className="text-base font-bold text-slate-100">Stimulera Vagusnerven</h3>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-normal">
                      När du drabbas av ångest eller RSD-påslag fungerar inte logik. Använd andningen för att lugna ditt nervsystem först.
                    </p>
                  </div>

                  {/* Pulsing breathing coach ring */}
                  <div className="w-36 h-36 rounded-full bg-slate-950 border border-slate-900 mx-auto flex items-center justify-center relative shadow-inner">
                    <div className={`absolute rounded-full w-32 h-32 border border-emerald-400/20 ${
                      breathStage === 0 ? 'breath-ring-in' :
                      breathStage === 1 ? 'breath-ring-hold' :
                      breathStage === 2 ? 'breath-ring-out' : 'scale-90 opacity-40'
                    }`}></div>
                    <div className="w-12 h-12 rounded-full bg-emerald-950 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Real-time instruction */}
                  <p className="text-xs font-semibold text-slate-200 min-h-[32px] flex items-center justify-center">
                    {breathText}
                  </p>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setBreathingActive(!breathingActive)}
                      className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg ${
                        breathingActive ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500 text-slate-950'
                      }`}
                    >
                      {breathingActive ? 'Stoppa' : 'Starta andningscoach'}
                    </button>
                    {breathingActive && (
                      <button 
                        onClick={() => { setBreathingActive(false); setBreathStage(-1); }}
                        className="px-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-slate-200 transition text-xs"
                      >
                        Nollställ
                      </button>
                    )}
                  </div>
                </div>

                {/* Additional somatic triggers */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Andra lugnande övningar</span>
                  
                  <div className="space-y-2">
                    <div className="p-3 bg-[#0E1629] rounded-xl border border-slate-800 flex gap-3 text-xs">
                      <span className="text-xl">💧</span>
                      <div>
                        <strong className="text-slate-200 block">Kallt vatten</strong>
                        <span className="text-slate-400 leading-normal block mt-0.5">Skvätt iskallt vatten i ansiktet i 15 sekunder för att trigga dykreflexen och omedelbart sänka pulsen.</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#0E1629] rounded-xl border border-slate-800 flex gap-3 text-xs">
                      <span className="text-xl">🎶</span>
                      <div>
                        <strong className="text-slate-200 block">Nynna / Brumma</strong>
                        <span className="text-slate-400 leading-normal block mt-0.5">Vibrationerna i stämbanden stimulerar vagusnerven direkt i halsen. Nynna en lugn melodi i 1-2 minuter.</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* FOOTER SYSTEM NAVIGATION */}
      <footer className="absolute bottom-4 left-4 right-4 bg-[#0A1121]/95 backdrop-blur-xl border border-slate-800 rounded-2xl py-3.5 px-4 shadow-2xl flex justify-between items-center z-40">
        
        <button 
          onClick={() => { setActiveTab('dashboard'); setBreathingActive(false); }}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-amber-400 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[9px] font-bold tracking-wider uppercase">Hem</span>
        </button>

        <button 
          onClick={() => { setActiveTab('biff'); setBreathingActive(false); }}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'biff' ? 'text-amber-400 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-[9px] font-bold tracking-wider uppercase">Sköld</span>
        </button>

        {/* Tactical center SOS button */}
        <div className="relative -mt-8">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md animate-pulse"></div>
          <button 
            onClick={() => {
              setActiveTab('vagus');
              setBreathingActive(true);
              triggerToast("Vagus-andning initierad!");
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 border-2 border-[#05080E] flex items-center justify-center shadow-lg hover:scale-105 transition active:scale-95 z-20"
          >
            <Activity className="w-6 h-6 text-slate-950 animate-pulse" />
          </button>
        </div>

        <button 
          onClick={() => { setActiveTab('korsreferens'); setBreathingActive(false); }}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'korsreferens' ? 'text-emerald-400 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[9px] font-bold tracking-wider uppercase">Fakta</span>
        </button>

        <button 
          onClick={() => { setActiveTab('valvet'); setBreathingActive(false); }}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'valvet' ? 'text-amber-400 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Lock className="w-5 h-5" />
          <span className="text-[9px] font-bold tracking-wider uppercase">Valvet</span>
        </button>

      </footer>

    </div>
  );
}