export enum ModelId {
  GEMINI_3 = 'gemini-3',
  CHATGPT = 'chatgpt',
  GROK = 'grok',
  DEEPSEEK = 'deepseek',
  CLAUDE = 'claude'
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id: string;
  timestamp: number;
  modelUsed?: ModelId;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export const MODEL_CONFIGS = {
  [ModelId.GEMINI_3]: {
    label: 'Gemini 3.0',
    description: 'Самая мощная мультимодальная модель Google.',
    gradient: 'from-blue-600 via-indigo-600 to-violet-600',
    iconColor: 'text-indigo-400',
    borderColor: 'border-indigo-500',
    shadowColor: 'shadow-indigo-500/40',
    messageBg: 'bg-indigo-950/70',
    messageBorder: 'border-indigo-500/50',
    ringColor: 'ring-indigo-500',
    textColor: 'text-indigo-100',
    selectionBg: 'bg-indigo-950/40',
    accentColor: 'bg-indigo-600'
  },
  [ModelId.CHATGPT]: {
    label: 'ChatGPT 4o',
    description: 'Флагманская модель OpenAI для рассуждений.',
    gradient: 'from-emerald-500 via-green-600 to-teal-600',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500',
    shadowColor: 'shadow-emerald-500/40',
    messageBg: 'bg-emerald-950/70',
    messageBorder: 'border-emerald-500/50',
    ringColor: 'ring-emerald-500',
    textColor: 'text-emerald-100',
    selectionBg: 'bg-emerald-950/40',
    accentColor: 'bg-emerald-600'
  },
  [ModelId.GROK]: {
    label: 'Grok 2',
    description: 'Остроумный и бунтарский ассистент от xAI.',
    gradient: 'from-gray-100 via-slate-200 to-gray-400',
    iconColor: 'text-white',
    borderColor: 'border-white',
    shadowColor: 'shadow-white/25',
    messageBg: 'bg-gray-800/90',
    messageBorder: 'border-gray-500/50',
    ringColor: 'ring-white',
    textColor: 'text-gray-100',
    selectionBg: 'bg-gray-800/60',
    accentColor: 'bg-white'
  },
  [ModelId.DEEPSEEK]: {
    label: 'DeepSeek R1',
    description: 'Продвинутая открытая модель для логики и кода.',
    gradient: 'from-cyan-500 via-blue-600 to-indigo-600',
    iconColor: 'text-cyan-400',
    borderColor: 'border-cyan-500',
    shadowColor: 'shadow-cyan-500/40',
    messageBg: 'bg-cyan-950/70',
    messageBorder: 'border-cyan-500/50',
    ringColor: 'ring-cyan-500',
    textColor: 'text-cyan-100',
    selectionBg: 'bg-cyan-950/40',
    accentColor: 'bg-cyan-600'
  },
  [ModelId.CLAUDE]: {
    label: 'Claude 3.5',
    description: 'Интеллектуальный и безопасный ассистент Anthropic.',
    gradient: 'from-orange-500 via-amber-600 to-yellow-600',
    iconColor: 'text-orange-400',
    borderColor: 'border-orange-500',
    shadowColor: 'shadow-orange-500/40',
    messageBg: 'bg-orange-950/70',
    messageBorder: 'border-orange-500/50',
    ringColor: 'ring-orange-500',
    textColor: 'text-orange-100',
    selectionBg: 'bg-orange-950/40',
    accentColor: 'bg-orange-600'
  }
};