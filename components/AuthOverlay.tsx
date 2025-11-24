import React, { useState } from 'react';
import { ModelId, MODEL_CONFIGS } from '../types';
import { Loader2, Shield, Key, Bot, Rocket, Sparkles, Brain, Zap } from 'lucide-react';

interface AuthOverlayProps {
  modelId: ModelId;
  onAuthorize: () => void;
}

export const AuthOverlay: React.FC<AuthOverlayProps> = ({ modelId, onAuthorize }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  const config = MODEL_CONFIGS[modelId];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Fake network request simulation
    setTimeout(() => {
      setIsLoading(false);
      onAuthorize();
    }, 1500);
  };

  let Icon = Bot;
  if (modelId === ModelId.GEMINI_3) Icon = Sparkles;
  if (modelId === ModelId.GROK) Icon = Rocket;
  if (modelId === ModelId.DEEPSEEK) Icon = Brain;
  if (modelId === ModelId.CHATGPT) Icon = Zap;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-md transition-all duration-500" />
      
      <div className={`
        relative w-full max-w-md p-8 rounded-3xl border shadow-2xl overflow-hidden
        bg-gray-900/90 ${config.borderColor}
        transform transition-all duration-500 scale-100 animate-fade-in
      `}>
         {/* Background Glow Effects */}
         <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${config.gradient}`} />
         <div className={`absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${config.gradient}`} />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className={`
            w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg
            bg-gray-800/80 border ${config.borderColor}
          `}>
             <Icon className={`w-10 h-10 ${config.iconColor}`} />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Вход в {config.label}
          </h2>
          <p className="text-gray-400 mb-8 text-sm">
            Для доступа к нейросети необходима авторизация.
          </p>

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div className="space-y-2 text-left">
              <label className="text-xs font-medium text-gray-400 ml-1">API Ключ (Симуляция)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className={`
                    w-full pl-10 pr-4 py-3 bg-gray-950/50 border border-gray-700 rounded-xl 
                    focus:ring-2 focus:ring-opacity-50 focus:outline-none text-white placeholder-gray-600 
                    transition-all focus:border-transparent ${config.ringColor}
                  `}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3.5 px-4 rounded-xl font-medium text-white shadow-lg transition-all duration-300
                flex items-center justify-center gap-2
                bg-gradient-to-r ${config.gradient}
                hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-70 disabled:cursor-not-allowed
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Подключение...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Авторизоваться</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-[10px] text-gray-600 uppercase tracking-widest">
            Режим симуляции • Безопасное соединение
          </p>
        </div>
      </div>
    </div>
  );
};
