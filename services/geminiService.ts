/**
 * Gemini API Service
 * Handles interactions with Netlify Function for Nora AI chatbot
 */

/**
 * Chat with Nora AI via Netlify Function
 */
export async function chatWithNora(
  userMessage: string, 
  conversationHistory: Array<{role: string, content: string}> = []
): Promise<string> {
  try {
    const response = await fetch('/.netlify/functions/chat-with-nora', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMessage,
        conversationHistory
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Netlify function error:', errorData);
      throw new Error(errorData.error || 'Failed to get response from Nora');
    }

    const data = await response.json();
    return data.response;
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
