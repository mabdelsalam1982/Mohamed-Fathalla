import React, { useState } from 'react';
import { InterviewGuide, BehavioralQuestion } from '../types/recruitment';
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Target,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldAlert,
  Search,
} from 'lucide-react';

interface InterviewGuideViewProps {
  interviewGuide: InterviewGuide;
}

export const InterviewGuideView: React.FC<InterviewGuideViewProps> = ({ interviewGuide }) => {
  const [filterType, setFilterType] = useState<'all' | 'hard' | 'soft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>(() => {
    // Expand first two by default
    return { 1: true, 2: true };
  });
  const [copiedId, setCopiedId] = useState<number | 'all' | null>(null);

  const toggleExpand = (num: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [num]: !prev[num],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<number, boolean> = {};
    interviewGuide.questions.forEach((q) => {
      allExpanded[q.number] = true;
    });
    setExpandedQuestions(allExpanded);
  };

  const collapseAll = () => {
    setExpandedQuestions({});
  };

  const copyQuestion = (q: BehavioralQuestion) => {
    const text = `Question #${q.number} [${q.skillType.toUpperCase()}: ${q.skillTarget}]
Category: ${q.category}
JD Mapping: "${q.jdDirectMapping}"

Question:
"${q.question}"

Probing Follow-ups:
${q.probingQuestions.map((p) => `- ${p}`).join('\n')}

Rubric:
[Strong Signal]: ${q.rubric.strongSignal.join('; ')}
[Neutral Signal]: ${q.rubric.neutralSignal.join('; ')}
[Red Flags]: ${q.rubric.redFlags.join('; ')}

Scoring Notes: ${q.scoringGuidance}`;

    navigator.clipboard.writeText(text);
    setCopiedId(q.number);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAllQuestions = () => {
    let fullText = `# 10-Question Behavioral Interview Guide: ${interviewGuide.targetRole} (${interviewGuide.seniorityLevel})\n\n`;
    fullText += `## Targeted Hard Skills:\n${interviewGuide.competencyFocus.hardSkillsTargeted.join(', ')}\n\n`;
    fullText += `## Targeted Soft Skills:\n${interviewGuide.competencyFocus.softSkillsTargeted.join(', ')}\n\n---\n\n`;

    interviewGuide.questions.forEach((q) => {
      fullText += `### Question ${q.number}: ${q.skillTarget} (${q.skillType.toUpperCase()})\n`;
      fullText += `**Category:** ${q.category}\n`;
      fullText += `**JD Requirement Validated:** "${q.jdDirectMapping}"\n\n`;
      fullText += `**Behavioral Prompt:** "${q.question}"\n\n`;
      fullText += `**Probing Follow-Ups:**\n${q.probingQuestions.map((p) => `- ${p}`).join('\n')}\n\n`;
      fullText += `**Evaluation Rubric:**\n`;
      fullText += `- 🟢 **Strong Signal:** ${q.rubric.strongSignal.join('; ')}\n`;
      fullText += `- 🟡 **Neutral:** ${q.rubric.neutralSignal.join('; ')}\n`;
      fullText += `- 🔴 **Red Flags:** ${q.rubric.redFlags.join('; ')}\n\n`;
      fullText += `**Scoring Guidance:** ${q.scoringGuidance}\n\n---\n\n`;
    });

    fullText += `## Interviewer Calibration & Committee Debrief:\n${interviewGuide.interviewerDebriefAdvice}\n`;

    navigator.clipboard.writeText(fullText);
    setCopiedId('all');
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filter questions
  const filteredQuestions = interviewGuide.questions.filter((q) => {
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'hard' && q.skillType.toLowerCase() === 'hard') ||
      (filterType === 'soft' && q.skillType.toLowerCase() === 'soft');

    const matchesSearch =
      !searchQuery.trim() ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.skillTarget.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.jdDirectMapping.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const hardCount = interviewGuide.questions.filter((q) => q.skillType.toLowerCase() === 'hard').length;
  const softCount = interviewGuide.questions.filter((q) => q.skillType.toLowerCase() === 'soft').length;

  return (
    <div className="space-y-6">
      {/* Top Overview & Competency Mapping Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                10 Behavioral Questions
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {interviewGuide.seniorityLevel}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Behavioral Interview Guide for {interviewGuide.targetRole}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Every question is mathematically grounded in the newly generated Job Description to eliminate hiring bias.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyAllQuestions}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors"
            >
              {copiedId === 'all' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied All 10!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Entire 10-Q Guide</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Competency Distribution Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Targeted Hard Skills ({hardCount} Questions)
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {interviewGuide.competencyFocus.hardSkillsTargeted.map((skill, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-800/40"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Targeted Soft Skills ({softCount} Questions)
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {interviewGuide.competencyFocus.softSkillsTargeted.map((skill, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-sky-950/60 text-sky-300 border border-sky-800/40"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3">
        {/* Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterType === 'all'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Questions (10)
          </button>
          <button
            onClick={() => setFilterType('hard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              filterType === 'hard'
                ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🛠️ Hard Skills</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-950 text-indigo-400">
              {hardCount}
            </span>
          </button>
          <button
            onClick={() => setFilterType('soft')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              filterType === 'soft'
                ? 'bg-sky-900/60 text-sky-300 border border-sky-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🤝 Soft Skills</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-950 text-sky-400">
              {softCount}
            </span>
          </button>
        </div>

        {/* Search & Expand Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or skills..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={expandAll}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
            title="Expand all questions"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
            title="Collapse all questions"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* 10 Behavioral Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-400">
            <p className="text-sm">No questions match the current filter or search.</p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = !!expandedQuestions[q.number];
            const isHard = q.skillType.toLowerCase() === 'hard';

            return (
              <div
                key={q.number}
                className={`border rounded-2xl transition-all shadow-md overflow-hidden ${
                  isExpanded
                    ? 'bg-slate-900/95 border-slate-700/80 ring-1 ring-slate-700/40'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleExpand(q.number)}
                  className="p-4 sm:p-5 cursor-pointer flex items-start justify-between gap-3 select-none"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Question Number Badge */}
                    <div
                      className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 shadow-sm ${
                        isHard
                          ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
                      }`}
                    >
                      #{q.number}
                    </div>

                    <div>
                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isHard
                              ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                              : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                          }`}
                        >
                          {isHard ? '🛠️ Hard Skill' : '🤝 Soft Skill'}: {q.skillTarget}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                          {q.category}
                        </span>
                      </div>

                      {/* Main Question Text */}
                      <h3 className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
                        "{q.question}"
                      </h3>
                    </div>
                  </div>

                  {/* Actions & Chevron */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyQuestion(q);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Copy this question and rubric"
                    >
                      {copiedId === q.number ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <div className="p-1 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details: JD Mapping, Probes, 3-Tier Rubrics, Scoring */}
                {isExpanded && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-2 border-t border-slate-800/80 space-y-4 text-sm animate-fadeIn">
                    {/* JD Direct Mapping Callout */}
                    <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2">
                      <Target className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-indigo-300 font-semibold">
                          Direct Job Description Requirement Validated:
                        </strong>
                        <p className="mt-0.5 italic text-slate-300 font-sans">
                          "{q.jdDirectMapping}"
                        </p>
                      </div>
                    </div>

                    {/* Probing Follow-Up Questions */}
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Targeted Probing Follow-Ups (Dig Past Rehearsed Answers):</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300 pl-1">
                        {q.probingQuestions.map((probe, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-indigo-400 font-bold shrink-0">↳</span>
                            <span>"{probe}"</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 3-Tier Rubric Grid */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Objective 3-Tier Evaluation Rubric</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Strong Signal (Green Flags) */}
                        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>🟢 Strong Signal (Great)</span>
                          </div>
                          <ul className="space-y-1.5 text-[11px] text-emerald-200/90">
                            {q.rubric.strongSignal.map((sig, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-emerald-400 font-bold">•</span>
                                <span>{sig}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Neutral Signal */}
                        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>🟡 Neutral / Mixed (Average)</span>
                          </div>
                          <ul className="space-y-1.5 text-[11px] text-amber-200/90">
                            {q.rubric.neutralSignal.map((sig, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-amber-400 font-bold">•</span>
                                <span>{sig}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Red Flags */}
                        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                          <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                            <XCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>🔴 Red Flags (Warning Signs)</span>
                          </div>
                          <ul className="space-y-1.5 text-[11px] text-rose-200/90">
                            {q.rubric.redFlags.map((sig, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-rose-400 font-bold">•</span>
                                <span>{sig}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Scoring Criteria Guidance */}
                    <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-300">1-5 Rating Scale Anchor:</span>
                        <span>{q.scoringGuidance}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Interviewer Committee Debrief Guidance */}
      {interviewGuide.interviewerDebriefAdvice && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
            <span>Hiring Committee Debrief & Calibration Advice</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
            {interviewGuide.interviewerDebriefAdvice}
          </p>
        </div>
      )}
    </div>
  );
};
