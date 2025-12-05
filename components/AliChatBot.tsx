import React, { useState, useRef, useEffect } from 'react';
import { chatWithNora } from '../services/geminiService';
import noraAvatar from '../src/assets/images/nora_ai_avatar.png'; // You might want to update this avatar later

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'nora'; // Keeping 'nora' for now to avoid breaking styles, can be refactored to 'assistant'
  timestamp: Date;
}

export default function AliChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'هلا بالغالي! أنا علي، عقلك المدبر في SOLDIOM OS. آمرني، شتبي نسوي اليوم؟',
      sender: 'nora',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await chatWithNora(input, conversationHistory);

      const noraMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'nora',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, noraMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        sender: 'nora',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "شنو تقدر تسوي؟",
    "تحليل مالي",
    "خطة تسويق",
    "تحليل قانوني"
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 group"
        aria-label="فتح محادثة مع علي"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
            {/* You can replace this with a new avatar for Ali */}
            <span className="text-2xl">🤖</span>
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
            <span className="text-white text-xs">💬</span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-96 h-[600px] bg-slate-900 rounded-2xl shadow-2xl border border-blue-500/30 flex flex-col overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-white bg-slate-800 flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h3 className="text-white font-bold">SOLDIOM ASI</h3>
            <p className="text-blue-100 text-xs">نظام تشغيل ذكي</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white transition-colors"
          aria-label="إغلاق"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-200'
                }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
              <span className="text-xs opacity-60 mt-1 block">
                {message.timestamp.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl px-4 py-3">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="px-4 py-2 bg-slate-900/80 border-t border-slate-800">
          <p className="text-xs text-slate-400 mb-2">أوامر سريعة:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-xs px-3 py-1 bg-slate-800 text-slate-300 rounded-full hover:bg-blue-500/20 hover:text-blue-400 transition-colors border border-slate-700"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اكتب أمرك هنا..."
            className="flex-1 bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
