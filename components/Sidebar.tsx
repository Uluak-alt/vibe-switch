import React from 'react';
import { Personality } from '../types';
import { PERSONALITIES } from '../constants';

interface SidebarProps {
  activePersonality: Personality;
  onSelectPersonality: (p: Personality) => void;
  isProcessing: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePersonality, onSelectPersonality, isProcessing }) => {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col border-r border-slate-700 h-full shadow-xl z-20">
      <div className="p-4 border-b border-slate-700 bg-slate-800">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-blue-400">⚡</span> Vibe Switch
        </h2>
        <p className="text-xs text-slate-400 mt-1">Prompt Enhancer Extension</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2 mt-2">
          Select Personality
        </h3>
        <div className="space-y-1">
          {PERSONALITIES.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectPersonality(p)}
              disabled={isProcessing}
              className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-all ${
                activePersonality.id === p.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-slate-800 text-slate-300'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="text-xl">{p.icon}</span>
              <div>
                <div className="font-medium text-sm">{p.name}</div>
                <div className="text-[10px] opacity-70 leading-tight line-clamp-1">
                  {p.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-800/50">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Status: Active on chatgpt.com
        </div>
      </div>
    </div>
  );
};