import { AIResponse } from '../types';

export async function getAiResponse(
  userInput: string,
  languages: string[],
  // This feedback argument is unused in the current logic but we keep the signature
  feedbackHistory: { title: string; artist: string; feedback: 'liked' | 'disliked' }[]
): Promise<AIResponse> {
  try {
    const response = await fetch('/.netlify/functions/getAiResponse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput, languages }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'A server error occurred.');
    }

    const data: AIResponse = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching AI response from Netlify function:", error);
    throw new Error("Failed to get recommendations. Please try again.");
  }
}