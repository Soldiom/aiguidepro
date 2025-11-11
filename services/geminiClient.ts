import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_MODEL = "gemini-2.0-flash-exp"; // fast and economical; can be swapped later

let cachedClient: GoogleGenerativeAI | null = null;

export function getGeminiClient() {
  if (!cachedClient) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    if (!apiKey) {
      throw new Error("لم يتم إعداد مفتاح Gemini. أضف VITE_GEMINI_API_KEY في ملف .env.local");
    }
    cachedClient = new GoogleGenerativeAI(apiKey);
  }
  return cachedClient;
}

export function getGeminiModel() {
  return getGeminiClient().getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction:
      "أنت مولد دورات عربية مبسطة. اكتب بالعربية الفصحى السهلة. اجعل العناوين قصيرة، والوصف موجزاً، وعدد الأسابيع محدوداً. أعد فقط JSON مطابقاً للمخطط المطلوب دون أي شرح.",
    generationConfig: {
      temperature: 0.3,
      topK: 32,
      topP: 0.9,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
    },
  });
}
