import { getGeminiModel } from './geminiClient';
import type { RawFeedItem, ArabicPost } from '../types/news';

export async function summarizeToArabic(items: RawFeedItem[], type: ArabicPost['type']): Promise<ArabicPost[]> {
  if (!items.length) return [];
  const model = getGeminiModel();
  const prompt = `أنت ملخّص أكاديمي عربي دقيق. لا تُخترع مصادر ولا تضف محتوى غير موجود.
نوع المحتوى: ${type}
العناصر الأصلية (لا تتجاهل أي مصدر، واستخدم فقط ما هو موجود):
${items.map((it, idx) => `(${idx+1}) عنوان: ${it.title}\nمصدر: ${it.source}\nرابط: ${it.link || 'بدون'}\nالمعرّف: ${it.arxivId || '—'}\nDOI: ${it.doi || '—'}\nملخص أصلي (قد يكون خام): ${it.summary ? it.summary.slice(0, 400) : '—'}`).join('\n\n')}

أعد فقط JSON بالشكل التالي دون أي شرح إضافي:
{
  "posts": [
    {
      "title": string, // عربي موجز ودقيق
      "body": string,  // نقاط أساسية مختصرة بالعربية دون مبالغات أو استنتاجات غير مذكورة
      "sources": [ { "title": string, "url": string | null, "source": string } ],
      "sourceIndices": number[] // أرقام العناصر الأصلية المستخدمة (1..N)
    }
  ]
}

التحقق:
- لا تذكر أي مصدر غير وارد.
- لا تبتكر نتائج أو استنتاجات.
- إذا كان الملخص الأصلي ناقصاً اكتفِ ببيان ذلك.
`; 

  const res = await model.generateContent([{ text: prompt }]);
  const text = res.response.text();
  let payload: any;
  try { payload = JSON.parse(text); }
  catch { payload = JSON.parse(text.replace(/^```json|```$/g, '').trim()); }

  const now = Date.now();
  const posts: ArabicPost[] = (payload?.posts || []).map((p: any, i: number) => {
    const idxs: number[] = Array.isArray(p?.sourceIndices) ? p.sourceIndices : [];
    const refs = idxs
      .map((n: number) => items[n-1])
      .filter(Boolean)
      .map((r: RawFeedItem) => ({ title: r.title, url: r.link, source: r.source }));
    return {
      id: `ar-${now}-${i}`,
      originalIds: idxs.map((n: number) => items[n-1]?.id).filter(Boolean),
      title: p?.title || 'تحديث الذكاء الاصطناعي',
      body: p?.body || '',
      sources: Array.isArray(p?.sources) && p.sources.length ? p.sources : refs,
      createdAt: now,
      type,
    };
  });
  return posts;
}
