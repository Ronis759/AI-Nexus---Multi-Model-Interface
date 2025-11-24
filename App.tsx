import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { ModelSelector } from './components/ModelSelector';
import { ChatInterface } from './components/ChatInterface';
import { ModelId } from './types';

const App: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<ModelId>(ModelId.GEMINI_3);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      {/* Decorative Background Gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[128px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[128px]"></div>
      </div>

      <Hero />
      
      <main className="container mx-auto px-4 pb-20">
        <ModelSelector 
          selectedModel={selectedModel} 
          onSelectModel={setSelectedModel} 
        />
        
        <ChatInterface selectedModel={selectedModel} />
      </main>
    </div>
  );
};

export default App;