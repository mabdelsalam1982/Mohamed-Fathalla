import React, { useState } from 'react';
import { Sparkles, Brain, Wand2, SlidersHorizontal, ChevronDown, ChevronUp, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { SAMPLE_ROLES, SampleRole } from '../data/sampleRoles';

interface NotesInputSectionProps {
  rawNotes: string;
  setRawNotes: (notes: string) => void;
  roleTitle: string;
  setRoleTitle: (title: string) => void;
  companyName: string;
  setCompanyName: (company: string) => void;
  seniority: string;
  setSeniority: (seniority: string) => void;
  tone: string;
  setTone: (tone: string) => void;
  workModel: string;
  setWorkModel: (model: string) => void;
  modelChoice: string;
  setModelChoice: (model: string) => void;
  highThinking: boolean;
  setHighThinking: (enabled: boolean) => void;
  onGenerate: () => void;
  isLoading: boolean;
  loadingStep: string;
  errorMessage: string | null;
}

export const NotesInputSection: React.FC<NotesInputSectionProps> = ({
  rawNotes,
  setRawNotes,
  roleTitle,
  setRoleTitle,
  companyName,
  setCompanyName,
  seniority,
  setSeniority,
  tone,
  setTone,
  workModel,
  setWorkModel,
  modelChoice,
  setModelChoice,
  highThinking,
  setHighThinking,
  onGenerate,
  isLoading,
  loadingStep,
  errorMessage,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSelectSample = (sample: SampleRole) => {
    setRawNotes(sample.notes);
    setRoleTitle(sample.title);
    setSeniority(sample.seniority);
    setTone(sample.recommendedTone);
    setWorkModel(sample.workModel);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Preset Role Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>1. Raw Hiring Notes</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dump brain-dumps, hiring manager conversations, tech requirements, level, or compensation.
          </p>
        </div>

        {/* Sample Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-medium text-slate-400 mr-1 hidden lg:inline">Presets:</span>
          {SAMPLE_ROLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-300 border border-slate-700/70 hover:border-indigo-500/40 transition-colors"
              title={`Load sample notes for ${sample.title}`}
            >
              {sample.title.split('—')[0].replace('Platform Engineer', 'AI Eng').replace('Solutions Architect', 'Architect')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          value={rawNotes}
          onChange={(e) => setRawNotes(e.target.value)}
          placeholder={`e.g. "We need a Senior Backend Engineer to own our payments service.
- Tech: Golang, Postgres, Kafka, AWS, Docker
- Must handle 5,000 TPS during peak sales with zero dropped transactions
- Looking for someone who can mentor junior devs and work with compliance
- Comp: $165k-$195k + equity, Remote US
- Avoid candidates who cannot explain concurrency or distributed transactions..."`}
          rows={7}
          disabled={isLoading}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/80 font-mono transition-all resize-y"
        />

        {rawNotes && (
          <div className="absolute bottom-3 right-3 text-[11px] text-slate-500 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            {rawNotes.trim().split(/\s+/).filter(Boolean).length} words
          </div>
        )}
      </div>

      {/* Quick Metadata Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Role Title (Optional)
          </label>
          <input
            type="text"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            placeholder="e.g. Staff AI Platform Engineer"
            className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Company / Team
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Acme Cloud Corp"
            className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Work Arrangement
          </label>
          <select
            value={workModel}
            onChange={(e) => setWorkModel(e.target.value)}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="Remote (US/Canada)">Remote (US/Canada)</option>
            <option value="Remote (Global)">Remote (Global)</option>
            <option value="Hybrid (San Francisco, CA)">Hybrid (San Francisco, CA)</option>
            <option value="Hybrid (New York, NY)">Hybrid (New York, NY)</option>
            <option value="Hybrid (London, UK)">Hybrid (London, UK)</option>
            <option value="On-Site">On-Site</option>
          </select>
        </div>
      </div>

      {/* Advanced Calibration Toggle */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-300 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Model & Calibration Settings</span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center gap-2">
          {/* High Thinking Badge */}
          {highThinking && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              <Sparkles className="w-3 h-3" /> High Thinking Active
            </span>
          )}
        </div>
      </div>

      {/* Advanced Panel */}
      {showAdvanced && (
        <div className="mt-3 p-4 bg-slate-950/90 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn">
          {/* Seniority */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Seniority Level
            </label>
            <select
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Junior / Associate">Junior / Associate</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Senior">Senior</option>
              <option value="Staff / Principal">Staff / Principal</option>
              <option value="Lead / Principal">Lead / Principal</option>
              <option value="Director / Executive">Director / Executive</option>
            </select>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              LinkedIn JD Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Engaging & Modern">Engaging & Modern (Startup PLG style)</option>
              <option value="Executive & Rigorous">Executive & Rigorous (Corporate/Enterprise)</option>
              <option value="Inclusive & Values-Driven">Inclusive & Values-Driven (Culture focus)</option>
              <option value="Direct & Technical">Direct & Technical (No buzzwords)</option>
            </select>
          </div>

          {/* AI Model Selection */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Gemini Model
            </label>
            <select
              value={modelChoice}
              onChange={(e) => setModelChoice(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="gemini-4-argon">gemini-4-argon (Complex Synthesis & Reasoning)</option>
              <option value="gemini-3.8-flash">gemini-3.8-flash (General & Fast)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Fast Draft)</option>
            </select>
          </div>

          {/* High Thinking Toggle */}
          <div className="sm:col-span-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200">
                  Enable High Thinking Mode (Reasoning Depth)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Sets <code className="text-slate-300">thinkingLevel: ThinkingLevel.HIGH</code> with Gemini 4 Argon to deeply analyze competence tradeoffs and cross-reference JD skills to behavioral rubrics.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={highThinking}
                onChange={(e) => setHighThinking(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Action CTA Bar */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Produces 2 outputs: LinkedIn Job Description & 10 Behavioral Interview Questions</span>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading || !rawNotes.trim()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{loadingStep || 'Generating Recruitment Suite...'}</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Generate JD & 10-Question Guide</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
