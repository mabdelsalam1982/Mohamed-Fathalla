import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NotesInputSection } from './components/NotesInputSection';
import { JobDescriptionView } from './components/JobDescriptionView';
import { InterviewGuideView } from './components/InterviewGuideView';
import { CandidateScorecard } from './components/CandidateScorecard';
import { RecruitingChatbot } from './components/RecruitingChatbot';
import { RecruitmentSuite } from './types/recruitment';
import { SAMPLE_ROLES } from './data/sampleRoles';
import {
  Briefcase,
  FileText,
  Target,
  ClipboardCheck,
  Sparkles,
  ArrowRight,
  Brain,
  History,
  Trash2,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export default function App() {
  // Input states
  const [rawNotes, setRawNotes] = useState<string>(SAMPLE_ROLES[0].notes);
  const [roleTitle, setRoleTitle] = useState<string>(SAMPLE_ROLES[0].title);
  const [companyName, setCompanyName] = useState<string>('Nexus AI Labs');
  const [seniority, setSeniority] = useState<string>('Staff / Principal');
  const [tone, setTone] = useState<string>('Direct & Technical');
  const [workModel, setWorkModel] = useState<string>('Remote (US/Canada)');
  const [modelChoice, setModelChoice] = useState<string>('gemini-4-argon');
  const [highThinking, setHighThinking] = useState<boolean>(true);

  // App processing states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active output
  const [recruitmentSuite, setRecruitmentSuite] = useState<RecruitmentSuite | null>(null);
  const [activeTab, setActiveTab] = useState<'jd' | 'guide' | 'scorecard'>('jd');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Saved History in LocalStorage
  const [history, setHistory] = useState<Array<{ id: string; title: string; date: string; data: RecruitmentSuite }>>([]);

  // Load saved history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recruitment_sandbox_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load history:', e);
    }
  }, []);

  const saveToHistory = (suite: RecruitmentSuite) => {
    try {
      const newItem = {
        id: `suite-${Date.now()}`,
        title: suite.jobDescription.roleTitle || 'Untitled Role',
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        data: suite,
      };
      const updated = [newItem, ...history.slice(0, 9)];
      setHistory(updated);
      localStorage.setItem('recruitment_sandbox_history', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to history:', e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('recruitment_sandbox_history');
  };

  const handleGenerate = async () => {
    if (!rawNotes.trim()) {
      setErrorMessage('Please provide raw notes about the role.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep('Synthesizing raw notes with Gemini...');

    // Progress stepper messages
    const stepTimer1 = setTimeout(() => {
      setLoadingStep('Crafting high-engagement LinkedIn Job Description...');
    }, 2500);

    const stepTimer2 = setTimeout(() => {
      setLoadingStep('Formulating 10 behavioral interview questions & 3-tier rubrics...');
    }, 6000);

    try {
      const response = await fetch('/api/generate-recruitment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawNotes,
          roleTitle,
          companyName,
          seniority,
          tone,
          workModel,
          modelChoice,
          highThinking,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const result = await response.json();
      if (!result.data || !result.data.jobDescription || !result.data.interviewGuide) {
        throw new Error('Invalid recruitment suite payload received from Gemini.');
      }

      setRecruitmentSuite(result.data);
      saveToHistory(result.data);
      setActiveTab('jd');
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred while generating.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleReset = () => {
    setRecruitmentSuite(null);
    setActiveTab('jd');
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <Header
        onReset={handleReset}
        onOpenChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        hasOutput={!!recruitmentSuite}
        currentModel={modelChoice}
        isHighThinking={highThinking}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Top Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Talent Operations & Interview Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Raw Hiring Notes in. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              LinkedIn JD & 10-Question Guide
            </span> out.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Paste unstructured notes, requirements, or bullet points. The Sandbox generates a polished, high-converting LinkedIn post and an interview guide with 10 behavioral questions directly mapped to the JD's hard & soft skills.
          </p>
        </div>

        {/* Input Section (Always accessible) */}
        <section>
          <NotesInputSection
            rawNotes={rawNotes}
            setRawNotes={setRawNotes}
            roleTitle={roleTitle}
            setRoleTitle={setRoleTitle}
            companyName={companyName}
            setCompanyName={setCompanyName}
            seniority={seniority}
            setSeniority={setSeniority}
            tone={tone}
            setTone={setTone}
            workModel={workModel}
            setWorkModel={setWorkModel}
            modelChoice={modelChoice}
            setModelChoice={setModelChoice}
            highThinking={highThinking}
            setHighThinking={setHighThinking}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            loadingStep={loadingStep}
            errorMessage={errorMessage}
          />
        </section>

        {/* Saved Session History Strip */}
        {history.length > 0 && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <span className="text-slate-400 flex items-center gap-1 font-semibold shrink-0">
                <History className="w-3.5 h-3.5 text-indigo-400" />
                <span>Recent Roles:</span>
              </span>
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setRecruitmentSuite(item.data);
                    setRoleTitle(item.data.jobDescription.roleTitle);
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 whitespace-nowrap transition-colors"
                >
                  {item.title} <span className="text-[10px] text-slate-500">({item.date})</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleClearHistory}
              className="text-slate-500 hover:text-slate-300 shrink-0 p-1"
              title="Clear history"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Outputs Section */}
        {recruitmentSuite ? (
          <section className="space-y-6 pt-4 animate-fadeIn">
            {/* Output Tab Switcher Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-800 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('jd')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'jd'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>1. LinkedIn Job Description</span>
                </button>

                <button
                  onClick={() => setActiveTab('guide')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'guide'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Target className="w-4 h-4 text-emerald-300" />
                  <span>2. 10-Question Interview Guide</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300">
                    10 Qs
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('scorecard')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'scorecard'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ClipboardCheck className="w-4 h-4 text-sky-300" />
                  <span>3. Candidate Scorecard</span>
                </button>
              </div>

              {/* Chatbot summon button if closed */}
              {!isChatOpen && (
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="hidden md:inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                >
                  <span>Need changes? Ask Recruiter Copilot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Active Tab View */}
            {activeTab === 'jd' && (
              <JobDescriptionView jobDescription={recruitmentSuite.jobDescription} />
            )}

            {activeTab === 'guide' && (
              <InterviewGuideView interviewGuide={recruitmentSuite.interviewGuide} />
            )}

            {activeTab === 'scorecard' && (
              <CandidateScorecard interviewGuide={recruitmentSuite.interviewGuide} />
            )}
          </section>
        ) : (
          /* Empty State Explainer */
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 sm:p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center shadow-inner">
              <Briefcase className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Ready to transform your hiring notes
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Select one of the sample role presets above or paste your raw notes, then click <strong>"Generate JD & 10-Question Guide"</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left pt-2">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                  <FileText className="w-4 h-4" />
                  <span>Output 1: LinkedIn Job Description</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Formatted with hook, quantified responsibilities, distinct hard/soft skills, and a ready-to-paste LinkedIn post layout with hashtags.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <Target className="w-4 h-4" />
                  <span>Output 2: 10-Question Interview Guide</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  10 STAR behavioral questions directly linked to the JD's requirements, each with follow-up probes and 3-tier scoring rubrics.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Recruiter Copilot Multi-Turn Chatbot */}
      <RecruitingChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        recruitmentSuite={recruitmentSuite}
        rawNotes={rawNotes}
      />
    </div>
  );
}
