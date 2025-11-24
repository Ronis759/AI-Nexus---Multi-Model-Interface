import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ModelId } from '../types';

// We simulate other models using Gemini with specific system instructions
// because we only have access to the Gemini API key in this environment.

const getSystemInstruction = (modelId: ModelId): string => {
  switch (modelId) {
    case ModelId.GROK:
      return "Ты Grok, ИИ, созданный по образу 'Автостопом по галактике'. Ты остроумен, немного бунтарь и обладаешь сухим чувством юмора. Ты не боишься быть резким. Отвечай на русском языке.";
    case ModelId.CHATGPT:
      return "Ты ChatGPT, полезный ассистент, созданный OpenAI. Ты полезен, безопасен и честен. Твой тон профессиональный, структурированный и вежливый. Отвечай на русском языке.";
    case ModelId.DEEPSEEK:
      return "Ты DeepSeek, продвинутая интеллектуальная модель. Ты специализируешься на глубоких рассуждениях, программировании и математике. Ты даешь очень подробные, логически обоснованные и технически точные ответы. Отвечай на русском языке.";
    case ModelId.GEMINI_3:
    default:
      return "Ты Gemini, большая языковая модель, обученная Google. Ты полезен, точен и даешь исчерпывающие ответы. Отвечай на русском языке.";
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
      // Fallback to flash for simulations for speed, or 2.5-flash for consistency
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