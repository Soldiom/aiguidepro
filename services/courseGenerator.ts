import { getGeminiModel } from './geminiClient';
import type { Course } from '../types/course';

const CONSULTANT_URL = 'https://chatgpt.com/g/g-sw3sWxPbP-aiguidepro';

export interface GenerateCoursesParams {
  topics: string[];
  countPerTopic: number;
}

export async function generateCourses({ topics, countPerTopic }: GenerateCoursesParams): Promise<Course[]> {
  const model = getGeminiModel();

  // Compact Arabic prompt with strict schema to keep output short and cheap
  const prompt = `
أنشئ دورات عربية مبسطة وفق المخطط التالي. للجمهور العام، بلغة واضحة.
المواضيع: ${topics.join(', ')}
عدد الدورات لكل موضوع: ${countPerTopic}

قيود:
- لا تستخدم الإنجليزية أو لاتينية.
- عناوين مختصرة.
- الوصف ≤ 220 حرفاً.
- 3 أسابيع كحد أقصى لكل دورة، وكل أسبوع 3-5 مواضيع قصيرة.
- التفاصيل عنصران كحد أقصى من نوع "list" بعناصر موجزة.

أعد JSON بالمخطط التالي فقط:
{
  "courses": [
    {
      "id": number, // رقم فريد
      "headline": string,
      "title": string,
      "level": "تأسيسي" | "مبتدئ" | "مبتدئ إلى متوسط" | "متوسط" | "متوسط إلى متقدم" | "متقدم" | "استراتيجي",
      "description": string,
      "weeks": [
        { "title": string, "description": string, "topics": string[] }
      ],
      "details": [
        { "type": "list", "title": string, "items": string[] }
      ]
    }
  ]
}
`; 

  const result = await model.generateContent([{ text: prompt }]);
  const text = result.response.text();
  let payload: any;
  try {
    payload = JSON.parse(text);
  } catch (e) {
    // Try to repair minor JSON issues by trimming code fences or stray text
    const repaired = text.replace(/^```json|```$/g, '').trim();
    payload = JSON.parse(repaired);
  }

  const courses: Course[] = (payload?.courses || []).map((c: any, idx: number) => ({
    id: Number.isFinite(c?.id) ? c.id : Date.now() + idx,
    headline: c?.headline ?? c?.title ?? 'دورة',
    title: c?.title ?? c?.headline ?? 'دورة',
    level: c?.level ?? 'تأسيسي',
    description: c?.description ?? '',
    weeks: Array.isArray(c?.weeks) ? c.weeks.map((w: any) => ({
      title: w?.title ?? 'الأسبوع',
      description: w?.description ?? '',
      topics: Array.isArray(w?.topics) ? w.topics.slice(0, 6) : [],
    })) : [],
    details: Array.isArray(c?.details) ? c.details.slice(0, 2).map((d: any) => ({
      type: d?.type === 'text' ? 'text' : 'list',
      title: d?.title ?? undefined,
      items: Array.isArray(d?.items) ? d.items.slice(0, 8) : [],
    })) : [],
    consultantUrl: CONSULTANT_URL,
    source: 'generated',
  }));

  return courses;
}
