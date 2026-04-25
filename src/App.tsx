import React, { useState, useEffect } from 'react';
import { Task, AtlasState, DailyBriefing } from './types';
import { extractTasks, generateBriefing } from './services/geminiService';
import InputSection from './components/InputSection';
import BriefingSection from './components/BriefingSection';
import EisenhowerMatrix from './components/EisenhowerMatrix';
import { Sparkles, Calendar, Layers, Search, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_KEY = 'atlas_app_state';

const initialState: AtlasState = {
  tasks: [],
  briefing: null,
  lastUpdate: Date.now()
};

export default function App() {
  const [state, setState] = useState<AtlasState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleInputSubmit = async (text: string) => {
    setIsLoading(true);
    try {
      const newTasksData = await extractTasks(text);
      const newTasks: Task[] = newTasksData.map((t: any) => ({
        ...t,
        id: Math.random().toString(36).substring(2, 9),
        completed: false,
        createdAt: Date.now()
      }));

      const updatedTasks = [...state.tasks, ...newTasks];
      setState(prev => ({ 
        ...prev, 
        tasks: updatedTasks,
        lastUpdate: Date.now() 
      }));

      updateBriefing(updatedTasks);
    } catch (error) {
      console.error("Workflow failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBriefing = async (currentTasks: Task[]) => {
    if (currentTasks.length === 0) return;
    setIsBriefingLoading(true);
    try {
      const briefing = await generateBriefing(currentTasks.filter(t => !t.completed));
      if (briefing) {
        setState(prev => ({ ...prev, briefing }));
      }
    } finally {
      setIsBriefingLoading(false);
    }
  };

  const toggleTask = (id: string) => {
    const updatedTasks = state.tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setState(prev => ({ ...prev, tasks: updatedTasks }));
  };

  const deleteTask = (id: string) => {
    const updatedTasks = state.tasks.filter(t => t.id !== id);
    setState(prev => ({ ...prev, tasks: updatedTasks }));
  };

  const clearAll = () => {
    if (window.confirm("Tout réinitialiser ? Cela supprimera toutes vos tâches.")) {
      setState(initialState);
    }
  };

  const activeTasks = state.tasks.filter(t => !t.completed);
  const criticalTasks = activeTasks.filter(t => t.priority === 'CRITICAL');

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-stone-300">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 border-r border-stone-800 flex-col p-10 fixed h-full bg-[#0A0A0A]">
        <div className="mb-16">
          <h2 className="serif text-3xl italic text-white tracking-tight">Atlas</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mt-2 font-bold">Système Opérationnel</p>
        </div>
        
        <nav className="space-y-8 flex-1">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-stone-600 font-bold">Navigation</span>
            <div className="space-y-1">
              <a href="#" className="flex items-center gap-3 text-white accent-border pl-4 py-2 text-sm font-medium bg-white/[0.03] rounded-r-xl transition-all">
                <Layers className="w-4 h-4 text-gold" />
                Tableau de Bord
              </a>
              <a href="#" className="flex items-center gap-3 hover:text-white pl-4 py-2 text-sm font-medium transition-all text-stone-500 hover:bg-stone-900 rounded-r-xl">
                <Calendar className="w-4 h-4" />
                Calendrier
              </a>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-stone-900">
            <span className="text-[10px] uppercase tracking-widest text-stone-600 font-bold">Missions</span>
            <div className="space-y-3 px-4">
              <div className="flex justify-between items-center text-xs">
                <span>Tâches actives</span>
                <span className="text-white font-bold">{activeTasks.length}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Priorité Critique</span>
                <span className="text-gold font-bold">{criticalTasks.length}</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="mt-auto">
          <div className="p-4 glass-card border-gold/10 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-gold/50" />
             </div>
             <div>
                <p className="text-xs font-bold text-white">Utilisateur Atlas</p>
                <p className="text-[10px] text-stone-500 italic">Version Premium</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-6 md:p-12 transition-all">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <h1 className="serif text-5xl md:text-6xl text-white mb-4 tracking-tight">Bienvenue chez vous.</h1>
            <p className="text-stone-500 max-w-lg leading-relaxed text-lg">
              Ajustez votre environnement pour qu'il reflète votre état d'esprit actuel via <span className="text-stone-300 italic font-medium">l'Engine Atlas</span>.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="glass-card px-5 py-3 flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gold" />
                <span className="text-sm font-bold text-stone-400 capitalize whitespace-nowrap">
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
             </div>
             <button 
                onClick={clearAll}
                className="glass-card px-5 py-3 text-[10px] uppercase tracking-widest hover:bg-stone-900 transition-all font-bold"
              >
                Reset
             </button>
          </div>
        </header>

        <div className="max-w-5xl">
          <InputSection onSubmit={handleInputSubmit} isLoading={isLoading} />
          
          <BriefingSection briefing={state.briefing} isLoading={isBriefingLoading} />

          <div className="mt-20">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="serif text-3xl italic text-white pr-4 border-r border-stone-800">
                Matrice d'Ambiance
              </h2>
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-[0.3em]">
                Flux de Données Actif
              </span>
            </div>

            <EisenhowerMatrix 
              tasks={state.tasks} 
              onToggle={toggleTask} 
              onDelete={deleteTask} 
            />
          </div>
        </div>

        <footer className="mt-32 pb-12 border-t border-stone-900 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] uppercase tracking-[0.2em] text-stone-600 font-bold">
          <div className="flex gap-10">
            <span className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gold rounded-full" />
              Statut: Optimisé
            </span>
            <span>Mode: Privé</span>
          </div>
          <p>© {new Date().getFullYear()} Atlas Intelligence Studio</p>
        </footer>
      </main>
    </div>
  );
}
