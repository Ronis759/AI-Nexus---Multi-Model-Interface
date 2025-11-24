import React, { useState, useRef, useEffect } from 'react';
import { Send, StopCircle, User, Bot, Loader2 } from 'lucide-react';
import { ModelId, Message, MODEL_CONFIGS } from '../types';
import { generateStreamResponse } from '../services/geminiService';

interface ChatInterfaceProps {
  selectedModel: ModelId;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedModel }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const assistantMessageId = (Date.now() + 1).toString();
      // Placeholder for stream
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
          modelUsed: selectedModel,
        },
      ]);

      // Convert current messages to history format for API
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const stream = generateStreamResponse(userMessage.content, selectedModel, history);
      
      let fullResponse = '';
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === assistantMessageId 
              ? { ...msg, content: fullResponse } 
              : msg
          )
        );
      }

    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'system',
          content: "Извините, произошла ошибка при обработке вашего запроса.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const renderMessageContent = (text: string) => {
    // Basic formatted rendering
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const activeConfig = MODEL_CONFIGS[selectedModel];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[600px] glass-panel rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative">
      
      {/* Chat Header */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-50"></div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-8">
            <div className={`p-4 rounded-full bg-gray-800/50 mb-4 animate-pulse`}>
              <Bot className={`w-8 h-8 ${activeConfig.iconColor}`} />
            </div>
            <p className="text-lg font-medium text-gray-300">Готовы начать работу с {activeConfig.label}?</p>
            <p className="text-sm max-w-md mt-2 opacity-60">Спросите что-нибудь о коде, науке или творчестве.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role !== 'user' && (
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 ${
                  msg.modelUsed ? MODEL_CONFIGS[msg.modelUsed].iconColor.replace('text-', 'bg-').replace('400', '500/20') : 'bg-gray-700'
                }`}>
                <Bot className={`w-5 h-5 ${msg.modelUsed ? MODEL_CONFIGS[msg.modelUsed].iconColor : 'text-gray-400'}`} />
              </div>
            )}
            
            <div
              className={`
                max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-blue-600 text-white ml-12 rounded-tr-sm' 
                  : 'bg-gray-800/80 text-gray-100 mr-12 rounded-tl-sm border border-gray-700/50'
                }
                ${msg.role === 'system' ? 'bg-red-900/20 text-red-300 border-red-900/30' : ''}
              `}
            >
               {renderMessageContent(msg.content)}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center shrink-0 mt-1">
                <User className="w-5 h-5 text-gray-300" />
              </div>
            )}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-4 justify-start animate-pulse">
             <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 bg-gray-800`}>
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              </div>
              <div className="bg-gray-800/50 rounded-2xl px-5 py-4 rounded-tl-sm">
                 <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                 </div>
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-900/80 border-t border-gray-800 backdrop-blur-md">
        <form 
          onSubmit={handleSubmit}
          className={`
            relative flex items-end gap-2 p-2 rounded-2xl border transition-all duration-300
            bg-gray-950/50 focus-within:bg-gray-950
            ${activeConfig.borderColor} focus-within:ring-1 focus-within:ring-indigo-500/30
          `}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Спросите ${activeConfig.label} о чем-нибудь...`}
            className="w-full bg-transparent text-gray-100 placeholder-gray-500 text-sm p-3 max-h-32 resize-none focus:outline-none custom-scrollbar"
            rows={1}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`
              p-3 rounded-xl transition-all duration-200 shrink-0 mb-0.5
              ${!input.trim() || isLoading 
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                : `bg-gradient-to-br ${activeConfig.gradient} text-white shadow-lg hover:opacity-90 hover:scale-105`
              }
            `}
          >
            {isLoading ? <StopCircle className="w-5 h-5" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
        <div className="text-center mt-2">
          <p className="text-[10px] text-gray-600">
            ИИ может ошибаться. Проверяйте важную информацию.
          </p>
        </div>
      </div>
    </div>
  );
};