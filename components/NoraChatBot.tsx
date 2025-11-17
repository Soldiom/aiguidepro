import React, { useState, useRef, useEffect } from 'react';
import { chatWithNora } from '../services/geminiService';
import noraAvatar from '../src/assets/images/nora_ai_avatar.png';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'nora';
  timestamp: Date;
}

type StoredMessage = Omit<Message, 'timestamp'> & { timestamp: string };
type StatusBanner = { type: 'info' | 'error'; message: string } | null;

const STORAGE_KEY = 'aiguidepro.nora.chatHistory';
const MAX_HISTORY = 30;

const createWelcomeMessage = (): Message => ({
  id: 'welcome',
  text: 'مرحباً! أنا نورا، مرشدتك في عالم الذكاء الاصطناعي 🤖✨\n\nسأكون معك في كل خطوة من رحلة تعلمك. كيف يمكنني مساعدتك اليوم؟',
  sender: 'nora',
  timestamp: new Date(),
});

const reviveMessages = (payload: unknown): Message[] => {
  if (!Array.isArray(payload)) return [];
  return payload
    .map((msg) => {
      if (!msg || typeof msg !== 'object') return null;
      const stored = msg as StoredMessage;
      return {
        ...stored,
        timestamp: stored.timestamp ? new Date(stored.timestamp) : new Date(),
      };
    })
    .filter((msg): msg is Message => !!msg && !Number.isNaN(msg.timestamp.getTime()));
};

const loadInitialMessages = () => {
  if (typeof window === 'undefined') return [createWelcomeMessage()];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [createWelcomeMessage()];
    const parsed = JSON.parse(raw);
    const revived = reviveMessages(parsed);
    return revived.length ? revived : [createWelcomeMessage()];
  } catch {
    return [createWelcomeMessage()];
  }
};

const NoraChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(loadInitialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  const [status, setStatus] = useState<StatusBanner>(null);
  const [retryPayload, setRetryPayload] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>(messages);
  messagesRef.current = messages;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleOnline = () => {
      setIsOnline(true);
      setStatus({ type: 'info', message: 'تم استعادة الاتصال، يمكنك المتابعة الآن.' });
    };
    const handleOffline = () => {
      setIsOnline(false);
      setStatus({ type: 'error', message: 'الاتصال غير متاح حالياً. سيتم حفظ رسائلك وإرسالها لاحقاً.' });
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload: StoredMessage[] = messages.slice(-MAX_HISTORY).map((msg) => ({
      ...msg,
      timestamp: msg.timestamp.toISOString(),
    }));
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(null), 8000);
    return () => clearTimeout(timer);
  }, [status]);

  const appendMessage = (message: Message) => {
    setMessages((prev) => {
      const next = [...prev, message];
      return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next;
    });
  };

  const handleSend = async (overrideText?: string) => {
    const preparedText = (overrideText ?? input).trim();
    if (!preparedText || isLoading) return;
    if (!isOnline) {
      setStatus({ type: 'error', message: 'لا يوجد اتصال بالإنترنت. أعد المحاولة بعد استعادة الاتصال.' });
      setRetryPayload(preparedText);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: preparedText,
      sender: 'user',
      timestamp: new Date(),
    };

    appendMessage(userMessage);
    if (!overrideText) {
      setInput('');
    }
    setIsLoading(true);
    setStatus(null);
    setRetryPayload(null);

    try {
      const conversationHistory = [...messagesRef.current, userMessage].map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

      const response = await chatWithNora(preparedText, conversationHistory);

      const noraMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'nora',
        timestamp: new Date(),
      };
      appendMessage(noraMessage);
    } catch (error) {
      const friendlyError =
        error instanceof Error ? error.message : 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.';
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `⚠️ ${friendlyError}`,
        sender: 'nora',
        timestamp: new Date(),
      };
      appendMessage(errorMessage);
      setStatus({ type: 'error', message: friendlyError });
      setRetryPayload(preparedText);
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
    'ما هو الذكاء الاصطناعي؟',
    'كيف أبدأ تعلم AI؟',
    'ما الفرق بين AI و ML؟',
    'أريد دورة للمبتدئين',
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 group"
        aria-label="فتح محادثة مع نورا"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
            <img src={noraAvatar} alt="نورا" className="w-14 h-14 rounded-full object-cover" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
            <span className="text-white text-xs">💬</span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-96 h-[600px] bg-slate-900 rounded-2xl shadow-2xl border border-emerald-500/30 flex flex-col overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={noraAvatar} alt="نورا" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
          <div>
            <h3 className="text-white font-bold">نورا AI</h3>
            <p className="text-emerald-100 text-xs">خبيرة ذكاء اصطناعي</p>
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

      {!isOnline && (
        <div className="bg-amber-500/10 text-amber-100 px-4 py-2 text-xs border-b border-amber-500/30">
          الإرسال متوقف مؤقتاً لعدم توفر الاتصال. سنعاود المحاولة تلقائياً فور عودة الشبكة.
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-emerald-500 text-white'
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
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {status && (
        <div
          className={`mx-4 mt-3 rounded-xl px-4 py-2 text-xs border ${
            status.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-100'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span>{status.message}</span>
            {retryPayload && status.type === 'error' && (
              <button
                onClick={() => handleSend(retryPayload)}
                className="text-emerald-300 underline decoration-dotted text-[11px] hover:text-emerald-200"
              >
                إعادة المحاولة
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="px-4 py-2 bg-slate-900/80 border-t border-slate-800">
          <p className="text-xs text-slate-400 mb-2">أسئلة سريعة:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-xs px-3 py-1 bg-slate-800 text-slate-300 rounded-full hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors border border-slate-700"
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
            onChange={(e) => {
              setInput(e.target.value);
              if (status?.type === 'error') {
                setStatus(null);
                setRetryPayload(null);
              }
            }}
            onKeyPress={handleKeyPress}
            placeholder="اكتب سؤالك هنا..."
            className="flex-1 bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoraChatBot;
