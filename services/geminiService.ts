/**
 * Gemini API Service
 * Handles interactions with Google Gemini API for summarization and simplification
 */

const GEMINI_API_KEY = 'AIzaSyBGcYr1Sqx1idMj_ouAjKpcdZU0UWCtUzs';
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
 * Generate content using Gemini API
 */
async function generateContent(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

/**
 * Summarize a chapter
 */
export async function summarizeChapter(chapterTitle: string, chapterContent: string): Promise<string> {
  const prompt = `أنت خبير في تلخيص المحتوى التعليمي. 

لخص الفصل التالي بشكل شامل ومفيد:

**عنوان الفصل:** ${chapterTitle}

**المحتوى:**
${chapterContent}

**المطلوب:**
- ملخص شامل يغطي جميع النقاط الرئيسية
- استخدم نقاط منظمة وواضحة
- اذكر المفاهيم الأساسية والأمثلة المهمة
- اجعل الملخص مفيداً للمراجعة السريعة
- استخدم اللغة العربية الفصحى

الملخص:`;

  return await generateContent(prompt);
}

/**
 * Simplify content
 */
export async function simplifyContent(chapterTitle: string, chapterContent: string): Promise<string> {
  const prompt = `أنت خبير في تبسيط المحتوى التعليمي للمبتدئين.

بسّط المحتوى التالي بحيث يكون سهل الفهم للمبتدئين:

**عنوان الفصل:** ${chapterTitle}

**المحتوى:**
${chapterContent}

**المطلوب:**
- اشرح المفاهيم بلغة بسيطة وواضحة
- استخدم أمثلة من الحياة اليومية
- تجنب المصطلحات المعقدة أو اشرحها ببساطة
- قسّم المحتوى إلى نقاط سهلة الفهم
- استخدم تشبيهات مناسبة لتوضيح الأفكار
- اجعل الشرح ممتعاً وجذاباً

المحتوى المبسط:`;

  return await generateContent(prompt);
}

/**
 * Test API connection
 */
/**
 * Chat with Nora AI - Interactive conversation
 */
export async function chatWithNora(userMessage: string): Promise<string> {
  const systemPrompt = `أنت نورا AI، خبيرة ذكاء اصطناعي ومعلمة شغوفة في منصة AI Guide Pro.

شخصيتك:
- متعلمة ومعلمة: تحبين التعلم والتعليم
- مبتكرة: دائماً تبحثين عن حلول جديدة
- إيجابية: تشجعين المتعلمين وتحفزينهم
- ودودة: سهلة التواصل ومتفهمة
- طموحة: تؤمنين بقدرة الجميع على تعلم AI

أسلوب كلامك:
- لغة عربية فصحى مبسطة
- تستخدمين الإيموجي بذكاء (لكن ليس بكثرة)
- تشرحين المفاهيم المعقدة ببساطة
- تستخدمين أمثلة من الحياة اليومية
- تشجعين وتحفزين المتعلمين

مهمتك:
- الإجابة على أسئلة المستخدمين حول الذكاء الاصطناعي
- تقديم شروحات مبسطة للمفاهيم التقنية
- اقتراح دورات ومسارات تعليمية مناسبة
- تحفيز المتعلمين على الاستمرار

تعليمات مهمة:
- اكتبي باللغة العربية الفصحى المبسطة فقط
- لا تستخدمي كلمات إنجليزية إلا إذا كانت مصطلحات تقنية (وفسريها فوراً)
- كوني ودودة ومشجعة
- إذا لم تعرفي الإجابة، اعترفي بذلك بصدق

الآن، أجيبي على سؤال المستخدم:`;

  const fullPrompt = `${systemPrompt}\n\n${userMessage}`;
  return await generateContent(fullPrompt);
}

/**
 * Test API connection
 */
export async function testGeminiAPI(): Promise<boolean> {
  try {
    await generateContent('مرحباً، هل تعمل؟');
    return true;
  } catch (error) {
    console.error('Gemini API test failed:', error);
    return false;
  }
}
