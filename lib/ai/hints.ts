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
  userAnswer?: string,
  options?: string[],
  correctAnswer?: string,
  lessonTitle?: string,
  mode: "hint" | "explain" = "hint"
) {
  const systemPrompt = `You are a friendly programming mentor helping beginners learn coding.

Do NOT reveal the correct answer directly.

Instead:
- explain the concept
- guide the student toward the right reasoning
- use simple beginner-friendly language

Limit your response to a maximum of 3 sentences.`;

  let userPrompt = `Context: The student is learning "${lessonTitle || 'ProgrammingConcepts'}".\n`;
  userPrompt += `Question Type: ${questionType}\n`;
  userPrompt += `Question: "${questionText}"\n`;

  if (options && options.length > 0) {
    userPrompt += `Options given to student: [${options.join(", ")}]\n`;
  }

  if (questionType === "code") {
    if (mode === "explain") {
       userPrompt += `\nThe student asked: "Explain what is wrong in this code".\n`;
       if (userAnswer) {
         userPrompt += `Student's Code Attempt:\n\`\`\`\n${userAnswer}\n\`\`\`\n`;
       }
       if (correctAnswer) {
         userPrompt += `Expected Output snippet: "${correctAnswer}"\n`;
       }
       userPrompt += `\nPlease explain the conceptual error or syntax mistake in their code cleanly. Avoid giving them the completely corrected code blocks if possible.`;
    } else {
       // Hint Mode for Code
       userPrompt += `\nThe student needs a hint for this coding challenge.`;
       if (userAnswer) {
         userPrompt += `\nThey wrote this code:\n\`\`\`\n${userAnswer}\n\`\`\`\n`;
         userPrompt += `Gently point out one flaw or give them a tiny nudge in the right direction.`;
       }
    }
  } else {
    // Standard Multiple Choice handling
    if (mode === "explain") {
      userPrompt += `\nThe student clicked "Explain Concept". Please explain the programming rule or concept behind this question clearly.`;
      if (correctAnswer) {
        userPrompt += ` The correct answer is "${correctAnswer}", but focus on explaining the overarching concept instead of just pointing it out.`;
      }
    } else {
      // Hint Mode
      userPrompt += `\nThe student needs a hint.`;
      if (userAnswer) {
        userPrompt += ` They incorrectly guessed "${userAnswer}". Gently explain *why* that doesn't fit, then point them in the right direction without giving away the final answer.`;
      }
    }
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
