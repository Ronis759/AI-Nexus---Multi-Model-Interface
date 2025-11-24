import React, { useState, useRef, useEffect } from 'react';
import { Send, StopCircle, User, Bot, Sparkles, Rocket, Brain, Zap, MessageSquareQuote } from 'lucide-react';
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
  const activeConfig = MODEL_CONFIGS[selectedModel];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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
      modelUsed: undefined 
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const assistantMessageId = (Date.now() + 1).toString();
      
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
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const getModelIcon = (id: ModelId) => {
    switch (id) {
      case ModelId.GEMINI_3: return Sparkles;
      case ModelId.GROK: return Rocket;
      case ModelId.DEEPSEEK: return Brain;
      case ModelId.CHATGPT: return Zap;
      case ModelId.CLAUDE: return MessageSquareQuote;
      default: return Bot;
    }
  };

  const ActiveIcon = getModelIcon(selectedModel);

  return (
    <div className={`
      relative w-full max-w-5xl mx-auto flex flex-col h-[650px] 
      glass-panel rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 
      border-2 ${activeConfig.borderColor}
      ${activeConfig.shadowColor}
    `}>
      
      {/* Top Bar / Header */}
      <div className={`
        flex items-center justify-between px-6 py-4 
        bg-gray-950/80 backdrop-blur-md border-b border-gray-800
      `}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gray-900 border ${activeConfig.borderColor} ${activeConfig.iconColor}`}>
             <ActiveIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-base font-bold tracking-wide ${activeConfig.iconColor.replace('text-', 'text-')}`}>
              {activeConfig.label}
            </h2>
            <p className="text-xs text-gray-400">
              Онлайн
            </p>
          </div>
        </div>
        <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></span>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className={`
        flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth custom-scrollbar relative
        ${activeConfig.selectionBg.replace('bg-', 'bg-gradient-to-b from-gray-950 to-')}
      `}>
        {/* Subtle background logo/watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05]">
           <ActiveIcon className={`w-64 h-64 ${activeConfig.iconColor}`} />
        </div>

        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-8 animate-fade-in z-10 relative">
            <div className={`
              p-6 rounded-3xl mb-6 shadow-2xl border-2 
              ${activeConfig.selectionBg} ${activeConfig.borderColor} ${activeConfig.shadowColor}
            `}>
              <ActiveIcon className={`w-12 h-12 ${activeConfig.iconColor}`} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Привет! Я {activeConfig.label}</h3>
            <p className="text-base max-w-md text-gray-300">
               {MODEL_CONFIGS[selectedModel].description}
            </p>
          </div>
        )}
        
        {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isSystem = msg.role === 'system';
            // Use saved model for history messages, otherwise current
            const modelUsed = msg.modelUsed || selectedModel;
            const modelConfig = MODEL_CONFIGS[modelUsed];
            const MsgIcon = isUser ? User : getModelIcon(modelUsed);

            return (
              <div
                key={msg.id}
                className={`flex gap-4 animate-slide-up ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-lg
                    ${isSystem ? 'bg-red-900/50' : `bg-gray-900 border ${modelConfig.borderColor}`}
                  `}>
                    <MsgIcon className={`w-6 h-6 ${isSystem ? 'text-red-400' : modelConfig.iconColor}`} />
                  </div>
                )}
                
                <div
                  className={`
                    max-w-[85%] sm:max-w-[75%] rounded-2xl px-6 py-4 text-base leading-7 shadow-xl backdrop-blur-md border
                    ${isUser 
                      ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-tr-sm border-gray-600' 
                      : `${modelConfig.messageBg} ${modelConfig.messageBorder} ${modelConfig.textColor} rounded-tl-sm shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)]`
                    }
                    ${isSystem ? 'bg-red-900/20 text-red-200 border-red-900/50' : ''}
                  `}
                >
                   {renderMessageContent(msg.content)}
                </div>

                {isUser && (
                  <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-600 flex items-center justify-center shrink-0 mt-1 shadow-lg">
                    <User className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>
            );
        })}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-4 justify-start animate-pulse pl-1">
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 bg-gray-900 border ${activeConfig.borderColor}`}>
                <ActiveIcon className={`w-5 h-5 ${activeConfig.iconColor} animate-spin`} />
              </div>
              <div className={`rounded-2xl px-6 py-5 rounded-tl-sm ${activeConfig.messageBg} border ${activeConfig.messageBorder}`}>
                 <div className="flex gap-2 items-center h-full">
                    <span className={`w-2 h-2 rounded-full ${activeConfig.iconColor.replace('text-', 'bg-')} animate-bounce`} style={{ animationDelay: '0ms' }}></span>
                    <span className={`w-2 h-2 rounded-full ${activeConfig.iconColor.replace('text-', 'bg-')} animate-bounce`} style={{ animationDelay: '150ms' }}></span>
                    <span className={`w-2 h-2 rounded-full ${activeConfig.iconColor.replace('text-', 'bg-')} animate-bounce`} style={{ animationDelay: '300ms' }}></span>
                 </div>
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-5 bg-gray-950/80 backdrop-blur-xl border-t ${activeConfig.borderColor.replace('border-', 'border-opacity-30 border-')}`}>
        <form 
          onSubmit={handleSubmit}
          className={`
            relative flex items-end gap-3 p-2 rounded-2xl border transition-all duration-300
            bg-gray-900/50 hover:bg-gray-900/90 focus-within:bg-gray-950
            ${activeConfig.borderColor} focus-within:ring-2 ${activeConfig.ringColor} focus-within:ring-opacity-50
          `}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Задайте вопрос ${activeConfig.label}...`}
            className="w-full bg-transparent text-gray-100 placeholder-gray-500 text-base p-3 max-h-32 resize-none focus:outline-none custom-scrollbar"
            rows={1}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`
              p-3.5 rounded-xl transition-all duration-300 shrink-0 mb-0.5
              ${!input.trim() || isLoading
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                : `bg-gradient-to-br ${activeConfig.gradient} text-white shadow-lg hover:shadow-lg hover:brightness-110 active:scale-95`
              }
            `}
          >
            {isLoading ? <StopCircle className="w-5 h-5" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};