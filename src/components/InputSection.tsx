import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles, Loader2 } from 'lucide-react';

interface Props {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export default function InputSection({ onSubmit, isLoading }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <div className="mb-20">
      <form onSubmit={handleSubmit} className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Exprimez vos intentions... Atlas structurera le reste."
          className="w-full min-h-[180px] p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] focus:border-gold/30 focus:bg-white/[0.04] outline-none transition-all resize-none text-stone-200 placeholder:text-stone-700 font-medium text-lg"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="absolute bottom-6 right-6 flex items-center gap-5">
          <div className="flex flex-col items-end mr-2 opacity-40 group-focus-within:opacity-100 transition-opacity">
            <span className="text-[9px] uppercase tracking-[0.4em] font-black text-gold">Engine v1.02</span>
            <span className="text-[8px] text-stone-600 font-bold tracking-widest mt-0.5 uppercase">Sync Processing</span>
          </div>
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`flex items-center justify-center w-14 h-14 rounded-2xl transition-all ${
              !text.trim() || isLoading
                ? 'bg-stone-900 text-stone-700 cursor-not-allowed border border-white/5'
                : 'bg-white text-black shadow-2xl hover:scale-105 active:scale-95 cursor-pointer font-bold'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="absolute -top-4 -left-4">
          <div className="p-3 bg-gold text-black rounded-full shadow-2xl animate-pulse">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </form>
    </div>
  );
}
