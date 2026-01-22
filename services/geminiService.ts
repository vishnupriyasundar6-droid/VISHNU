
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getNarrativeComment(
  currentPos: number, 
  diceRoll: number, 
  event: 'none' | 'snake' | 'ladder' | 'win'
): Promise<string> {
  const model = 'gemini-3-flash-preview';
  
  let prompt = '';
  if (event === 'win') {
    prompt = `The player just reached square 100 and won Celestial Snakes and Ladders! Give a short, epic victory shout.`;
  } else if (event === 'snake') {
    prompt = `The player rolled a ${diceRoll} and hit a COSMIC SNAKE on square ${currentPos}! Give a short, witty, slightly teasing comment about their misfortune. Max 15 words.`;
  } else if (event === 'ladder') {
    prompt = `The player rolled a ${diceRoll} and climbed a STAR LADDER! Give a short, encouraging, magical comment about their luck. Max 15 words.`;
  } else {
    prompt = `The player is on square ${currentPos} after rolling a ${diceRoll}. Give a short, mystical observation about their journey. Max 10 words.`;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });
    return response.text?.trim() || "The stars watch your every step...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Fate moves in mysterious ways.";
  }
}
