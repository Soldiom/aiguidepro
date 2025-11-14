<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Guide Pro

منصة عربية متكاملة لدورات وأخبار الذكاء الاصطناعي.

## الميزات الرئيسية
- تحسينات SEO ووسوم المشاركة الاجتماعية (Open Graph, Twitter)
- دعم PWA (تثبيت التطبيق، العمل بدون إنترنت، manifest)
- صفحات خطأ مخصصة (404، 500)
- نموذج ملاحظات المستخدم في جميع الصفحات
- تحليلات خصوصية (Plausible)
- حماية أمان (CSP، XSS)
- صفحة "عن المنصة" (/about)

## الأمان
- جميع الأكواد المصدرية خاصة، فقط ملفات البناء تُنشر
- حماية من XSS عبر CSP

## طريقة النشر
- نفّذ `npm run build` ثم انشر مجلد dist فقط

## الدعم
للاستفسار أو المساهمة: soldiom@gmail.com

## المتطلبات
- Node 18+
- إنشاء ملف `.env.local` يحتوي المفتاح:

```
VITE_GEMINI_API_KEY=ضع_مفتاحك_هنا
```

## التشغيل والبناء
- تطوير: `npm run dev`
- إنتاج: `npm run build`
## الوضع التلقائي لتوليد الدورات

يوفّر الموقع وضعاً تلقائياً بدون تدخّل يدوي:

- يومياً: يجلب تلميحات مواضيع من أحدث أبحاث الذكاء الاصطناعي (arXiv) أو مواضيع عربية احتياطية عند فشل الاتصال، ثم يطلب من Gemini اقتراح أفكار دورات عربية (عناوين قصيرة + وصف موجز + مستوى) ويضيفها لقائمة الاقتراحات.
- أسبوعياً: يولّد حتى دورتين من الأعلى تصويتاً تلقائياً ويضيفهما لقسم «دورات تدريبية متخصصة» كدورات «جديدة» مجانية.

التحكم عبر متغيرات البيئة:

- VITE_GEMINI_API_KEY: مفتاح Gemini (مطلوب)
- VITE_AUTO_COURSES=true|false: تفعيل/تعطيل الوضع التلقائي (الافتراضي: مفعّل)

يعتمد الوضع التلقائي على التخزين المحلي (localStorage) في الواجهة؛ للجدولة المركزية العامة يوصى بإضافة خدمة خادم صغيرة أو وظيفة سحابية مجدولة.

## التصويت المجتمعي

- صفحة عامة: `/vote` تتيح للمستخدمين التصويت لأفكار الدورات.
- يتم تحديث الاقتراحات تلقائياً يومياً عبر الوضع التلقائي.
- عند بلوغ الاقتراحات أعلى أصوات، يتم توليد دورتين أسبوعياً تلقائياً.

## الأخبار والأبحاث بالعربية

- صفحة `/news` تعرض ملخصات عربية لأوراق بحثية وأخبار ومقالات حول الذكاء الاصطناعي.
- يتم جلب المصادر يومياً (أفضل جهد من arXiv ومصادر بديلة)، ثم توليد ملخص عربي بالمصادر عبر Gemini.
- يتم حفظ المحتوى محلياً وتقليص الاستدعاءات للحفاظ على التكلفة.
 - دعم بروكسي اختياري للمصادر الإضافية عبر متغير: `VITE_NEWS_PROXY_URL=https://your-proxy.example.com` والذي يعيد تمرير المحتوى (GET ?url=...).

### تشغيل بروكسي محلي (اختياري)

يوصى ببروكسي بسيط لتجاوز قيود CORS لبعض المصادر:

1) تثبيت التبعيات وتشغيله:

```
cd server
npm install
npm start
```

2) أنشئ `.env.local` في مجلد الجذر وأضف:

```
VITE_NEWS_PROXY_URL=http://localhost:4000/proxy
```

سيتجه التطبيق لاستخدام البروكسي تلقائياً عند وجود المتغير.

### مصادر الأخبار الافتراضية

يتم محاولة جلب خلاصات RSS من المصادر التالية افتراضياً:

- Google AI Blog
- OpenAI Blog
- The Gradient
- NVIDIA Blog (قسم الذكاء الاصطناعي)

يمكن تعديلها عبر متغير البيئة:

```
VITE_NEWS_SOURCES=https://example.com/feed.xml,https://another.com/rss
```

إذا فشل الجلب بسبب CORS ولم يُشغّل البروكسي، يتم استخدام عناصر بديلة منسقة حتى لا تبقى الصفحة فارغة.

### التحقق من الأصالة

