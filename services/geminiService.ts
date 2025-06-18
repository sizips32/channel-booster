import { GoogleGenAI, GenerateContentResponse, Content } from "@google/genai";
import { GeminiModel } from '../types'; // Import GeminiModel enum

// Ensure API_KEY is accessed correctly from process.env
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set in environment variables. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "YOUR_API_KEY_PLACEHOLDER" }); // Fallback to avoid crash if not set, but operations will fail.

export const geminiService = {
  generateContent: async (prompt: string, modelName: GeminiModel, useGoogleSearch: boolean = false): Promise<{text: string, groundingMetadata?: any}> => {
    if (!API_KEY) {
        throw new Error("API 키가 설정되지 않았습니다. Gemini API를 호출할 수 없습니다.");
    }
    try {
      const contents: Content[] = [{ role: "user", parts: [{text: prompt}]}];
      
      const requestConfig: any = {};
      if (useGoogleSearch) {
        requestConfig.tools = [{googleSearch: {}}];
      } else {
        // Only add thinkingConfig if NOT using Google Search and for the specific model
        if (modelName === GeminiModel.GEMINI_2_5_FLASH_PREVIEW) {
           // Default thinking config (enabled) is fine for higher quality. 
           // For low latency with gemini-2.5-flash-preview-04-17:
           // requestConfig.thinkingConfig = { thinkingBudget: 0 }; 
           // Omitting it here to use default (thinking enabled)
        }
      }

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        ...(Object.keys(requestConfig).length > 0 && {config: requestConfig})
      });

      const text = response.text;
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      
      return { text, groundingMetadata };

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      if (error.message && error.message.includes('API key not valid')) {
        throw new Error("Gemini API 키가 유효하지 않습니다. 확인해주세요.");
      }
      throw new Error(`Gemini API 요청 실패: ${error.message}`);
    }
  },

  generateContentStream: async function* (prompt: string, modelName: GeminiModel) {
    if (!API_KEY) {
        throw new Error("API 키가 설정되지 않았습니다. Gemini API를 호출할 수 없습니다.");
    }
    try {
      const contents: Content[] = [{ role: "user", parts: [{text: prompt}]}];
      const requestConfig: any = {};
       // Apply thinkingConfig only if it's gemini-2.5-flash-preview-04-17 and not using search
       if (modelName === GeminiModel.GEMINI_2_5_FLASH_PREVIEW) {
        // requestConfig.thinkingConfig = { thinkingBudget: 0 }; // For low latency
      }

      const stream = await ai.models.generateContentStream({
        model: modelName,
        contents: contents,
        ...(Object.keys(requestConfig).length > 0 && {config: requestConfig})
      });
      for await (const chunk of stream) {
        yield chunk.text;
      }
    } catch (error: any)
     {
      console.error("Gemini API Streaming Error:", error);
      throw new Error(`Gemini API 스트리밍 요청 실패: ${error.message}`);
    }
  }
};