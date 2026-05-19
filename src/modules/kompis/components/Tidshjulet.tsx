import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

export function Tidshjulet() {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center my-12">
      {/* Yttre ring - Framtid */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-slate-800 border-dashed"
      />
      
      {/* Mellanring - Nutid */}
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 rounded-full border border-kompass-gold/20"
      >
        <div className="absolute -top-1 left-1/2 w-2 h-2 bg-kompass-gold rounded-full shadow-[0_0_10px_2px_var(--tw-shadow-color)] shadow-kompass-gold/50"></div>
      </motion.div>

      {/* Inre ring - Dåtid (Kampspår) */}
      <motion.div 
        className="absolute inset-12 rounded-full border border-kompass-blue/50 bg-kompass-blue/10 backdrop-blur-sm"
      />

      {/* Navet */}
      <div className="relative z-10 w-20 h-20 rounded-full bg-kompass-dark border border-slate-700 flex items-center justify-center shadow-xl shadow-black/50">
        <Compass className="w-8 h-8 text-kompass-gold" />
      </div>

      {/* Data noder - Exempel på milstolpar */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_var(--tw-shadow-color)] shadow-emerald-400/80 z-20"></div>
      <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_var(--tw-shadow-color)] shadow-purple-400/80 z-20"></div>
    </div>
  );
}