- يتم قبول البيانات فقط من مضيفين موثوقين (القائمة البيضاء الافتراضية تشمل arXiv و Google AI و OpenAI و NVIDIA و The Gradient و وغيرها من المصادر المعروفة).
- يمكن إضافة أو تعديل القائمة عبر متغير بيئة:
```
VITE_NEWS_ALLOWED_HOSTS=export.arxiv.org,ai.googleblog.com,openai.com,your-additional-host.com
```
- يتم استخراج معرفات مثل arXiv ID و DOI عند توفرها، وتُخزن مع العناصر.
- عند التلخيص بالعربية يتم تمرير المصادر إلى Gemini مع تعليمات صارمة بعدم اختراع أو تزييف أي معلومات أو مصادر.

## لوحة الإدارة (محلياً)

- افتح: `/adminali?admin=1`
- إنشاء دورات مباشرة من مواضيع محددة.
- معاينة، حفظ، تصدير/استيراد JSON.
- قسم «اقتراحات الدورات والتصويت» لعرض الاقتراحات، التصويت، والتوليد اليدوي.

## المتطلبات

- Node 18+
- إنشاء ملف `.env.local` يحتوي المفتاح:

```
VITE_GEMINI_API_KEY=ضع_مفتاحك_هنا
```

اختياري:

```
VITE_AUTO_COURSES=true
```

## تشغيل وبناء

- تطوير: `npm run dev`
- إنتاج: `npm run build` ثم خدمة مجلد `dist`


View your app in AI Studio: https://ai.studio/apps/drive/1mSAV4CG51taKKneDJEOpJp_t2m5E-rrC

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and set `VITE_GEMINI_API_KEY` to your Gemini API key
3. Run the app:
   `npm run dev`

---

## 🚀 100X AI Agent System: Unified Guide

This repository now includes comprehensive guides for building a **100X Online AI Agent System** - a production-ready, enterprise-grade system with extensive integrations and powerful AI capabilities.

### 📚 Documentation

#### Core Guides

1. **[100X_AI_AGENT_GUIDE.md](./100X_AI_AGENT_GUIDE.md)** - Complete overview of the 100X AI Agent System
   - System architecture and core components
   - Top-tier agent frameworks
   - LLM serving and distributed computing
   - Integration platforms
   - Best practices and recommendations

2. **[CURATED_RESOURCES.md](./CURATED_RESOURCES.md)** - Complete resource links
   - GitHub repositories for all frameworks
   - Hugging Face models (general and specialized)
   - Clone commands and quick start scripts
   - Integration platforms and tools
   - Deployment platforms

3. **[IMPLEMENTATION_GUIDES.md](./IMPLEMENTATION_GUIDES.md)** - Implementation examples
   - MetaGPT implementation
   - CrewAI setup and usage
   - LangGraph workflows
   - Ray for distributed computing
   - vLLM for LLM serving
   - n8n integration
   - Playwright browser automation
   - Langfuse observability

4. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Production deployment
   - Docker deployment
   - Kubernetes deployment
   - Serverless deployment (AWS Lambda, Google Cloud Functions)
   - Cloud platforms (EKS, GKE, AKS)
   - Production best practices
   - Monitoring and observability

### ⚡ Quick Start Scripts

The `quickstart-scripts/` directory contains automation scripts to get started quickly:

1. **setup-environment.sh** - Complete development environment setup
   ```bash
   bash quickstart-scripts/setup-environment.sh
   ```

2. **clone-frameworks.sh** - Clone all essential AI agent frameworks
   ```bash
   bash quickstart-scripts/clone-frameworks.sh
   ```

3. **download-models.sh** - Download Hugging Face models
   ```bash
   bash quickstart-scripts/download-models.sh
   ```

See [quickstart-scripts/README.md](./quickstart-scripts/README.md) for detailed usage.

### 🎯 Key Features of the 100X System

- **Hyper-Scalable**: Handle tens of thousands of parallel tasks with Ray
- **Extensively Integrated**: Connect to 1000+ APIs with n8n and Trigger.dev
- **Easy to Deploy**: Docker, Kubernetes, and serverless options
- **Powered by SOTA Models**: Use the latest LLMs from Hugging Face
- **Production-Ready**: Built on enterprise-grade frameworks

### 🏗️ Recommended Stack

| Component | Tool | Purpose |
|-----------|------|---------|
| Agent Framework | MetaGPT / CrewAI | Multi-agent orchestration |
| Distributed Computing | Ray | Massive scalability |
| Integration Platform | n8n / Trigger.dev | API connections |
| LLM Serving | vLLM / TGI | High-throughput inference |
| Observability | Langfuse | Monitoring and tracing |
| Browser Automation | Playwright | Web agents |

### 🎓 Getting Started with AI Agents

1. **Read the guides**: Start with [100X_AI_AGENT_GUIDE.md](./100X_AI_AGENT_GUIDE.md)
2. **Set up your environment**: Run the setup script
3. **Clone frameworks**: Use the clone script to get started
4. **Build your first agent**: Follow the implementation guides
5. **Deploy to production**: Use the deployment guide

### 🌐 Deployment Target

**Althowaikh.com/soldiom**

---
