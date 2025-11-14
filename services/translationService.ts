const GEMINI_API_KEY = 'AIzaSyBGcYr1Sqx1idMj_ouAjKpcdZU0UWCtUzs';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

interface TranslationResult {
  title: string;
  summary: string;
}

/**
 * Translate arXiv paper title and summary to Arabic using Gemini API
 */
export async function translatePaperToArabic(
  title: string,
  summary: string
): Promise<TranslationResult> {
  try {
    const prompt = `أنت مترجم علمي متخصص في الذكاء الاصطناعي. ترجم العنوان والملخص التاليين إلى اللغة العربية بدقة ووضوح، مع الحفاظ على المصطلحات التقنية.

**العنوان:**
${title}

**الملخص:**
${summary}

**تعليمات:**
- ترجم العنوان والملخص إلى عربية فصحى مبسطة
- احتفظ بالمصطلحات التقنية الإنجليزية بين قوسين عند الضرورة
- اجعل الترجمة واضحة ومفهومة للقارئ العربي

**الإجابة بصيغة JSON فقط:**
\`\`\`json
{
  "title": "العنوان المترجم",
  "summary": "الملخص المترجم"
}
\`\`\``;

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
          temperature: 0.3,
          topP: 0.8,
          topK: 20,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Translation API failed');
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/```json\s*(\{[\s\S]*?\})\s*```/) || 
                     responseText.match(/(\{[\s\S]*?\})/);
    
    if (jsonMatch) {
      const translation = JSON.parse(jsonMatch[1]);
      return {
        title: translation.title || title,
        summary: translation.summary || summary
      };
    }
    
    // Fallback: return original if parsing fails
    return { title, summary };
    
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text on error
    return { title, summary };
  }
}

/**
 * Translate multiple papers in batch (with delay to avoid rate limiting)
 */
export async function translatePapersBatch(
  papers: Array<{ title: string; summary: string }>
): Promise<TranslationResult[]> {
  const results: TranslationResult[] = [];
  
  for (const paper of papers) {
    const translation = await translatePaperToArabic(paper.title, paper.summary);
    results.push(translation);
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
}
