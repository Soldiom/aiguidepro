import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Download, Sparkles, Terminal } from 'lucide-react';

const CodePlayground: React.FC = () => {
  const [code, setCode] = useState(`# مرحباً بك في ساحة البرمجة!
# اكتب كود Python وشغله مباشرة في المتصفح

print("مرحباً بالعالم!")

# مثال: حساب مجموع الأعداد
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
print(f"المجموع: {total}")

# مثال: استخدام الذكاء الاصطناعي
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print("\\nمتتالية فيبوناتشي:")
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);

  useEffect(() => {
    // Load Pyodide for Python execution in browser
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
    script.async = true;
    script.onload = async () => {
      try {
        // @ts-ignore
        const pyodide = await loadPyodide();
        // @ts-ignore
        window.pyodide = pyodide;
        setPyodideReady(true);
        setOutput('✅ Python environment ready! اكتب كودك وشغله.');
      } catch (error) {
        setOutput('❌ Failed to load Python environment');
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const runCode = async () => {
    if (!pyodideReady) {
      setOutput('⏳ Python environment is loading...');
      return;
    }

    setIsRunning(true);
    setOutput('');

    try {
      // @ts-ignore
      const pyodide = window.pyodide;
      
      // Capture stdout
      await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `);

      // Run user code
      await pyodide.runPythonAsync(code);

      // Get output
      const stdout = await pyodide.runPythonAsync('sys.stdout.getvalue()');
      setOutput(stdout || '✅ Code executed successfully (no output)');
    } catch (error: any) {
      setOutput(`❌ Error:\\n${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(`# اكتب كودك هنا
print("Hello, World!")
`);
    setOutput('');
  };

  const aiSuggest = async () => {
    setOutput('🤖 AI Suggestion: Try adding error handling or optimize your code!');
    // In a real implementation, this would call an AI API
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  const examples = [
    {
      name: 'مثال: حلقات',
      code: `# مثال على الحلقات
for i in range(1, 6):
    print(f"العدد: {i}, المربع: {i**2}")
`
    },
    {
      name: 'مثال: قوائم',
      code: `# العمل مع القوائم
fruits = ['تفاح', 'موز', 'برتقال']
print("الفواكه:", fruits)

# إضافة عنصر
fruits.append('عنب')
print("بعد الإضافة:", fruits)

# الفرز
numbers = [5, 2, 8, 1, 9]
numbers.sort()
print("الأعداد المرتبة:", numbers)
`
    },
    {
      name: 'مثال: دوال',
      code: `# تعريف دالة
def greet(name):
    return f"مرحباً {name}!"

# استخدام الدالة
print(greet("علي"))
print(greet("فاطمة"))

# دالة مع معاملات متعددة
def calculate(a, b, operation='+'):
    if operation == '+':
        return a + b
    elif operation == '-':
        return a - b
    elif operation == '*':
        return a * b
    elif operation == '/':
        return a / b if b != 0 else "خطأ: القسمة على صفر"

print(f"10 + 5 = {calculate(10, 5, '+')}")
print(f"10 * 5 = {calculate(10, 5, '*')}")
`
    }
  ];

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">🎮 ساحة البرمجة التفاعلية</h2>
        <p className="text-slate-400">اكتب وشغل كود Python مباشرة في المتصفح</p>
      </div>

      {/* Examples */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => setCode(example.code)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-lg text-sm whitespace-nowrap transition-colors"
          >
            {example.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code Editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-300">
              محرر الأكواد
            </label>
            <div className="flex gap-2">
              <button
                onClick={resetCode}
                className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                title="إعادة تعيين"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={downloadCode}
                className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                title="تحميل"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-96 bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            spellCheck={false}
            dir="ltr"
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={runCode}
              disabled={isRunning || !pyodideReady}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'جاري التشغيل...' : pyodideReady ? 'تشغيل الكود' : 'تحميل...'}
            </button>
            <button
              onClick={aiSuggest}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-colors"
              title="اقتراحات AI"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Output */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            المخرجات
          </label>
          <div className="w-full h-96 bg-slate-900 text-slate-100 rounded-lg p-4 overflow-y-auto font-mono text-sm whitespace-pre-wrap">
            {output || <span className="text-slate-500">المخرجات ستظهر هنا...</span>}
          </div>
          <div className="mt-3 p-3 bg-slate-900 rounded-lg">
            <p className="text-xs text-slate-400">
              💡 <strong>نصيحة:</strong> يمكنك استخدام جميع مكتبات Python الأساسية. 
              للمكتبات المتقدمة، استخدم Google Colab.
            </p>
          </div>
        </div>
      </div>

      {/* Features Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <h4 className="font-semibold text-emerald-300 mb-1">⚡ تشغيل فوري</h4>
          <p className="text-sm text-slate-400">تنفيذ الكود مباشرة في المتصفح بدون خادم</p>
        </div>
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="font-semibold text-blue-300 mb-1">🔒 آمن تماماً</h4>
          <p className="text-sm text-slate-400">يعمل في بيئة معزولة sandbox آمنة</p>
        </div>
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <h4 className="font-semibold text-purple-300 mb-1">🤖 مدعوم بـ AI</h4>
          <p className="text-sm text-slate-400">احصل على اقتراحات وتحسينات ذكية</p>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
