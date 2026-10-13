// frontend/src/pages/AssistantPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ExternalLink, 
  ShieldCheck, 
  Key, 
  Settings2, 
  X, 
  RefreshCw, 
  ChevronRight,
  BookOpen,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ChatMessage, Citation } from '../types';

export const AssistantPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Namaste! I am BharatScheme AI, your multilingual assistant for discovering Indian Government welfare schemes, eligibility rules, and official application procedures.\n\nYou can ask me questions in English, Hindi, or Marathi. How can I help you today?",
      suggested_followups: [
        "What scholarships are available for college students?",
        "How do I apply for the PM-KISAN ₹6,000 scheme?",
        "How does Ayushman Bharat ₹5 Lakh health cover work?",
        "What are the benefits of Mukhyamantri Majhi Ladki Bahin Yojana?"
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('bharatscheme_llm_key') || '');
  const [llmProvider, setLlmProvider] = useState<'gemini' | 'openai' | 'offline'>(() => {
    return (localStorage.getItem('bharatscheme_llm_provider') as any) || 'gemini';
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const saveSettings = () => {
    localStorage.setItem('bharatscheme_llm_key', apiKey.trim());
    localStorage.setItem('bharatscheme_llm_provider', llmProvider);
    setShowSettings(false);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend.trim(),
          language: language,
          api_key: apiKey.trim() || null,
          llm_provider: llmProvider
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg: ChatMessage = {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: data.answer,
          citations: data.citations,
          suggested_followups: data.suggested_followups,
          referenced_schemes: data.referenced_schemes,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error('Failed to fetch response');
      }
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: "I encountered an error connecting to the knowledge retrieval engine. Please ensure the backend server is running and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "What schemes can a farmer apply for?",
    "Tell me about the Pragati scholarship for engineering girl students",
    "How can street vendors get working capital under PM SVANidhi?",
    "Is there a scheme for traditional craftspeople and artisans?",
    "What are the benefits of Atal Pension Yojana?"
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-100/60 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Assistant Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  BharatScheme AI Assistant
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  RAG Grounded
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Answers powered by verified scheme guidelines and official criteria.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language toggle button */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  language === 'en' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  language === 'hi' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('mr')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  language === 'mr' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                मराठी
              </button>
            </div>

            {/* Optional LLM API Key Settings */}
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              title="Configure Optional LLM API Key"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SETTINGS DRAWER / MODAL */}
        {showSettings && (
          <div className="bg-white rounded-3xl border border-blue-200 shadow-lg p-6 mb-6 animate-in slide-in-from-top-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-slate-900 text-base">
                  Configurable LLM Integration (Optional)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              BharatScheme AI includes a <strong>built-in grounded RAG engine</strong> that works completely offline without any API key. If you wish to connect your own external Google Gemini or OpenAI API key for creative chat expansion, you can enter it below. The key stays exclusively in your local browser storage.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  LLM Provider
                </label>
                <select
                  value={llmProvider}
                  onChange={(e) => setLlmProvider(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  <option value="gemini">Google Gemini (Default)</option>
                  <option value="openai">OpenAI (GPT-4o-mini)</option>
                  <option value="offline">Internal Grounded RAG Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy... or sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveSettings}
                className="px-4 py-1.5 rounded-lg bg-blue-900 text-white text-xs font-bold hover:bg-blue-800"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* CHAT MESSAGES WINDOW */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-6 flex flex-col h-[560px] overflow-hidden">
          
          <div className="flex-1 overflow-y-auto space-y-5 pr-1">
            {messages.map((msg) => {
              const isBot = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white shadow-2xs ${
                      isBot ? 'bg-blue-900 text-orange-300' : 'bg-slate-800 text-white'
                    }`}
                  >
                    {isBot ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>

                  {/* Message Bubble Container */}
                  <div className={`max-w-[85%] space-y-3 ${isBot ? 'text-left' : 'text-right'}`}>
                    
                    <div
                      className={`inline-block px-4 sm:px-5 py-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line text-left ${
                        isBot
                          ? 'bg-slate-50 border border-slate-200 text-slate-800 shadow-2xs'
                          : 'bg-blue-900 text-white shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Citations Box (Grounded Retrieval Proof) */}
                    {isBot && msg.citations && msg.citations.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-left space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-900">
                          <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                          <span>Grounded Source Citations</span>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {msg.citations.map((cite, i) => (
                            <a
                              key={i}
                              href={cite.official_portal_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white border border-blue-200 text-blue-900 hover:bg-blue-100 transition-colors"
                            >
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span className="truncate max-w-[200px]">{cite.title}</span>
                              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Referenced Scheme Cards */}
                    {isBot && msg.referenced_schemes && msg.referenced_schemes.length > 0 && (
                      <div className="space-y-2 text-left">
                        {msg.referenced_schemes.slice(0, 2).map((scheme) => (
                          <div
                            key={scheme.id}
                            className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs"
                          >
                            <div className="min-w-0">
                              <div className="text-[10px] uppercase font-bold text-slate-400">
                                {scheme.category}
                              </div>
                              <div className="text-xs font-bold text-slate-900 truncate">
                                {scheme.title}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <a
                                href={scheme.portal}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-md bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-bold flex items-center gap-1"
                              >
                                <span>Portal</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggested Follow-up Questions */}
                    {isBot && msg.suggested_followups && msg.suggested_followups.length > 0 && (
                      <div className="text-left pt-1">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <HelpCircle className="w-3 h-3 text-slate-400" />
                          <span>Suggested Next Questions:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggested_followups.map((followup, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSend(followup)}
                              className="text-left text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-700 transition-colors"
                            >
                              {followup}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 px-1">
                      {msg.timestamp}
                    </div>

                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-900 text-orange-300 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-slate-100 text-slate-600 text-xs flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
                  <span>Searching verified scheme knowledge base & generating answer...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="pt-3 pb-2 border-t border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0">Try asking:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p)}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium shrink-0 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-center mt-1"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about any scheme, qualification condition, or application step..."
              disabled={loading}
              className="w-full pl-4 pr-12 py-3.5 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="absolute right-2.5 p-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
