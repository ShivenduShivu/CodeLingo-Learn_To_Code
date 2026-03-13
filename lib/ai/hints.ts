import { streamText } from "ai";
import { google } from "@ai-sdk/google";

/**
 * Generates a Socratic hint using the Gemini API (Google AI Studio) as a stream.
 * Strict system prompts enforce that the AI guides the user rather than giving away the answer.
 * 
 * @param questionText The text of the question the user is struggling with.
 * @param questionType The type of question (e.g. 'multiple_choice').
 * @param userAnswer (Optional) The specific wrong answer the user just guessed.
 * @returns A stream response from Vercel AI SDK.
 */
export async function generateHintStream(
  questionText: string,
  questionType: string,
  userAnswer?: string
) {
  const systemPrompt = `You are an educational tutor in a gamified learning app.
Provide a hint that helps the student reason toward the answer, but do not reveal the final answer.
CRITICAL RULES:
1. NEVER give the user the final answer directly.
2. Keep your hint extremely concise (1-3 sentences max). This is a fast-paced quiz.
3. If the user guessed a specific wrong answer, gently explain *why* that concept doesn't fit here, then point them in the right direction.
4. Use an encouraging, conversational tone. Emojis are welcome.`;

  let userPrompt = `I need a hint for this ${questionType} question:\n"${questionText}"`;
  if (userAnswer) {
    userPrompt += `\nI guessed "${userAnswer}", but it was wrong.`;
  }

  try {
    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7
    });

    return result;
  } catch (error) {
    console.error("Gemini Hint Streaming Error:", error);
    throw new Error("Failed to generate hint stream");
  }
}
