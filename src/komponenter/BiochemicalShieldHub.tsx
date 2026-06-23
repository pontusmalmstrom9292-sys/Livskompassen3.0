import React, { useState } from 'react';
import { usePansarStore } from '@/modules/core/store/usePansarStore';
import {
  Brain,
  Droplets,
  Apple,
  Wind,
  Activity,
  ShieldAlert,
  ShoppingCart,
  Battery,
  BatteryMedium,
  BatteryWarning,
  HeartPulse,
} from 'lucide-react';

// --- TYPER ---
type NutritionTab = 'intag' | 'krasch' | 'inkop';
type SomaticTab = 'vagus' | 'andning' | 'rsd';

export const BiochemicalShieldHub: React.FC = () => {
  // --- STATE ---
  const [activeNutritionTab, setActiveNutritionTab] = useState<NutritionTab>('intag');
  const [activeSomaticTab, setActiveSomaticTab] = useState<SomaticTab>('vagus');
  const [energyLevel, setEnergyLevel] = useState<number>(80);
  const [bloodSugarStable, setBloodSugarStable] = useState<boolean>(true);

  // --- MOCK FIREBASE SAVE (Byt ut mot din faktiska Firestore-hook senare) ---
  const logIntake = (type: string) => {
    console.log(`Sparar till Firestore: ${type} loggad kl ${new Date().toLocaleTimeString()}`);
    // Exempel: await addDoc(collection(db, 'biometrics'), { type, timestamp: new Date() });
  };

  const activatePansar = usePansarStore((state) => state.activate);

  const triggerPansarlage = () => {
    console.log('Låg energi/blodsocker detekterat. Triggar globalt Pansarläge...');
    activatePansar();
  };

  return (
    <div className="w-full h-full min-h-screen bg-slate-950 p-4 flex flex-col items-center justify-center font-sans text-slate-200">

      {/* Huvudcontainer - Max 3 Bento-kort, ingen skrollning */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* KORT 1: NEURO-KOST & VÄTSKA */}
        <div className="col-span-1 md:col-span-2 bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-lg shadow-indigo-900/10 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h2 className="text-lg font-semibold text-indigo-400 flex items-center gap-2">
              <Brain size={20} />
              Neuro-Biokemi
            </h2>
            {/* Interna flikar */}
            <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveNutritionTab('intag')}
                className={`px-3 py-1 text-xs rounded-md transition-all ${activeNutritionTab === 'intag' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Intag
              </button>
              <button
                type="button"
                onClick={() => setActiveNutritionTab('krasch')}
                className={`px-3 py-1 text-xs rounded-md transition-all ${activeNutritionTab === 'krasch' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Krasch-Prep
              </button>
              <button
                type="button"
                onClick={() => setActiveNutritionTab('inkop')}
                className={`px-3 py-1 text-xs rounded-md transition-all ${activeNutritionTab === 'inkop' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Inköp
              </button>
            </div>
          </div>

          {/* Innehåll baserat på flik */}
          <div className="flex-grow flex flex-col justify-center">
            {activeNutritionTab === 'intag' && (
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => logIntake('vatten')}
                  className="flex flex-col items-center justify-center p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-blue-500/50 transition-colors group"
                >
                  <Droplets className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" size={28} />
                  <span className="text-xs text-slate-400">Vatten + Salt</span>
                </button>
                <button
                  type="button"
                  onClick={() => logIntake('protein')}
                  className="flex flex-col items-center justify-center p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-rose-500/50 transition-colors group"
                >
                  <Apple className="text-rose-400 mb-2 group-hover:scale-110 transition-transform" size={28} />
                  <span className="text-xs text-slate-400">Protein (Dopamin)</span>
                </button>
                <button
                  type="button"
                  onClick={() => logIntake('kolhydrater')}
                  className="flex flex-col items-center justify-center p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-amber-500/50 transition-colors group"
                >
                  <Activity className="text-amber-400 mb-2 group-hover:scale-110 transition-transform" size={28} />
                  <span className="text-xs text-slate-400">Komplexa Kolh.</span>
                </button>
              </div>
            )}

            {activeNutritionTab === 'krasch' && (
              <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4">
                <h3 className="text-amber-400 text-sm font-medium mb-2 flex items-center gap-2">
                  <ShieldAlert size={16} /> Akut Stabilisering
                </h3>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
                    <span>Drick 3 dl vatten med en nypa havssalt (stödjer binjurarna).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
                    <span>Ät en näve valnötter eller mandlar (snabbt blodsockerstöd utan spik).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
                    <span>Ta Omega-3 / Magnesium om det är kväll.</span>
                  </li>
                </ul>
              </div>
            )}

            {activeNutritionTab === 'inkop' && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="text-emerald-400" size={24} />
                  <div>
                    <p className="text-sm font-medium text-slate-200">ADHD-Optimerad Baslista</p>
                    <p className="text-xs text-slate-500">Ägg, Avokado, Blåbär, Nötter, Havregryn</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                >
                  Kopiera till urklipp
                </button>
              </div>
            )}
          </div>
        </div>

        {/* KORT 2: SOMATISK ÅTERSTÄLLNING */}
        <div className="col-span-1 bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-lg shadow-emerald-900/10 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h2 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
              <HeartPulse size={20} />
              Somatisk Hub
            </h2>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <button
              type="button"
              onClick={() => setActiveSomaticTab('vagus')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${activeSomaticTab === 'vagus' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border border-slate-800 text-slate-400 hover:border-slate-700'}`}
            >
              <span>Vagusnerv-stimulans</span>
              <Activity size={14} />
            </button>
            <button
              type="button"
              onClick={() => setActiveSomaticTab('andning')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${activeSomaticTab === 'andning' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border border-slate-800 text-slate-400 hover:border-slate-700'}`}
            >
              <span>Fysiologisk Suck</span>
              <Wind size={14} />
            </button>
            <button
              type="button"
              onClick={() => setActiveSomaticTab('rsd')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${activeSomaticTab === 'rsd' ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300' : 'bg-slate-950 border border-slate-800 text-slate-400 hover:border-slate-700'}`}
            >
              <span>RSD Akut-Grounding</span>
              <ShieldAlert size={14} />
            </button>
          </div>

          <div className="flex-grow bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-center justify-center text-center">
            {activeSomaticTab === 'vagus' && (
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-emerald-400 block mb-1">Dykreflexen:</strong>
                Skvätt iskallt vatten i ansiktet, eller håll en isbit mot bröstbenet i 30 sekunder. Detta tvingar nervsystemet att sänka hjärtfrekvensen.
              </p>
            )}
            {activeSomaticTab === 'andning' && (
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-emerald-400 block mb-1">Huberman-sucken:</strong>
                Ta två snabba inandningar genom näsan (fyll lungorna helt). Andas ut långsamt genom munnen. Repetera 3 gånger för att omedelbart sänka koldioxidnivån och stressen.
              </p>
            )}
            {activeSomaticTab === 'rsd' && (
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-rose-400 block mb-1">5-4-3-2-1 Metoden:</strong>
                Nämn högt: 5 saker du ser, 4 du kan röra, 3 du hör, 2 du luktar, 1 du smakar. Du är säker. Det är en känsla, inte ett faktum.
              </p>
            )}
          </div>
        </div>

        {/* KORT 3: BIOMETRISK RADAR */}
        <div className="col-span-1 md:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="p-3 bg-slate-950 rounded-full border border-slate-800">
              {energyLevel > 60 ? (
                <Battery className="text-emerald-400" size={24} />
              ) : energyLevel > 30 ? (
                <BatteryMedium className="text-amber-400" size={24} />
              ) : (
                <BatteryWarning className="text-rose-400" size={24} />
              )}
            </div>
            <div className="flex-grow">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-slate-400">Kognitivt Batteri</span>
                <span className="text-xs font-medium text-slate-400">{energyLevel}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={energyLevel}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setEnergyLevel(val);
                  if (val < 30) triggerPansarlage();
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                aria-label="Kognitivt batteri"
              />
            </div>
          </div>

          <div className="w-full md:w-px md:h-12 bg-slate-800 hidden md:block" />

          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <span className="text-sm text-slate-400">Blodsocker-status:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBloodSugarStable(true)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${bloodSugarStable ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-950 text-slate-500 border border-slate-800'}`}
              >
                Stabilt
              </button>
              <button
                type="button"
                onClick={() => {
                  setBloodSugarStable(false);
                  triggerPansarlage();
                }}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${!bloodSugarStable ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-950 text-slate-500 border border-slate-800'}`}
              >
                Svajigt
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
