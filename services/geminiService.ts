
import { GoogleGenAI } from "@google/genai";

// Initialization according to guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getNarrativeComment(
  currentPos: number, 
  diceRoll: number, 
  event: 'none' | 'snake' | 'ladder' | 'win'
): Promise<string> {
  // Guard against missing key
  if (!process.env.API_KEY) {
    return "The cosmos is silent, but your path remains clear.";
  }

  const model = 'gemini-3-flash-preview';
  
  let prompt = '';
  if (event === 'win') {
    prompt = `The player reached square 100 and won! Give a short, epic victory shout. Max 10 words.`;
  } else if (event === 'snake') {
    prompt = `The player rolled a ${diceRoll} and hit a cosmic void (snake) at square ${currentPos}! Witty teasing comment. Max 12 words.`;
  } else if (event === 'ladder') {
    prompt = `The player rolled a ${diceRoll} and entered a star portal (ladder) at square ${currentPos}! Magical encouraging comment. Max 12 words.`;
  } else {
    prompt = `The player is at square ${currentPos} after rolling a ${diceRoll}. Short mystical journey observation. Max 8 words.`;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.9,
      }
    });
    return response.text?.trim() || "Fate shifts with your progress.";
  } catch (error) {
    console.error("Gemini Oracle Error:", error);
    return "The stars are shifting...";
  }
}
