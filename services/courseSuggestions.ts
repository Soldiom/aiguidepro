import { getGeminiModel } from './geminiClient';
import type { CourseSuggestion } from '../types/suggestion';

interface SuggestionPayload { suggestions: Array<{ id?: string; title: string; description: string; level?: CourseSuggestion['level'] }>; }

export async function getGeminiSuggestions(topicHint: string, count: number = 6): Promise<CourseSuggestion[]> {
  const model = getGeminiModel();
  const prompt = `
اقترح أفكار دورات عربية حول الذكاء الاصطناعي وفق المخطط التالي. اكتب بالعربية الفصحى المبسطة.
تلميح الموضوع: ${topicHint}
العدد المطلوب: ${count}

قيود:
- عناوين قصيرة وواضحة.
- وصف موجز ≤ 160 حرفاً.
- مستوى تقريبي لكل اقتراح.

أعد JSON فقط بهذا الشكل:
{
  "suggestions": [
    { "id": string, "title": string, "description": string, "level": "تأسيسي" | "مبتدئ" | "مبتدئ إلى متوسط" | "متوسط" | "متوسط إلى متقدم" | "متقدم" | "استراتيجي" }
  ]
}`;

  const result = await model.generateContent([{ text: prompt }]);
  const text = result.response.text();
  let payload: SuggestionPayload;
  try {
    payload = JSON.parse(text);
  } catch {
    const repaired = text.replace(/^```json|```$/g, '').trim();
    payload = JSON.parse(repaired);
  }

  const now = Date.now();
  return (payload?.suggestions || []).map((s, idx) => ({
    id: s.id?.toString() || String(now + idx),
    title: s.title,
    description: s.description,
    level: s.level,
    votes: 0,
    createdAt: now,
    status: 'suggested',
  }));
}
