import React from 'react';
import { ModelId, MODEL_CONFIGS } from '../types';
import { Bot, Rocket, Sparkles, Brain } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: ModelId;
  onSelectModel: (model: ModelId) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onSelectModel }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full max-w-5xl mx-auto px-4">
      {(Object.keys(MODEL_CONFIGS) as ModelId[]).map((id) => {
        const config = MODEL_CONFIGS[id];
        const isSelected = selectedModel === id;
        
        let Icon = Bot;
        if (id === ModelId.GEMINI_3) Icon = Sparkles;
        if (id === ModelId.GROK) Icon = Rocket;
        if (id === ModelId.DEEPSEEK) Icon = Brain;

        return (
          <button
            key={id}
            onClick={() => onSelectModel(id)}
            className={`
              relative flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 w-full text-left group
              ${isSelected 
                ? `bg-gray-800/80 ${config.borderColor} shadow-[0_0_20px_rgba(0,0,0,0.3)] ring-1 ring-white/10` 
                : 'bg-gray-900/40 border-transparent hover:bg-gray-800/60 hover:border-gray-700'
              }
            `}
          >
            <div className={`
              p-2.5 rounded-lg transition-all duration-300 shrink-0
              ${isSelected ? 'bg-white/10' : 'bg-gray-800 group-hover:bg-gray-700'}
            `}>
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                {config.label}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {isSelected ? 'Активен' : 'Выбрать'}
              </span>
            </div>
            
            {/* Active Indicator Dot */}
            {isSelected && (
              <div className="absolute top-1/2 right-4 -translate-y-1/2">
                 <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-gradient-to-r ${config.gradient}`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r ${config.gradient}`}></span>
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};