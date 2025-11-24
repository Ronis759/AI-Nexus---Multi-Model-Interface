export enum ModelId {
  GEMINI_3 = 'gemini-3',
  CHATGPT = 'chatgpt',
  GROK = 'grok',
  DEEPSEEK = 'deepseek'
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
    gradient: 'from-blue-400 via-indigo-500 to-purple-500',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-500/30'
  },
  [ModelId.CHATGPT]: {
    label: 'ChatGPT 4o',
    description: 'Флагманская модель OpenAI для рассуждений.',
    gradient: 'from-emerald-400 via-teal-500 to-green-500',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30'
  },
  [ModelId.GROK]: {
    label: 'Grok 2',
    description: 'Остроумный и бунтарский ассистент от xAI.',
    gradient: 'from-gray-100 via-gray-300 to-white',
    iconColor: 'text-white',
    borderColor: 'border-white/30'
  },
  [ModelId.DEEPSEEK]: {
    label: 'DeepSeek R1',
    description: 'Продвинутая открытая модель для логики и кода.',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-500',
    iconColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/30'
  }
};