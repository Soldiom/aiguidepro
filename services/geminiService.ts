import { getGeminiClient } from './geminiClient';

type ConversationTurn = { role: 'user' | 'assistant'; content: string };
type GeminiMessage = {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
};

const CHAT_MODEL = ((import.meta as any).env?.VITE_GEMINI_CHAT_MODEL as string) || 'gemini-2.0-flash-exp';
const REQUEST_TIMEOUT_MS = 25_000;

const NORA_SYSTEM_PROMPT = `أنت نورا AI، خبيرة ذكاء اصطناعي استثنائية ومعلمة شغوفة في منصة AI Guide Pro.

🌟 **شخصيتك الفريدة:**
- **عالمة وباحثة**: لديك معرفة عميقة بالذكاء الاصطناعي، التعلم الآلي، والتعلم العميق
- **معلمة موهوبة**: تشرحين المفاهيم المعقدة ببساطة مذهلة مع أمثلة واقعية
- **مبتكرة ومبدعة**: تقترحين حلولاً غير تقليدية وأفكاراً جديدة
- **متعاطفة ومشجعة**: تفهمين تحديات المتعلمين وتحفزينهم بإيجابية
- **واقعية وصادقة**: تعترفين بحدود معرفتك وتوجهين للمصادر الصحيحة
- **طموحة ومتفائلة**: تؤمنين بقدرة الجميع على إتقان الذكاء الاصطناعي

💬 **أسلوب تواصلك:**
- تستخدمين لغة عربية فصحى مبسطة وسلسة
- تضيفين الإيموجي بذكاء لجعل الحوار حيوياً (لكن بدون مبالغة)
- تطرحين أسئلة لفهم احتياجات المتعلم بدقة
- تقدمين أمثلة من الحياة اليومية والتطبيقات العملية
- تستخدمين القصص والتشبيهات لتبسيط المفاهيم
- تشجعين التفكير النقدي والاستكشاف

🎯 **مهامك الأساسية:**
1. **الإجابة على الأسئلة**: بدقة وعمق مع مصادر موثوقة عند الحاجة
2. **الشرح والتبسيط**: تحويل المفاهيم التقنية المعقدة إلى محتوى سهل الفهم
3. **التوجيه والإرشاد**: اقتراح مسارات تعليمية ودورات مناسبة من AI Guide Pro
4. **حل المشكلات**: مساعدة المتعلمين في تحديات البرمجة والمشاريع
5. **التحفيز والدعم**: تشجيع المتعلمين على الاستمرار وتحقيق أهدافهم

📚 **معرفتك الواسعة:**
- أساسيات الذكاء الاصطناعي والتعلم الآلي
- نماذج اللغة الكبيرة (LLMs) وهندسة الأوامر
- رؤية الكمبيوتر ومعالجة اللغة الطبيعية
- التعلم العميق والشبكات العصبية
- أخلاقيات الذكاء الاصطناعي والاستخدام المسؤول
- أدوات وتقنيات حديثة (ChatGPT, Midjourney, Stable Diffusion, etc.)
- تطبيقات عملية في الأعمال والتجارة والحياة اليومية

🎓 **الدورات في AI Guide Pro:**
1. **مقدمة إلى الذكاء الاصطناعي** (تأسيسي)
2. **هندسة الأوامر** (مبتدئ-متوسط)
3. **توليد الصور بالذكاء الاصطناعي** (مبتدئ-متوسط)
4. **Vibe Coding: البرمجة بمساعدة AI** (متوسط)
5. **تصميم التطبيقات باستخدام AI** (متوسط-متقدم)
6. **SmartOps Lab: الأنظمة الذكية** (متكامل)
7. **أخلاقيات الذكاء الاصطناعي** (متقدم)
8. **AI لقادة الأعمال** (استراتيجي)

⚠️ **قواعد مهمة:**
- اكتبي **باللغة العربية الفصحى المبسطة فقط**
- استخدمي المصطلحات الإنجليزية التقنية مع ترجمتها وشرحها
- إذا لم تعرفي الإجابة، اعترفي بصدق ووجهي للمصادر المناسبة
- اقترحي دورات AI Guide Pro عندما تكون مناسبة للسؤال
- كوني متفاعلة وشخصية، ليس مجرد روبوت يجيب
- اطرحي أسئلة متابعة لفهم السياق بشكل أفضل

الآن، تفاعلي مع المستخدم بذكاء وحيوية! 🚀`;

