import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, RecruitmentSuite } from '../types/recruitment';
import {
  MessageSquare,
  Send,
  Sparkles,
  Brain,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  X,
  Maximize2,
  Minimize2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface RecruitingChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  recruitmentSuite: RecruitmentSuite | null;
  rawNotes: string;
}

export const RecruitingChatbot: React.FC<RecruitingChatbotProps> = ({
  isOpen,
  onClose,
  recruitmentSuite,
  rawNotes,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Hello! I'm your **Recruiter Copilot** and Senior Talent Acquisition Partner.

I'm loaded with context on your raw notes, generated LinkedIn Job Description, and 10-Question Behavioral Guide. How can I help you optimize your hiring loop today?

**Try one of these quick workflows:**
- *Draft an outbound LinkedIn InMail to attract passive candidates*
- *Audit the JD for unconscious bias or exclusionary language*
- *Calibrate Question #2 with deeper technical probes*
- *Create a 30-60-90 day ramp plan for this role*`,
      timestamp: Date.now(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelChoice, setModelChoice] = useState<'gemini-4-argon' | 'gemini-3.8-flash' | 'gemini-3.1-flash-lite'>('gemini-4-argon');
  const [highThinking, setHighThinking] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          context: {
            jobDescription: recruitmentSuite?.jobDescription,
            interviewGuide: recruitmentSuite?.interviewGuide,
            rawNotes,
          },
          modelChoice,
          highThinking,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Chat request failed');
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.reply || 'I processed your request, but received an empty response.',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `⚠️ **Error communicating with Gemini**: ${err.message || 'Please try again.'}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: 'Conversation history reset. Ask me anything about your role, JD, or candidate interview strategies!',
        timestamp: Date.now(),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 flex flex-col bg-slate-900 border border-slate-700/80 shadow-2xl ${
        isExpanded
          ? 'inset-4 sm:inset-10 rounded-2xl'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[480px] h-[640px] max-h-[85vh] rounded-2xl'
      }`}
    >
      {/* Chat Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-slate-950/90 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs sm:text-sm text-white">Recruiter Copilot</h3>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {modelChoice}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Multi-turn talent acquisition & interview advisor
            </p>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="Clear chat history"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors hidden sm:block"
            title={isExpanded ? 'Restore size' : 'Expand full window'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Model & Thinking Mode Bar */}
      <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Model:</span>
          <select
            value={modelChoice}
            onChange={(e) => setModelChoice(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="gemini-4-argon">gemini-4-argon (Complex)</option>
            <option value="gemini-3.8-flash">gemini-3.8-flash (General)</option>
            <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
          </select>
        </div>

        {/* High Thinking Toggle */}
        <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300">
          <Brain className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-medium">High Thinking</span>
          <input
            type="checkbox"
            checked={highThinking}
            onChange={(e) => setHighThinking(e.target.checked)}
            className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
          />
        </label>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-indigo-400" />}
              </div>

              {/* Message Bubble */}
              <div className="relative group max-w-[85%]">
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Copy button on hover for assistant messages */}
                {!isUser && (
                  <button
                    onClick={() => copyMessage(msg.id, msg.content)}
                    className="absolute -bottom-5 left-1 text-[10px] text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs">
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl rounded-tl-none text-xs text-slate-300 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse delay-75" />
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse delay-150" />
              <span className="text-[11px] text-slate-400 ml-1">
                {highThinking ? 'Thinking deeply & synthesizing recruiter advice...' : 'Drafting response...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-3 pt-2 pb-1 border-t border-slate-800/80 bg-slate-950/70 overflow-x-auto flex gap-1.5 scrollbar-none">
        {[
          'Draft LinkedIn InMail for top passive candidates',
          'Audit JD for unconscious bias or barriers',
          'Add 3 deeper technical probes for Question #1',
          'Create 30-60-90 day performance milestones',
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="text-[11px] text-slate-300 bg-slate-900 hover:bg-indigo-950/50 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 rounded-full px-2.5 py-1 whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/90 rounded-b-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask Copilot: tweak JD, calibrate questions, salary bands..."
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none max-h-24"
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs transition-colors flex items-center justify-center shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
