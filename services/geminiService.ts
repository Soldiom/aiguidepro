/**
 * SOLDIOM ASI API Service
 * Handles interactions with the Python Backend (Hugging Face)
 */

/**
 * Chat with SOLDIOM ASI (Backend Implementation)
 */
export async function chatWithNora(
  userMessage: string,
  conversationHistory: Array<{ role: string, content: string }> = []
): Promise<string> {
  try {
    // URL of the deployed Hugging Face Space
    const BACKEND_URL = 'https://aliaiml-soldiomasi.hf.space/chat';

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend API error:', errorData);
      throw new Error(errorData.detail || response.statusText);
    }

    const data = await response.json();
    return data.reply;

  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
}

/**
 * Summarize a chapter (placeholder - to be implemented)
 */
export async function summarizeChapter(chapterTitle: string, chapterContent: string): Promise<string> {
  // TODO: Implement via Backend
  throw new Error('Not implemented yet');
}

/**
 * Simplify content (placeholder - to be implemented)
 */
export async function simplifyContent(chapterTitle: string, chapterContent: string): Promise<string> {
  // TODO: Implement via Backend
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
