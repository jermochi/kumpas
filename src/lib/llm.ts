import { GoogleGenAI } from '@google/genai';

export async function callAgent(
  systemPromptText: string,
  userTranscript: string, 
  apiKey: string
) {
  if (!apiKey) {
    throw new Error("API key is missing for this agent.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: `Analyze this session transcript: ${userTranscript}`,
      config: {
        systemInstruction: systemPromptText, 
        responseMimeType: 'application/json', 
      }
    });

    const textOutput = response.text;
    
    if (!textOutput) {
       throw new Error("No text returned from Gemini");
    }

    return JSON.parse(textOutput);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { error: "Failed to generate or parse agent output" };
  }
}