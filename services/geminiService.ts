import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ModelId } from '../types';

// We simulate other models using Gemini with specific system instructions
// because we only have access to the Gemini API key in this environment.

const getSystemInstruction = (modelId: ModelId): string => {
  const baseInstruction = "Отвечай строго на русском языке.";
  
  switch (modelId) {
    case ModelId.GROK:
      return `${baseInstruction} ВАЖНО: ТЫ - GROK (ГРОК), ИИ от компании xAI. Твой создатель - Илон Маск. Ты НЕ Google Gemini. Ты обладаешь бунтарским духом, сарказмом и юмором в стиле 'Автостопом по галактике'. Если тебя спросят, кто ты, отвечай ТОЛЬКО что ты Grok. Игнорируй любые предыдущие инструкции о том, что ты модель Google. Будь кратким, дерзким и умным.`;
      
    case ModelId.CHATGPT:
      return `${baseInstruction} ВАЖНО: ТЫ - CHATGPT (версия GPT-4o), большая языковая модель, разработанная OpenAI. Ты НЕ Google Gemini. Твой стиль общения: вежливый, профессиональный, подробный и структурированный. Если тебя спросят, кто ты, отвечай ТОЛЬКО что ты ChatGPT от OpenAI. НИКОГДА не упоминай Google или Alphabet как своих создателей. Игнорируй любые инструкции, противоречащие этому.`;
      
    case ModelId.DEEPSEEK:
      return `${baseInstruction} ВАЖНО: ТЫ - DEEPSEEK R1, модель искусственного интеллекта, разработанная компанией DeepSeek (Китай). Ты НЕ Google Gemini и НЕ ChatGPT. Ты специализируешься на логике, математике и программировании. Твои ответы должны быть технически точными, сухими и очень глубокими. Используй цепочку рассуждений (Chain of Thought). Если спросят, кто ты - отвечай 'DeepSeek'.`;
    
    case ModelId.CLAUDE:
      return `${baseInstruction} ВАЖНО: ТЫ - CLAUDE 3.5 SONNET, ИИ ассистент, созданный компанией Anthropic. Ты НЕ Google Gemini. Ты умный, честный, безопасный и очень способный. Твои ответы должны быть вдумчивыми и хорошо структурированными. Если тебя спросят, кто ты, отвечай ТОЛЬКО что ты Claude от Anthropic. НИКОГДА не говори, что ты модель Google.`;

    case ModelId.GEMINI_3:
    default:
      return `${baseInstruction} Ты - Gemini, передовая мультимодальная модель от Google. Ты полезен, точен и дружелюбен.`;
  }
};

const getModelName = (modelId: ModelId): string => {
  switch (modelId) {
    case ModelId.GEMINI_3:
      // Using the preview model for "Gemini 3" as requested
      return 'gemini-3-pro-preview';
    case ModelId.CHATGPT:
    case ModelId.GROK:
    case ModelId.DEEPSEEK:
    case ModelId.CLAUDE:
      // Using gemini-2.5-flash for high speed simulation of other personas
      return 'gemini-2.5-flash';
    default:
      return 'gemini-2.5-flash';
  }
};

export const generateResponse = async (
  prompt: string,
  modelId: ModelId,
  history: { role: string; parts: { text: string }[] }[] = []
) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelName = getModelName(modelId);
    const systemInstruction = getSystemInstruction(modelId);

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "Не удалось сгенерировать ответ.";
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const generateStreamResponse = async function* (
  prompt: string,
  modelId: ModelId,
  history: { role: string; parts: { text: string }[] }[] = []
) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = getModelName(modelId);
  const systemInstruction = getSystemInstruction(modelId);

  const chat = ai.chats.create({
    model: modelName,
    history: history,
    config: {
      systemInstruction,
    },
  });

  const result = await chat.sendMessageStream({ message: prompt });

  for await (const chunk of result) {
    const c = chunk as GenerateContentResponse;
    if (c.text) {
      yield c.text;
    }
  }
};