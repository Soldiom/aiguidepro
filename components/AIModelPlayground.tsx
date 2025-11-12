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

const AIModelPlayground: React.FC = () => {
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
      model: 'CAMeL-Lab/bert-base-arabic-camelbert-ca'
    },
    {
      id: 'code-generation',
      name: 'Code Generation',
      nameAr: 'توليد الأكواد البرمجية',
      description: 'Generate code from description',
      icon: <Code className="w-5 h-5" />,
      type: 'code',
      model: 'Qwen/Qwen2.5-Coder-32B-Instruct'
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
    if (!input.trim()) return;
    
    setIsLoading(true);
    setOutput('');

    try {
      const currentModel = models.find(m => m.id === selectedModel);
      
      if (currentModel?.type === 'text' || currentModel?.type === 'code') {
        // Use Gemini for text/code generation
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: selectedModel === 'code-generation' 
                    ? `Generate code for: ${input}\n\nProvide clean, working code with comments.`
                    : selectedModel === 'sentiment'
                    ? `Analyze the sentiment of this Arabic text and respond in Arabic: "${input}"\n\nProvide: sentiment (positive/negative/neutral) and confidence score.`
                    : input
                }]
              }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
              }
            })
          }
        );

        const data = await response.json();
        setOutput(data.candidates?.[0]?.content?.parts?.[0]?.text || 'No output generated');
      } else if (currentModel?.type === 'image') {
        setOutput('🎨 Image generation feature coming soon! Use Hugging Face Spaces for now:\nhttps://huggingface.co/spaces/black-forest-labs/FLUX.1-schnell');
      }
    } catch (error) {
      console.error('Error running model:', error);
      setOutput('Error: Failed to generate output. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentModel = models.find(m => m.id === selectedModel);

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">🧪 AI Model Playground</h2>
        <p className="text-slate-400">جرب نماذج الذكاء الاصطناعي مباشرة</p>
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
                : 'border-slate-700 bg-slate-900 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {model.icon}
              <span className="font-semibold text-white text-sm">{model.nameAr}</span>
            </div>
            <p className="text-xs text-slate-400">{model.description}</p>
          </button>
        ))}
      </div>

      {/* Input/Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            المدخلات (Input)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedModel === 'text-generation' ? 'اكتب نصاً أو سؤالاً...' :
              selectedModel === 'sentiment' ? 'أدخل نصاً عربياً لتحليل مشاعره...' :
              selectedModel === 'code-generation' ? 'Describe what code you want to generate...' :
              'Describe the image you want to generate...'
            }
            className="w-full h-40 bg-slate-900 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
          <button
            onClick={runModel}
            disabled={isLoading || !input.trim()}
            className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="w-4 h-4" />
            {isLoading ? 'جاري المعالجة...' : 'تشغيل النموذج'}
          </button>
        </div>

        {/* Output */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            المخرجات (Output)
          </label>
          <div className="w-full h-40 bg-slate-900 text-slate-300 rounded-lg p-4 overflow-y-auto whitespace-pre-wrap">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            ) : output ? (
              output
            ) : (
              <span className="text-slate-500">النتيجة ستظهر هنا...</span>
            )}
          </div>
          {currentModel && (
            <p className="mt-2 text-xs text-slate-500">
              Model: {currentModel.model}
            </p>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-sm text-blue-300">
          💡 <strong>نصيحة:</strong> هذه النماذج تعمل مباشرة في المتصفح باستخدام Gemini API. 
          للحصول على نتائج أفضل، جرب نماذج Hugging Face المتخصصة.
        </p>
      </div>
    </div>
  );
};

export default AIModelPlayground;
