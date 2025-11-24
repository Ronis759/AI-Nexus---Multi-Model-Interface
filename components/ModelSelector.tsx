import React from 'react';
import { ModelId, MODEL_CONFIGS } from '../types';
import { Bot, Rocket, Sparkles, Brain, CheckCircle2, Zap, MessageSquareQuote } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: ModelId;
  onSelectModel: (model: ModelId) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onSelectModel }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {(Object.keys(MODEL_CONFIGS) as ModelId[]).map((id) => {
          const config = MODEL_CONFIGS[id];
          const isSelected = selectedModel === id;
          
          let Icon = Bot;
          if (id === ModelId.GEMINI_3) Icon = Sparkles;
          if (id === ModelId.GROK) Icon = Rocket;
          if (id === ModelId.DEEPSEEK) Icon = Brain;
          if (id === ModelId.CHATGPT) Icon = Zap;
          if (id === ModelId.CLAUDE) Icon = MessageSquareQuote;

          return (
            <button
              key={id}
              onClick={() => onSelectModel(id)}
              className={`
                relative group flex items-center p-4 rounded-2xl transition-all duration-300 text-left border overflow-hidden
                ${isSelected 
                  ? `${config.selectionBg} ${config.borderColor} ${config.shadowColor} shadow-lg scale-[1.02] border-2` 
                  : `bg-gray-900/40 border-gray-800 hover:bg-gray-800/60 hover:border-gray-600 hover:-translate-y-1`
                }
              `}
            >
              {/* Animated Background Gradient for Active State */}
              {isSelected && (
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${config.gradient} opacity-5 -z-10`} />
              )}
              
              {/* Subtle accent border on the left for inactive items */}
              {!isSelected && (
                 <div className={`absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              )}

              <div className={`
                p-3 rounded-xl transition-all duration-300 shrink-0 mr-4 shadow-inner relative
                ${isSelected ? 'bg-white/10 ring-1 ring-white/20' : 'bg-gray-800 group-hover:bg-gray-750'}
              `}>
                <Icon className={`w-6 h-6 ${config.iconColor} transition-transform duration-300 group-hover:scale-[2.0]`} />
              </div>

              <div className="flex-1 overflow-hidden relative z-10">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-base font-bold truncate ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                    {config.label}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className={`w-4 h-4 ${config.iconColor}`} />
                  )}
                </div>
                <p className={`text-xs truncate transition-colors ${isSelected ? 'text-gray-200' : 'text-gray-500'}`}>
                   {isSelected ? 'Активен' : 'Выбрать'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};