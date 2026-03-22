import { GoogleGenAI, Type } from "@google/genai";

// Support both AI Studio's process.env and standard Vite import.meta.env
const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;

// Initialize with a dummy key if missing to prevent crashing the entire app on load,
// but we will throw a clear error when they actually try to analyze a mood.
const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_API_KEY" });

export interface MoodAnalysis {
  color_palette: string[];
  aura_shape: string;
  vibe_title: string;
  vibe_description: string;
  sound_profile: string;
}

export async function analyzeMood(moodText: string): Promise<MoodAnalysis> {
  if (!apiKey || apiKey === "MISSING_API_KEY") {
    throw new Error("Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your Vercel Environment Variables and redeploy.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following mood/emotion and generate an aura profile: "${moodText}"`,
    config: {
      systemInstruction: `You are an AI Mood Ring. Analyze the user's emotion and return a JSON object with a color palette (3 hex codes), an aura shape (e.g., 'circle', 'blob', 'star', 'cloud', 'wave'), a catchy vibe title, a short insightful vibe description, and a sound profile category ('calm', 'excited', 'sad', 'happy', 'mystical', 'energetic').`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          color_palette: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Array of 3 hex color codes representing the mood.",
          },
          aura_shape: {
            type: Type.STRING,
            description: "Shape of the aura (e.g., 'blob', 'circle', 'star', 'cloud', 'wave').",
          },
          vibe_title: {
            type: Type.STRING,
            description: "A catchy, fun title for the vibe.",
          },
          vibe_description: {
            type: Type.STRING,
            description: "A short, insightful description of the vibe.",
          },
          sound_profile: {
            type: Type.STRING,
            description: "One of: 'calm', 'excited', 'sad', 'happy', 'mystical', 'energetic'.",
          },
        },
        required: ["color_palette", "aura_shape", "vibe_title", "vibe_description", "sound_profile"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to generate mood analysis.");
  }

  return JSON.parse(text) as MoodAnalysis;
}
