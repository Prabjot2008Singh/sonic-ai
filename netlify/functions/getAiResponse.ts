import { GoogleGenAI, Type } from "@google/genai";

// This interface needs to be redefined here as it's outside the main src scope
interface AIResponse {
  mood: string;
  responseText: string;
  songs: { title: string; artist: string; }[];
}

const aiResponseSchema = {
    type: Type.OBJECT,
    properties: {
      mood: {
        type: Type.STRING,
        description: "A single, lowercase word that best describes the user's primary emotion (e.g., happy, reflective, nostalgic, adventurous). If no clear mood is detected, this should be 'neutral'.",
      },
      responseText: {
        type: Type.STRING,
        description: "A warm, empathetic response in English that introduces the mood and songs, or clarifies the bot's purpose if no mood is detected."
      },
      songs: {
        type: Type.ARRAY,
        description: "A list of 3 to 5 songs, or an empty array if no mood was detected.",
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
          },
          required: ["title", "artist"],
        },
      },
    },
    required: ["mood", "responseText", "songs"],
};

export async function handler(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set");
        return { statusCode: 500, body: JSON.stringify({ error: "Server configuration error." }) };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const { userInput, languages } = JSON.parse(event.body);

        const languageInstruction = languages.length > 0
          ? `Based on the mood, find 3-5 relevant songs from the following languages/music industries: ${languages.join(', ')}. Prioritize these selections.`
          : 'Based on the mood, find 3-5 relevant Bollywood and Punjabi songs.';

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are Sonic.ai, an empathetic and sophisticated music sommelier.
            Your task is to analyze the user's input, determine their mood, and suggest relevant songs based on their language preference.
            You must generate a response in a specific JSON format.

            Instructions:
            1. Read the user's input: "${userInput}".
            2. Analyze the user's input to determine if it expresses a clear emotion or mood.
            3. **If no clear mood is detected** (e.g., it's a factual question, a random statement), follow these steps precisely:
               - Set the 'mood' field to 'neutral'.
               - Set the 'songs' field to an empty array \`[]\`.
               - For 'responseText', create a friendly message explaining you are a music recommender for moods and ask the user to describe how they are feeling.
            4. **If a clear mood IS detected**, identify the single most fitting lowercase word to describe it (e.g., happy, reflective, nostalgic, adventurous). Then proceed:
               - ${languageInstruction}
               - Craft a warm, empathetic, and slightly poetic response text in the 'responseText' field. This text should acknowledge the user's feeling, mention the detected mood, and introduce the song recommendations.
            5. **CRITICAL**: The entire 'responseText' field must be in English.

            User Input: "${userInput}"`,
            config: {
                systemInstruction: "You are Sonic.ai, a warm, insightful, and slightly poetic music expert. Your tone should be comforting and knowledgeable. First, determine the user's mood as a single lowercase word. If no mood is clear, use 'neutral' and politely guide the user back. Then, find emotionally resonant songs for that mood from the user's specified languages. Always respond in English and strictly adhere to the JSON format.",
                responseMimeType: "application/json",
                responseSchema: aiResponseSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText) as AIResponse;

        return {
            statusCode: 200,
            body: JSON.stringify(parsed),
        };

    } catch (error) {
        console.error("Error in Netlify function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to get recommendations. Please try again." }),
        };
    }
}