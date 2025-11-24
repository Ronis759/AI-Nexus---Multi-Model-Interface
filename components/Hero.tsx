import React from 'react';
import { Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-visible pb-8 pt-16 sm:pt-20 lg:pb-12">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="mx-auto max-w-4xl animate-slide-up">
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-sm font-medium text-indigo-300 ring-1 ring-inset ring-white/10 hover:bg-white/10 transition-colors cursor-default backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Мультимодальный интеллект 3.0</span>
            </span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl drop-shadow-2xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-white to-blue-100">
              Эпицентр
            </span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
               Искусственного Интеллекта
            </span>
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-300 max-w-2xl mx-auto">
            Ваш единый интерфейс для взаимодействия с передовыми нейросетями. 
            Сравнивайте, тестируйте и создавайте с Gemini 3, ChatGPT, Grok, Claude и DeepSeek.
          </p>
        </div>
      </div>
    </div>
  );
};