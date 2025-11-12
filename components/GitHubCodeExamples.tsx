import React, { useState, useEffect } from 'react';
import { Code, ExternalLink, Star, GitFork, Download, Copy, Check } from 'lucide-react';

interface CodeExample {
  name: string;
  path: string;
  content: string;
  language: string;
  description: string;
}

const GitHubCodeExamples: React.FC = () => {
  const [examples, setExamples] = useState<CodeExample[]>([]);
  const [selectedExample, setSelectedExample] = useState<CodeExample | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const codeExamples: CodeExample[] = [
    {
      name: 'مثال: تحليل المشاعر بالعربية',
      path: 'examples/sentiment_analysis.py',
      language: 'python',
      description: 'تحليل مشاعر النصوص العربية باستخدام transformers',
      content: `from transformers import pipeline

# تحميل نموذج تحليل المشاعر العربي
classifier = pipeline("sentiment-analysis", 
                     model="CAMeL-Lab/bert-base-arabic-camelbert-ca")

# تحليل نص عربي
text = "هذا المنتج رائع جداً وأنصح به الجميع!"
result = classifier(text)

print(f"النص: {text}")
print(f"المشاعر: {result[0]['label']}")
print(f"الثقة: {result[0]['score']:.2%}")

# مثال آخر
texts = [
    "الخدمة سيئة جداً ولا أنصح بها",
    "المنتج جيد لكن السعر مرتفع",
    "تجربة ممتازة وسأكرر الشراء"
]

for text in texts:
    result = classifier(text)[0]
    print(f"\\n{text}")
    print(f"→ {result['label']} ({result['score']:.2%})")
`
    },
    {
      name: 'مثال: توليد نص عربي',
      path: 'examples/text_generation.py',
      language: 'python',
      description: 'توليد نصوص عربية باستخدام GPT',
      content: `import openai
import os

# إعداد API key
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_arabic_text(prompt, max_tokens=150):
    """
    توليد نص عربي بناءً على المدخلات
    """
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "أنت مساعد ذكي يتحدث العربية"},
            {"role": "user", "content": prompt}
        ],
        max_tokens=max_tokens,
        temperature=0.7
    )
    
    return response.choices[0].message.content

# مثال: كتابة مقال
prompt = "اكتب مقالاً قصيراً عن أهمية الذكاء الاصطناعي في التعليم"
article = generate_arabic_text(prompt, max_tokens=300)
print(article)

# مثال: الإجابة على سؤال
question = "ما هي أفضل طريقة لتعلم البرمجة؟"
answer = generate_arabic_text(question)
print(f"\\nالسؤال: {question}")
print(f"الإجابة: {answer}")
`
    },
    {
      name: 'مثال: تصنيف الصور',
      path: 'examples/image_classification.py',
      language: 'python',
      description: 'تصنيف الصور باستخدام نماذج Vision',
      content: `from transformers import pipeline
from PIL import Image

# تحميل نموذج تصنيف الصور
classifier = pipeline("image-classification", 
                     model="google/vit-base-patch16-224")

# تحميل صورة
image = Image.open("path/to/image.jpg")

# التصنيف
results = classifier(image)

print("نتائج التصنيف:")
for i, result in enumerate(results[:5], 1):
    print(f"{i}. {result['label']}: {result['score']:.2%}")

# مثال: معالجة دفعة من الصور
import os
from pathlib import Path

image_folder = "images/"
for img_path in Path(image_folder).glob("*.jpg"):
    image = Image.open(img_path)
    result = classifier(image)[0]
    print(f"\\n{img_path.name}: {result['label']} ({result['score']:.2%})")
`
    },
    {
      name: 'مثال: Chatbot بالعربية',
      path: 'examples/arabic_chatbot.py',
      language: 'python',
      description: 'بناء chatbot يتحدث العربية',
      content: `from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

class ArabicChatbot:
    def __init__(self, model_name="aubmindlab/aragpt2-base"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(model_name)
        self.conversation_history = []
    
    def chat(self, user_input):
        # إضافة المدخلات للسجل
        self.conversation_history.append(f"المستخدم: {user_input}")
        
        # تحضير النص للنموذج
        context = "\\n".join(self.conversation_history[-5:])  # آخر 5 رسائل
        prompt = f"{context}\\nالمساعد:"
        
        # توليد الرد
        inputs = self.tokenizer(prompt, return_tensors="pt")
        outputs = self.model.generate(
            inputs.input_ids,
            max_length=inputs.input_ids.shape[1] + 50,
            temperature=0.7,
            top_p=0.9,
            do_sample=True
        )
        
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        response = response.split("المساعد:")[-1].strip()
        
        # إضافة الرد للسجل
        self.conversation_history.append(f"المساعد: {response}")
        
        return response

# استخدام الـ chatbot
bot = ArabicChatbot()

print("مرحباً! أنا chatbot عربي. اكتب 'خروج' للإنهاء.")
while True:
    user_input = input("\\nأنت: ")
    if user_input.lower() in ['خروج', 'exit', 'quit']:
        print("مع السلامة!")
        break
    
    response = bot.chat(user_input)
    print(f"المساعد: {response}")
`
    },
    {
      name: 'مثال: Web Scraping للأخبار',
      path: 'examples/news_scraper.py',
      language: 'python',
      description: 'جمع أخبار الذكاء الاصطناعي تلقائياً',
      content: `import requests
from bs4 import BeautifulSoup
import feedparser
from datetime import datetime

class AINewsScraper:
    def __init__(self):
        self.sources = {
            'arxiv': 'http://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=submittedDate&max_results=10',
            'huggingface': 'https://huggingface.co/blog/feed.xml'
        }
    
    def get_arxiv_papers(self):
        """جلب أحدث الأبحاث من arXiv"""
        feed = feedparser.parse(self.sources['arxiv'])
        papers = []
        
        for entry in feed.entries[:10]:
            paper = {
                'title': entry.title,
                'authors': [author.name for author in entry.authors],
                'summary': entry.summary,
                'link': entry.link,
                'published': entry.published
            }
            papers.append(paper)
        
        return papers
    
    def get_hf_blog_posts(self):
        """جلب مقالات Hugging Face"""
        feed = feedparser.parse(self.sources['huggingface'])
        posts = []
        
        for entry in feed.entries[:5]:
            post = {
                'title': entry.title,
                'summary': entry.summary,
                'link': entry.link,
                'published': entry.published
            }
            posts.append(post)
        
        return posts
    
    def display_news(self):
        """عرض الأخبار"""
        print("=" * 60)
        print("أحدث أخبار الذكاء الاصطناعي")
        print("=" * 60)
        
        # أبحاث arXiv
        print("\\n📚 أحدث الأبحاث من arXiv:")
        papers = self.get_arxiv_papers()
        for i, paper in enumerate(papers, 1):
            print(f"\\n{i}. {paper['title']}")
            print(f"   المؤلفون: {', '.join(paper['authors'][:3])}")
            print(f"   الرابط: {paper['link']}")
        
        # مقالات HF
        print("\\n\\n🤗 مقالات Hugging Face:")
        posts = self.get_hf_blog_posts()
        for i, post in enumerate(posts, 1):
            print(f"\\n{i}. {post['title']}")
            print(f"   الرابط: {post['link']}")

# تشغيل
scraper = AINewsScraper()
scraper.display_news()
`
    }
  ];

  useEffect(() => {
    setExamples(codeExamples);
    if (codeExamples.length > 0) {
      setSelectedExample(codeExamples[0]);
    }
  }, []);

  const copyToClipboard = () => {
    if (selectedExample) {
      navigator.clipboard.writeText(selectedExample.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadCode = () => {
    if (selectedExample) {
      const blob = new Blob([selectedExample.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedExample.path.split('/').pop() || 'code.py';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">💻 أمثلة برمجية من GitHub</h2>
          <p className="text-slate-400">أمثلة عملية جاهزة للاستخدام</p>
        </div>
        <a
          href="https://github.com/Soldiom/aiguidepro"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>عرض في GitHub</span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Examples List */}
        <div className="space-y-2">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setSelectedExample(example)}
              className={`w-full text-right p-4 rounded-lg transition-all ${
                selectedExample?.name === example.name
                  ? 'bg-emerald-500/20 border-2 border-emerald-500'
                  : 'bg-slate-900 border-2 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <Code className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">{example.name}</h3>
                  <p className="text-xs text-slate-400">{example.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Code Display */}
        <div className="lg:col-span-2">
          {selectedExample && (
            <div className="bg-slate-900 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="bg-slate-950 p-4 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-slate-300">{selectedExample.path}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
                    title="نسخ الكود"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={downloadCode}
                    className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
                    title="تحميل الملف"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Code */}
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="text-slate-300 font-mono">
                  {selectedExample.content}
                </code>
              </pre>

              {/* Footer */}
              <div className="bg-slate-950 p-4 border-t border-slate-700">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Language: {selectedExample.language}</span>
                  <span>•</span>
                  <span>Lines: {selectedExample.content.split('\\n').length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-sm text-blue-300">
          💡 <strong>نصيحة:</strong> يمكنك تشغيل هذه الأمثلة مباشرة في Google Colab أو في بيئتك المحلية. 
          تأكد من تثبيت المكتبات المطلوبة أولاً.
        </p>
      </div>
    </div>
  );
};

export default GitHubCodeExamples;
