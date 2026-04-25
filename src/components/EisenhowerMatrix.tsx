import React from 'react';
import { EisenhowerQuadrant, Task } from '../types';
import TaskItem from './TaskItem';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Target, MinusCircle, Coffee } from 'lucide-react';

interface Props {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const quadrantConfig = {
  [EisenhowerQuadrant.URGENT_IMPORTANT]: {
    title: "Urgent & Important",
    subtitle: "Focus immédiat",
    icon: Zap,
    color: "accent-border border-red-900/20",
    iconColor: "text-red-500"
  },
  [EisenhowerQuadrant.NOT_URGENT_IMPORTANT]: {
    title: "Important & Non Urgent",
    subtitle: "Rigueur & Planning",
    icon: Target,
    color: "accent-border border-blue-900/20",
    iconColor: "text-blue-500"
  },
  [EisenhowerQuadrant.URGENT_NOT_IMPORTANT]: {
    title: "Urgent & Non Important",
    subtitle: "Délégation suggérée",
    icon: MinusCircle,
    color: "accent-border border-stone-800/40",
    iconColor: "text-stone-500"
  },
  [EisenhowerQuadrant.NOT_URGENT_NOT_IMPORTANT]: {
    title: "Minimaliste",
    subtitle: "Élimination active",
    icon: Coffee,
    color: "accent-border border-[#C5A059]/20",
    iconColor: "text-[#C5A059]/40"
  }
};

export default function EisenhowerMatrix({ tasks, onToggle, onDelete }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {Object.entries(quadrantConfig).map(([quad, config]) => {
        const quadrantTasks = tasks.filter(t => t.quadrant === quad);
        const Icon = config.icon;

        return (
          <div key={quad} className={`flex flex-col glass-card overflow-hidden shadow-2xl ${config.color}`}>
            <div className="p-6 flex items-center justify-between bg-white/[0.02]">
              <div>
                <h3 className="serif text-xl italic text-white flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                  {config.title}
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-stone-600 font-bold mt-1.5">{config.subtitle}</p>
              </div>
              <span className="text-xl font-serif italic text-gold/40">
                {String(quadrantTasks.length).padStart(2, '0')}
              </span>
            </div>
            <div className="p-5 flex-1 space-y-4 min-h-[220px]">
              <AnimatePresence mode="popLayout text-stone-500">
                {quadrantTasks.length > 0 ? (
                  quadrantTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggle={onToggle} 
                      onDelete={onDelete} 
                    />
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-stone-700 italic text-sm py-12 serif opacity-30 select-none">
                    Espace de calme
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
