import React from 'react';
import { Sparkles, MessageSquare, Briefcase, RotateCcw, Brain, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenChat: () => void;
  isChatOpen: boolean;
  hasOutput: boolean;
  currentModel: string;
  isHighThinking: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onOpenChat,
  isChatOpen,
  hasOutput,
  currentModel,
  isHighThinking,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-xl">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Recruitment Sandbox
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                LinkedIn JD + 10-Q Guide
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Turn raw hiring notes into polished LinkedIn job posts & competency-mapped interview rubrics
            </p>
          </div>
        </div>

        {/* Right Actions & Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Model Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-medium text-slate-200">{currentModel}</span>
            {isHighThinking && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                <Sparkles className="w-2.5 h-2.5" /> High Thinking
              </span>
            )}
          </div>

          {/* Reset button if output generated */}
          {hasOutput && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/70 rounded-lg transition-colors"
              title="Reset sandbox"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Role</span>
            </button>
          )}

          {/* Chatbot Copilot Toggle */}
          <button
            onClick={onOpenChat}
            className={`relative inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-sm ${
              isChatOpen
                ? 'bg-indigo-600 text-white shadow-indigo-600/30 ring-2 ring-indigo-400/50'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-indigo-300" />
            <span>Recruiter Copilot</span>
            {hasOutput && !isChatOpen && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
