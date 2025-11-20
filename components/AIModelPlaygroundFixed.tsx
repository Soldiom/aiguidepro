import React, { useState } from 'react';
import { Play, Code, Image, MessageSquare, Sparkles } from 'lucide-react';

interface ModelDemo {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  icon: React.ReactNode;
  type: 'text' | 'image' | 'code';
  model: string;
}

const AIModelPlaygroundFixed: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('text-generation');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const models: ModelDemo[] = [
    {
      id: 'text-generation',
      name: 'Arabic Text Generation',
      nameAr: 'توليد النصوص العربية',
      description: 'Generate Arabic text using AI',
      icon: <MessageSquare className="w-5 h-5" />,
      type: 'text',
      model: 'google/gemma-2-2b-it'
    },
    {
      id: 'sentiment',
      name: 'Arabic Sentiment Analysis',
      nameAr: 'تحليل المشاعر',
      description: 'Analyze sentiment in Arabic text',
      icon: <Sparkles className="w-5 h-5" />,
      type: 'text',
      model: 'google/gemini-2-2b-it'
    },
    {
      id: 'code-generation',
      name: 'Code Generation',
      nameAr: 'توليد الأكواد البرمجية',
      description: 'Generate code from description',
      icon: <Code className="w-5 h-5" />,
      type: 'code',
      model: 'google/gemma-2-2b-it'
    },
    {
      id: 'image-generation',
      name: 'Image Generation',
      nameAr: 'توليد الصور',
      description: 'Generate images from text',
      icon: <Image className="w-5 h-5" />,
      type: 'image',
      model: 'black-forest-labs/FLUX.1-schnell'
    }
  ];

  const runModel = async () => {
    if (!input.trim()) {
      setOutput('⚠️ الرجاء إدخال نص أولاً');
      return;
    }
    
    setIsLoading(true);
    setOutput('');

    try {
      const currentModel = models.find(m => m.id === selectedModel);
      
      if (currentModel?.type === 'image') {
        setOutput(`🎨 **ميزة توليد الصور**\n\nللحصول على أفضل النتائج، استخدم:\n\n1. **FLUX.1 على Hugging Face:**\n   https://huggingface.co/spaces/black-forest-labs/FLUX.1-schnell\n\n2. **Stable Diffusion:**\n   https://huggingface.co/spaces/stabilityai/stable-diffusion\n\n3. **Midjourney** (مدفوع): https://midjourney.com\n\n💡 **نصيحة:** اكتب وصفاً تفصيلياً بالإنجليزية للحصول على أفضل النتائج.`);
        setIsLoading(false);
        return;
      }

      // Use Hugging Face Inference API (free tier)
      const HF_API_URL = `https://api-inference.huggingface.co/models/${currentModel?.model}`;
      
      let prompt = input;
      if (selectedModel === 'code-generation') {
        prompt = `Generate clean, working code for: ${input}\n\nProvide code with comments in Arabic.`;
      } else if (selectedModel === 'sentiment') {
        prompt = `قم بتحليل المشاعر في النص التالي وأعطني النتيجة بالعربية:\n\n"${input}"\n\nالنتيجة (إيجابي/سلبي/محايد) مع درجة الثقة:`;
      }

      // Try Hugging Face API first
      try {
        const response = await fetch(HF_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 512,
              temperature: 0.7,
              top_p: 0.95,
              return_full_text: false
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const generatedText = data[0]?.generated_text || data.generated_text || JSON.stringify(data);
          setOutput(generatedText);
        } else {
          throw new Error('HF API failed');
        }
      } catch (hfError) {
        // Fallback to demo mode
        setOutput(getDemoOutput(selectedModel, input));
      }
    } catch (error) {
      console.error('Error running model:', error);
      setOutput(getDemoOutput(selectedModel, input));
    } finally {
      setIsLoading(false);
    }
  };

  const getDemoOutput = (modelId: string, userInput: string): string => {
    switch (modelId) {
      case 'text-generation':
        return `**نص مولّد تجريبي:**\n\nبناءً على مدخلك "${userInput}"، يمكن للذكاء الاصطناعي توليد نصوص عربية متقدمة.\n\nالذكاء الاصطناعي أصبح جزءاً أساسياً من حياتنا اليومية. من المساعدين الافتراضيين إلى السيارات ذاتية القيادة، تطبيقات الذكاء الاصطناعي تتوسع باستمرار.\n\n💡 **ملاحظة:** هذا مثال تجريبي. للحصول على نتائج حقيقية، قم بتكوين API key من Hugging Face أو منصات AI أخرى.`;
      
      case 'sentiment':
        const sentiment = userInput.includes('جيد') || userInput.includes('ممتاز') || userInput.includes('رائع') ? 'إيجابي' : 
                         userInput.includes('سيء') || userInput.includes('سلبي') ? 'سلبي' : 'محايد';
        return `**تحليل المشاعر:**\n\n📊 **النتيجة:** ${sentiment}\n🎯 **درجة الثقة:** 85%\n\n**التحليل:**\nالنص يحتوي على مؤشرات ${sentiment === 'إيجابي' ? 'إيجابية' : sentiment === 'سلبي' ? 'سلبية' : 'محايدة'}.\n\n💡 **ملاحظة:** هذا تحليل تجريبي بسيط. للحصول على تحليل دقيق، استخدم نماذج متخصصة.`;
      
      case 'code-generation':
        return `**كود مولّد:**\n\n\`\`\`python\n# ${userInput}\n\ndef main():\n    # تنفيذ المهمة المطلوبة\n    print("مرحباً بك في AI Guide Pro!")\n    \n    # معالجة البيانات\n    data = process_data()\n    \n    # عرض النتائج\n    display_results(data)\n\nif __name__ == "__main__":\n    main()\n\`\`\`\n\n💡 **ملاحظة:** هذا مثال عام. للحصول على كود دقيق حسب متطلباتك، استخدم GPT-4 أو Claude.`;
      
      default:
        return 'نتيجة تجريبية';
    }
  };

  const currentModel = models.find(m => m.id === selectedModel);

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">
          AI Model Playground 🧪
        </h2>
        <p className="text-slate-400">
          جرب نماذج الذكاء الاصطناعي مباشرة في المتصفح
        </p>
      </div>

      {/* Model Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => setSelectedModel(model.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedModel === model.id
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {model.icon}
              <span className="font-semibold text-white">{model.nameAr}</span>
            </div>
            <p className="text-xs text-slate-400">{model.description}</p>
          </button>
        ))}
      </div>

      {/* Input Section */}
      <div className="mb-4">
        <label className="block text-white font-semibold mb-2">
          المدخلات (Input)
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            selectedModel === 'code-generation'
              ? 'مثال: اكتب كود Python لحساب مجموع الأعداد...'
              : selectedModel === 'sentiment'
              ? 'مثال: هذا المنتج رائع وأنصح به بشدة!'
              : 'اكتب رأيك أو اقتراحك هنا...'
          }
          className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-4 text-white resize-none focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Run Button */}
      <button
        onClick={runModel}
        disabled={isLoading || !input.trim()}
        className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            جاري التحميل...
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            تشغيل النموذج
          </>
        )}
      </button>

      {/* Output Section */}
      {output && (
        <div className="mt-6">
          <label className="block text-white font-semibold mb-2">
            المخرجات (Output)
          </label>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 min-h-[200px]">
            <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm">
              {output}
            </pre>
          </div>
        </div>
      )}

       {/* Info Box */}
      <div className="mt-6 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
        <p className="text-sm text-emerald-300 mb-2">
          ✨ **الوضع التجريبي:** هذه الميزات تعمل في الوضع التجريبي حالياً.
        </p>
        <p className="text-xs text-emerald-400">
          💡 للحصول على نتائج حقيقية قوية، استخدم <strong>AIGuidePro ChatGPT</strong> - مستشارك الشخصي في الذكاء الاصطناعي!
          <br/>
          🔗 <a href="https://chatgpt.com/g/g-sw3sWxPbP-aiguidepro" target="_blank" className="underline hover:text-white">اضغط هنا للوصول إلى AIGuidePro</a>
        </p>
      </div>

      {/* Model Info */}
      <div className="mt-4 text-xs text-slate-500 text-center">
        Model: {currentModel?.model} | Type: {currentModel?.type}
      </div>
    </div>
  );
};

export default AIModelPlaygroundFixed;
