import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function improvePrompt(primitivePrompt: string, language: 'ko' | 'en' = 'ko') {
  if (!primitivePrompt.trim()) return '';

  const systemInstruction = `
    You are an expert Prompt Engineer specializing in business productivity.
    Your goal is to transform a simple, primitive prompt into a high-quality, professional, and detailed prompt.
    Use professional frameworks like R-G-C (Role, Goal, Context) or C-R-E-A-D (Context, Role, Task, Format, Constraint).
    
    The output should be the improved prompt ONLY. No extra explanation.
    The output language must be ${language === 'ko' ? 'Korean' : 'English'}.
    
    Structure the prompt to include:
    1. A clear role for the AI.
    2. Specific context and goals.
    3. Step-by-step instructions.
    4. Expected output format and tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: primitivePrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Failed to improve prompt.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Could not connect to AI service. Please check your API key.";
  }
}
