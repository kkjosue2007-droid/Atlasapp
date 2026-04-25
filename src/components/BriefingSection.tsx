import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Lightbulb, Sparkles } from 'lucide-react';
import { DailyBriefing } from '../types';

interface Props {
  briefing: DailyBriefing | null;
  isLoading: boolean;
}

export default function BriefingSection({ briefing, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-40 bg-white/[0.02] border border-white/5 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!briefing) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-8 glass-card accent-border border-stone-800 relative overflow-hidden group hover:border-white/20 transition-all duration-500"
      >
        <div className="absolute -top-4 -right-4 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700">
          <Sun className="w-24 h-24" />
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-white/[0.03] text-stone-500 rounded-lg group-hover:text-gold transition-colors">
            <Sun className="w-5 h-5 transition-transform group-hover:rotate-45 duration-700" />
          </div>
          <h3 className="serif text-sm italic text-stone-500 uppercase tracking-widest font-bold">Aube</h3>
        </div>
        <p className="text-stone-300 leading-[1.8] font-medium tracking-tight">
          {briefing.morningBriefing}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-8 glass-card border-stone-800 relative overflow-hidden group hover:border-white/20 transition-all duration-500"
      >
        <div className="absolute -top-4 -right-4 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700">
          <Moon className="w-24 h-24" />
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-white/[0.03] text-stone-500 rounded-lg group-hover:text-stone-300 transition-colors">
            <Moon className="w-5 h-5 transition-transform group-hover:-translate-y-1 duration-700" />
          </div>
          <h3 className="serif text-sm italic text-stone-500 uppercase tracking-widest font-bold">Crépuscule</h3>
        </div>
        <p className="text-stone-300 leading-[1.8] font-medium tracking-tight">
          {briefing.eveningReview}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="p-8 glass-card border-gold/20 bg-gold/[0.02] relative overflow-hidden group hover:bg-gold/[0.04] transition-all duration-500"
      >
        <div className="absolute -top-4 -right-4 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 text-gold">
          <Lightbulb className="w-24 h-24" />
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gold/10 text-gold rounded-lg group-hover:scale-110 transition-transform">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="serif text-sm italic text-stone-500 uppercase tracking-widest font-bold">Inspiration</h3>
        </div>
        <div className="flex gap-4">
          <Sparkles className="w-4 h-4 text-gold/60 flex-shrink-0 mt-1" />
          <p className="text-stone-200 leading-[1.8] font-semibold italic tracking-tight">
            {briefing.efficiencyTip}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
