/**
 * Gemini API Service
 * Handles interactions with Netlify Function for Nora AI chatbot
 */
import { SOLDIOM_ASI_PROMPT } from '../src/data/soldiomSystemPrompt';

/**
 * Chat with Nora AI via Netlify Function
 */
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCW5em5pQEMWvxeg2WH04K08yQBZ8oJ458';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

/**
 * Chat with Nora AI (Client-Side Implementation)
 */
export async function chatWithNora(
  userMessage: string,
  conversationHistory: Array<{ role: string, content: string }> = []
): Promise<string> {
  try {
    // Build system prompt
    const systemPrompt = SOLDIOM_ASI_PROMPT;

    // Build full prompt with conversation history
    let fullPrompt = systemPrompt + '\n\n';

    if (conversationHistory && conversationHistory.length > 0) {
      fullPrompt += '**سياق المحادثة السابقة:**\n';
      conversationHistory.slice(-6).forEach((msg: any) => {
        fullPrompt += `${msg.role === 'user' ? 'المستخدم' : 'نورا'}: ${msg.content}\n`;
      });
      fullPrompt += '\n';
    }

    fullPrompt += `**سؤال المستخدم الحالي:**\n${userMessage}\n\n**إجابتك (نورا):`;

    // Call Gemini API directly
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(errorData.error?.message || response.statusText);
    }

    const data: GeminiResponse = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
}

/**
 * Summarize a chapter (placeholder - to be implemented)
 */
export async function summarizeChapter(chapterTitle: string, chapterContent: string): Promise<string> {
  // TODO: Implement via Netlify function
  throw new Error('Not implemented yet');
}

/**
 * Simplify content (placeholder - to be implemented)
 */
export async function simplifyContent(chapterTitle: string, chapterContent: string): Promise<string> {
  // TODO: Implement via Netlify function
  throw new Error('Not implemented yet');
}

/**
 * Test API connection
 */
export async function testGeminiAPI(): Promise<boolean> {
  try {
    await chatWithNora('مرحباً');
    return true;
  } catch (error) {
    console.error('API test failed:', error);
    return false;
  }
}
