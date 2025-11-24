import React from 'react';
import { Cpu, Sparkles, Zap, Rocket, Brain } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden pb-12 pt-20 sm:pb-16 sm:pt-24 lg:pb-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
              <Sparkles className="h-4 w-4" />
              <span>ИИ нового поколения уже здесь</span>
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 pb-2">
            Центр управления интеллектом
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            Мгновенно переключайтесь между самыми мощными моделями мира. 
            Испытайте Gemini 3.0, используйте ChatGPT, DeepSeek или общайтесь с Grok — всё в едином интерфейсе.
          </p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="glass-panel p-6 rounded-2xl hover:bg-white/5 transition-colors duration-300">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Cpu className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Gemini 3.0</h3>
            <p className="text-sm text-gray-400">Мультимодальное мышление с новейшей архитектурой от Google.</p>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl hover:bg-white/5 transition-colors duration-300">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <Zap className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">ChatGPT 4o</h3>
            <p className="text-sm text-gray-400">Оптимизирован для связных диалогов и написания кода.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl hover:bg-white/5 transition-colors duration-300">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Rocket className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Grok 2</h3>
            <p className="text-sm text-gray-400">Знания в реальном времени с бунтарским характером.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl hover:bg-white/5 transition-colors duration-300">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <Brain className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">DeepSeek R1</h3>
            <p className="text-sm text-gray-400">Феноменальная логика и решение сложных задач.</p>
          </div>
        </div>
      </div>

      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[800px] h-[600px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow"></div>
      </div>
    </div>
  );
};