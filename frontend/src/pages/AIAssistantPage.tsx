import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Languages,
  Sparkles,
  ShieldAlert,
  LifeBuoy,
  User,
  AlertCircle,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';
import { CyberButton } from '../components/common/CyberButton';
import { Badge } from '../components/common/Badge';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  provider?: string;
  timestamp: string;
}

export const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `### 🛡️ Welcome to REDLINE Cyber Safety AI Advisor

I am your personal cybersecurity guide. Ask me any question about suspicious messages, scams, privacy permissions, or account recovery in simple English or Malayalam.

**How can I assist you today?**`,
      provider: 'REDLINE Cyber Defense Core Engine',
      timestamp: 'Active Now',
    },
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<'en' | 'ml'>('en');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedPrompts = [
    { en: 'What is a "Digital Arrest" scam?', ml: 'എന്താണ് "ഡിജിറ്റൽ അറസ്റ്റ്" തട്ടിപ്പ്?' },
    { en: 'I accidentally clicked a suspicious link!', ml: 'ഞാൻ അബദ്ധത്തിൽ ഒരു വ്യാജ ലിങ്കിൽ ക്ലിക്ക് ചെയ്തു!' },
    { en: 'I shared my OTP and money was debited!', ml: 'ഞാൻ OTP നൽകി, അക്കൗണ്ടിൽ നിന്ന് പണം നഷ്ടപ്പെട്ടു!' },
    { en: 'Does receiving money on UPI require a PIN?', ml: 'യു.പി.ഐ വഴി പണം സ്വീകരിക്കാൻ പിൻ നമ്പർ അടിക്കണോ?' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInput('');
    setIsLoading(true);

    try {
      const res = await api.sendChatMessage(textToSend.trim(), language);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: res.response,
        provider: res.provider,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, I encountered an issue processing your query. Please check your network connection.',
        provider: 'System Error',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: `### 🛡️ REDLINE Cyber Defense Advisor\n\nSession reset. How can I help you protect your digital safety?`,
        provider: 'REDLINE Cyber Defense Core Engine',
        timestamp: 'Active Now',
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101014] border border-[#FF3038]/30 text-xs font-mono text-[#FF5555] mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>AI THREAT INTEL AGENT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading uppercase text-white tracking-wide">
            AI Cyber <span className="text-[#FF3038]">Assistant</span>
          </h1>
          <p className="text-sm text-[#A0A0A8] max-w-xl mt-1">
            Ask cybersecurity questions in plain English or Malayalam. Powered by Gemini API with offline threat defense fallback.
          </p>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-2 bg-[#101014] p-1.5 rounded-xl border border-[#FF3038]/30">
          <Languages className="w-4 h-4 text-[#FF3038] ml-1.5" />
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-lg text-xs font-heading uppercase tracking-wider font-semibold transition ${
              language === 'en'
                ? 'bg-[#FF3038] text-white shadow-[0_0_10px_#FF3038]'
                : 'text-[#A0A0A8] hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('ml')}
            className={`px-3 py-1 rounded-lg text-xs font-heading font-semibold transition ${
              language === 'ml'
                ? 'bg-[#FF3038] text-white shadow-[0_0_10px_#FF3038]'
                : 'text-[#A0A0A8] hover:text-white'
            }`}
          >
            മലയാളം
          </button>
        </div>
      </div>

      {/* Main Terminal Chat Container */}
      <div className="rounded-2xl bg-[#0A0A0E] border border-[#FF3038]/40 shadow-[0_0_35px_rgba(255,48,56,0.18)] overflow-hidden flex flex-col h-[calc(100vh-230px)] min-h-[460px] max-h-[660px]">
        {/* Terminal Header */}
        <div className="bg-[#101014] px-5 py-3 border-b border-[#FF3038]/20 flex items-center justify-between text-xs font-mono text-[#A0A0A8]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-white font-semibold">REDLINE Defense Core • Online</span>
            <span className="text-[11px] text-[#666672]">({language === 'ml' ? 'Malayalam Mode' : 'English Mode'})</span>
          </div>
          <button
            onClick={handleClear}
            className="flex items-center gap-1 hover:text-white transition"
            title="Clear Chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-[#101014] border border-[#FF3038]/40 flex items-center justify-center text-[#FF3038] shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#FF3038]/20 border border-[#FF3038] text-white rounded-tr-none'
                      : 'bg-[#101014] border border-white/10 text-[#E0E0E8] rounded-tl-none space-y-2'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-[#666672] pt-1">
                    <span>{msg.provider || ''}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-[#161620] border border-white/20 flex items-center justify-center text-[#A0A0A8] shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-[#101014] border border-[#FF3038]/40 flex items-center justify-center text-[#FF3038] shrink-0 mt-0.5">
                <Bot className="w-4 h-4 animate-spin-slow" />
              </div>
              <div className="bg-[#101014] border border-white/10 rounded-2xl p-4 text-xs text-[#A0A0A8] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF3038] animate-ping" />
                <span>Analyzing threat scenario & formulating defensive advice...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="p-3 bg-[#08080C] border-t border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-mono text-[#666672] shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#FF5555]" /> Quick:
          </span>
          {suggestedPrompts.map((p, idx) => {
            const promptText = language === 'ml' ? p.ml : p.en;
            return (
              <button
                key={idx}
                onClick={() => handleSend(promptText)}
                className="text-[11px] font-mono px-3 py-1 rounded-full bg-white/5 hover:bg-[#FF3038]/20 border border-white/10 hover:border-[#FF3038]/50 text-[#A0A0A8] hover:text-[#FF5555] transition whitespace-nowrap"
              >
                {promptText}
              </button>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#101014] border-t border-[#FF3038]/20 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={
              language === 'ml'
                ? 'സൈബർ സുരക്ഷയെക്കുറിച്ച് എന്തും ചോദിക്കൂ... (ഉദാ: വ്യാജ ലിങ്ക്, ഡിജിറ്റൽ അറസ്റ്റ്)'
                : 'Ask cybersecurity questions (e.g., suspicious link, fake call, UPI rule)...'
            }
            className="flex-1 bg-[#07070A] border border-[#FF3038]/30 focus:border-[#FF3038] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#666672] focus:outline-none transition"
          />
          <CyberButton
            variant="primary"
            size="md"
            icon={<Send className="w-4 h-4" />}
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
          >
            Send
          </CyberButton>
        </div>
      </div>
    </div>
  );
};
