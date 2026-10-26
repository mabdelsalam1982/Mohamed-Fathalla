import React, { useState } from 'react';
import { InterviewGuide } from '../types/recruitment';
import { Star, CheckCircle2, AlertCircle, Copy, Check, User, Calendar, RotateCcw, Award } from 'lucide-react';

interface CandidateScorecardProps {
  interviewGuide: InterviewGuide;
}

export const CandidateScorecard: React.FC<CandidateScorecardProps> = ({ interviewGuide }) => {
  const [candidateName, setCandidateName] = useState('');
  const [interviewerName, setInterviewerName] = useState('');
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [overallSummary, setOverallSummary] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleRating = (questionNum: number, score: number) => {
    setRatings((prev) => ({
      ...prev,
      [questionNum]: score,
    }));
  };

  const handleNoteChange = (questionNum: number, text: string) => {
    setNotes((prev) => ({
      ...prev,
      [questionNum]: text,
    }));
  };

  const resetScorecard = () => {
    setRatings({});
    setNotes({});
    setOverallSummary('');
  };

  // Calculations
  const scoredCount = Object.keys(ratings).length;
  const totalQuestions = interviewGuide.questions.length;
  const scoreValues = Object.values(ratings);
  const averageScore = scoreValues.length > 0
    ? (scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length).toFixed(1)
    : '0.0';

  const numAvg = parseFloat(averageScore);

  let recommendation = 'Pending Scores';
  let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';

  if (scoredCount >= 5) {
    if (numAvg >= 4.3) {
      recommendation = 'Strong Hire 🚀';
      badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    } else if (numAvg >= 3.5) {
      recommendation = 'Hire ✅';
      badgeColor = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    } else if (numAvg >= 2.8) {
      recommendation = 'Borderline / Calibrate ⚠️';
      badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    } else {
      recommendation = 'No Hire ❌';
      badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    }
  }

  const exportFeedbackToClipboard = () => {
    let output = `CANDIDATE INTERVIEW SCORECARD
Role: ${interviewGuide.targetRole} (${interviewGuide.seniorityLevel})
Candidate: ${candidateName || 'Unnamed Candidate'}
Interviewer: ${interviewerName || 'Unnamed Interviewer'}
Date: ${new Date().toLocaleDateString()}
Overall Recommendation: ${recommendation}
Aggregate Score: ${averageScore} / 5.0 (${scoredCount} of ${totalQuestions} questions evaluated)

OVERALL ASSESSMENT:
${overallSummary || 'No overall synthesis provided.'}

--------------------------------------------------
10-QUESTION BEHAVIORAL BREAKDOWN:
`;

    interviewGuide.questions.forEach((q) => {
      const score = ratings[q.number] || 'Unrated';
      const note = notes[q.number] || 'No notes taken.';
      output += `
Q#${q.number} [${q.skillType.toUpperCase()}: ${q.skillTarget}]
Question: "${q.question}"
Score: ${score} / 5
Interviewer Observation: ${note}
`;
    });

    navigator.clipboard.writeText(output);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Scorecard Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Live Interview Evaluation
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                10-Skill Scorecard
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Candidate Scorecard: {interviewGuide.targetRole}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Grade candidate responses in real-time across the 10 targeted hard and soft skill dimensions.
            </p>
          </div>

          {/* Quick Metrics Callout */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Average</div>
              <div className="text-lg font-bold text-white">{averageScore} <span className="text-xs text-slate-500">/ 5</span></div>
            </div>

            <div className={`px-4 py-2 rounded-xl border text-center ${badgeColor}`}>
              <div className="text-[10px] uppercase font-bold opacity-80">Recommendation</div>
              <div className="text-sm font-bold">{recommendation}</div>
            </div>

            <button
              onClick={exportFeedbackToClipboard}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Copied for ATS!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Export Scorecard</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Candidate & Interviewer Meta Input */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Candidate Name
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. Alex Chen"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Interviewer Name & Title
            </label>
            <input
              type="text"
              value={interviewerName}
              onChange={(e) => setInterviewerName(e.target.value)}
              placeholder="e.g. Sarah Miller (VP Eng)"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Evaluation Progress
            </label>
            <div className="flex items-center justify-between text-xs text-slate-300 px-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg">
              <span>{scoredCount} of {totalQuestions} rated</span>
              <button
                onClick={resetScorecard}
                className="text-[10px] text-slate-500 hover:text-slate-300 underline"
              >
                Reset Scores
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 10 Questions Evaluation Cards */}
      <div className="space-y-3.5">
        {interviewGuide.questions.map((q) => {
          const currentRating = ratings[q.number] || 0;
          const isHard = q.skillType.toLowerCase() === 'hard';

          return (
            <div
              key={q.number}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3 shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Q#{q.number}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isHard
                          ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                          : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                      }`}
                    >
                      {isHard ? '🛠️ Hard Skill' : '🤝 Soft Skill'}: {q.skillTarget}
                    </span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">• {q.category}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200">
                    "{q.question}"
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    <strong>Target:</strong> {q.jdDirectMapping}
                  </p>
                </div>

                {/* Rating 1 to 5 Stars Buttons */}
                <div className="flex items-center gap-1 shrink-0 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRating(q.number, star)}
                      className={`p-1 rounded-lg transition-all flex flex-col items-center justify-center text-xs ${
                        currentRating >= star
                          ? 'text-amber-400 bg-amber-400/10'
                          : 'text-slate-600 hover:text-slate-400'
                      }`}
                      title={`Score ${star}/5`}
                    >
                      <Star className={`w-4 h-4 ${currentRating >= star ? 'fill-amber-400' : ''}`} />
                      <span className="text-[9px] font-mono mt-0.5">{star}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Observation Notes Textarea */}
              <div>
                <textarea
                  value={notes[q.number] || ''}
                  onChange={(e) => handleNoteChange(q.number, e.target.value)}
                  placeholder="Record specific candidate statements, STAR details, or evidence of competency..."
                  rows={2}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans resize-y"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Debrief & Recommendation Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-400" />
          <span>Overall Interview Summary & Final Recommendation</span>
        </h3>
        <textarea
          value={overallSummary}
          onChange={(e) => setOverallSummary(e.target.value)}
          placeholder="Summarize key strengths, reservation points, cultural alignment, and hiring decision..."
          rows={3}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};
