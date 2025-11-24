import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { ModelSelector } from './components/ModelSelector';
import { ChatInterface } from './components/ChatInterface';
import { ModelId } from './types';

const App: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<ModelId>(ModelId.GEMINI_3);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden relative transition-colors duration-500">
      {/* Dynamic Animated Background - Dark Theme */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
         <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
         <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <Hero />
      
      <main className="container mx-auto px-4 pb-24 relative z-10">
        <ModelSelector 
          selectedModel={selectedModel} 
          onSelectModel={setSelectedModel}
        />
        
        <div className="mt-8 transition-all duration-500 ease-in-out">
          <ChatInterface 
            selectedModel={selectedModel} 
          />
        </div>
      </main>
    </div>
  );
};

export default App;