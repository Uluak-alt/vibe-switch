import { GoogleGenAI } from "@google/genai";
import { Personality } from '../types';

let genAI: GoogleGenAI | null = null;

const getGenAI = (): GoogleGenAI => {
  if (!genAI) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

export const rewritePrompt = async (originalText: string, personality: Personality): Promise<string> => {
  if (personality.id === 'default' || !originalText.trim()) {
    return originalText;
  }

  try {
    const ai = getGenAI();
    const model = "gemini-2.5-flash";
    
    const response = await ai.models.generateContent({
      model,
      contents: `Original Prompt: "${originalText}"\n\nTask: ${personality.systemPrompt}\n\nOutput only the rewritten prompt without any preamble or quotes.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error rewriting prompt:", error);
    throw error;
  }
};
