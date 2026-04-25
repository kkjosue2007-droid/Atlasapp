import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { Task, TaskPriority } from '../types';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  key?: string | number;
}

const priorityColors = {
  [TaskPriority.LOW]: 'text-stone-500 border-stone-800 bg-stone-900/50',
  [TaskPriority.MEDIUM]: 'text-blue-400 border-blue-900/30 bg-blue-950/20',
  [TaskPriority.HIGH]: 'text-[#C5A059] border-[#C5A059]/30 bg-[#C5A059]/5',
  [TaskPriority.CRITICAL]: 'text-red-400 border-red-900/30 bg-red-950/20',
};

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${
        task.completed 
          ? 'bg-white/[0.01] border-white/5 opacity-40 grayscale' 
          : 'bg-white/[0.04] border-white/10 hover:border-white/20 hover:bg-white/[0.06] shadow-2xl shadow-black/40'
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className="transition-all duration-300 transform hover:scale-110"
      >
        {task.completed ? (
          <CheckCircle2 className="w-6 h-6 text-[#C5A059]" />
        ) : (
          <Circle className="w-6 h-6 text-stone-700 hover:text-stone-500" />
        )}
      </button>

      <div className="flex-1">
        <h3 className={`font-semibold leading-snug tracking-tight ${task.completed ? 'line-through text-stone-600 italic' : 'text-stone-200'}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-xs text-stone-500 mt-1 font-medium italic">
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-3">
          {task.time && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-stone-500 uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5 text-gold/50" />
              {task.time}
            </span>
          )}
          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest border transition-colors ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-stone-600 hover:text-red-400 transition-all rounded-lg"
      >
        <AlertCircle className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