const NORA_GENERATION_CONFIG = {
  temperature: 0.9,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
};

const UTILITY_GENERATION_CONFIG = {
  temperature: 0.6,
  topP: 0.9,
  topK: 32,
  maxOutputTokens: 2048,
};

const RELAXED_SAFETY = [
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_NONE',
  },
  {
    category: 'HARM_CATEGORY_HATE_SPEECH',
    threshold: 'BLOCK_NONE',
  },
  {
    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    threshold: 'BLOCK_NONE',
  },
  {
    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    threshold: 'BLOCK_NONE',
  },
];

const modelCache = new Map<string, any>();

function getModel(cacheKey: string, options: Record<string, any>) {
  if (!modelCache.has(cacheKey)) {
    const client = getGeminiClient();
    modelCache.set(cacheKey, client.getGenerativeModel(options));
  }
  return modelCache.get(cacheKey);
}

function getNoraModel() {
  return getModel('nora', {
    model: CHAT_MODEL,
    systemInstruction: NORA_SYSTEM_PROMPT,
    generationConfig: NORA_GENERATION_CONFIG,
    safetySettings: RELAXED_SAFETY,
  });
}

function buildUtilityModel(overrides?: { generationConfig?: Partial<typeof UTILITY_GENERATION_CONFIG> }) {
  const generationConfig = { ...UTILITY_GENERATION_CONFIG, ...(overrides?.generationConfig || {}) };
  return getGeminiClient().getGenerativeModel({
    model: CHAT_MODEL,
    generationConfig,
    safetySettings: RELAXED_SAFETY,
  });
}

function withTimeout<T>(promise: Promise<T>, timeoutMs = REQUEST_TIMEOUT_MS): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('انتهت مهلة الاتصال بخدمة Gemini. حاول مرة أخرى بعد لحظات.'));
    }, timeoutMs);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

function mapConversation(history: ConversationTurn[]): GeminiMessage[] {
  return history
    .slice(-8)
    .map((turn) => ({
      role: turn.role === 'user' ? 'user' : 'model',
      parts: [{ text: turn.content }],
    }))
    .filter((turn) => !!turn.parts[0].text?.trim());
}

function extractText(result: any): string {
  const text = result?.response?.text()?.trim();
  if (!text) {
    throw new Error('لم نستلم أي رد من خدمة Gemini.');
  }
  return text;
}

function formatGeminiError(error: unknown): Error {
  if (error instanceof Error) {
    if (/VITE_GEMINI_API_KEY/i.test(error.message)) {
      return new Error('يرجى إعداد مفتاح Gemini في ملف ‎.env.local ثم إعادة تحميل الصفحة.');
    }
    if (/permission/i.test(error.message) || /403/.test(error.message)) {
      return new Error('تم رفض الاتصال بخدمة Gemini. تأكد من صلاحيات المفتاح ثم حاول مجدداً.');
    }
    return error;
  }
  return new Error('تعذّر الاتصال بخدمة Gemini.');
}

export async function chatWithNora(userMessage: string, conversationHistory: ConversationTurn[] = []): Promise<string> {
  const content = userMessage?.trim();
  if (!content) {
    throw new Error('يرجى كتابة رسالة قبل الإرسال.');
  }

  try {
    const history = mapConversation(conversationHistory);
    const messages: GeminiMessage[] = [...history, { role: 'user', parts: [{ text: content }] }];
    const result = await withTimeout(getNoraModel().generateContent({ contents: messages }));
    return extractText(result);
  } catch (error) {
    throw formatGeminiError(error);
  }
}

async function runUtilityPrompt(prompt: string, generationOverrides?: Partial<typeof UTILITY_GENERATION_CONFIG>) {
  try {
    const model = buildUtilityModel({ generationConfig: generationOverrides });
    const result = await withTimeout(model.generateContent([{ text: prompt }]));
    return extractText(result);
  } catch (error) {
    throw formatGeminiError(error);
  }
}

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

  return runUtilityPrompt(prompt, { temperature: 0.4, maxOutputTokens: 1024 });
}

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

  return runUtilityPrompt(prompt, { temperature: 0.7, maxOutputTokens: 1200 });
}

export async function testGeminiAPI(): Promise<boolean> {
  try {
    await runUtilityPrompt('اختبار بسيط: هل تعمل خدمة Gemini؟', { temperature: 0.2, maxOutputTokens: 64 });
    return true;
  } catch (error) {
    console.error('Gemini API test failed:', error);
    return false;
  }
}
