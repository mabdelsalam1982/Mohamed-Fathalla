import React, { useState } from 'react';
import { JobDescription } from '../types/recruitment';
import { Copy, Check, Eye, FileText, Share2, Building2, MapPin, DollarSign, Clock, Sparkles, CheckCircle2, Bookmark, Heart, MessageCircle, Repeat2, Send } from 'lucide-react';

interface JobDescriptionViewProps {
  jobDescription: JobDescription;
}

export const JobDescriptionView: React.FC<JobDescriptionViewProps> = ({ jobDescription }) => {
  const [viewMode, setViewMode] = useState<'linkedin' | 'structured'>('linkedin');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const getFullMarkdown = () => {
    return `# ${jobDescription.roleTitle}
**Company:** ${jobDescription.companyName || 'Confidential'}
**Location:** ${jobDescription.location}
**Type:** ${jobDescription.employmentType}
**Compensation:** ${jobDescription.compensation}

---

## 🎯 About the Role
${jobDescription.hook}

${jobDescription.aboutTheRole}

---

## 🚀 Key Responsibilities
${jobDescription.responsibilities.map((r) => `- ${r}`).join('\n')}

---

## 🛠️ Must-Have Hard Skills & Qualifications
${jobDescription.mustHaveHardSkills.map((s) => `- ${s}`).join('\n')}

---

## 🤝 Must-Have Soft Skills & Leadership
${jobDescription.mustHaveSoftSkills.map((s) => `- ${s}`).join('\n')}

---

## ✨ Nice-to-Have Skills
${jobDescription.niceToHaveSkills.map((s) => `- ${s}`).join('\n')}

---

## 🎁 Why Join Us & Benefits
${jobDescription.whyJoinUs.map((b) => `- ${b}`).join('\n')}

---

### Ready-to-Post LinkedIn Copy:
${jobDescription.linkedInPostFormatted}
`;
  };

  const handleDownloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([getFullMarkdown()], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${jobDescription.roleTitle.replace(/\s+/g, '_')}_Job_Description.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls & View Mode Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('linkedin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'linkedin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>LinkedIn Feed View</span>
            </button>
            <button
              onClick={() => setViewMode('structured')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'structured'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Structured JD</span>
            </button>
          </div>
          <span className="text-xs text-slate-400 hidden md:inline">
            Tailored specifically for LinkedIn candidate discovery
          </span>
        </div>

        {/* Copy Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => copyToClipboard(jobDescription.linkedInPostFormatted, 'linkedin')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors"
          >
            {copiedType === 'linkedin' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied Post!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy LinkedIn Post</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            title="Download full job description as Markdown"
          >
            <span>.MD File</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: LINKEDIN SIMULATOR */}
      {viewMode === 'linkedin' && (
        <div className="bg-[#1b1f23] border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl max-w-3xl mx-auto text-slate-100">
          {/* LinkedIn Header */}
          <div className="p-4 sm:p-5 border-b border-slate-700/60 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-sky-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {jobDescription.companyName ? jobDescription.companyName.charAt(0) : '💼'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-white">
                    {jobDescription.companyName || 'Talent Acquisition Team'}
                  </h3>
                  <span className="text-[11px] text-slate-400">• 1st</span>
                </div>
                <p className="text-xs text-slate-400">
                  Hiring for <span className="text-slate-200 font-medium">{jobDescription.roleTitle}</span>
                </p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <span>Just now</span>
                  <span>•</span>
                  <span>🌐 Public</span>
                </p>
              </div>
            </div>

            <span className="text-xs font-medium px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              #Hiring
            </span>
          </div>

          {/* LinkedIn Post Body */}
          <div className="p-4 sm:p-6 space-y-4 font-sans text-sm sm:text-base leading-relaxed text-slate-200 whitespace-pre-wrap selection:bg-indigo-500/30">
            {jobDescription.linkedInPostFormatted}
          </div>

          {/* Quick Metrics & Callout Card */}
          <div className="mx-4 sm:mx-6 mb-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                {jobDescription.location}
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                {jobDescription.compensation}
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                {jobDescription.employmentType}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(jobDescription.linkedInPostFormatted, 'linkedin-bottom')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              {copiedType === 'linkedin-bottom' ? '✓ Copied' : 'Copy Text for LinkedIn →'}
            </button>
          </div>

          {/* LinkedIn Reaction Mockup Bar */}
          <div className="px-5 py-3 border-t border-slate-800 bg-[#15191d] flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1 text-[11px]">
              <span className="flex -space-x-1 overflow-hidden">
                <span className="inline-block w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center">👍</span>
                <span className="inline-block w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center">❤️</span>
                <span className="inline-block w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center">💡</span>
              </span>
              <span className="ml-1 font-medium text-slate-300">74 reactions</span>
            </div>
            <span>12 comments • 18 reposts</span>
          </div>

          <div className="px-2 py-2 border-t border-slate-800/80 bg-[#171b1f] flex items-center justify-around text-xs text-slate-300 font-semibold">
            <button className="flex items-center gap-1.5 py-1 px-3 rounded hover:bg-slate-800">
              <Heart className="w-4 h-4 text-slate-400" />
              <span>Like</span>
            </button>
            <button className="flex items-center gap-1.5 py-1 px-3 rounded hover:bg-slate-800">
              <MessageCircle className="w-4 h-4 text-slate-400" />
              <span>Comment</span>
            </button>
            <button className="flex items-center gap-1.5 py-1 px-3 rounded hover:bg-slate-800">
              <Repeat2 className="w-4 h-4 text-slate-400" />
              <span>Repost</span>
            </button>
            <button className="flex items-center gap-1.5 py-1 px-3 rounded hover:bg-slate-800">
              <Send className="w-4 h-4 text-slate-400" />
              <span>Send</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: STRUCTURED DOCUMENT VIEW */}
      {viewMode === 'structured' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          {/* Document Header */}
          <div className="border-b border-slate-800 pb-5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Official Position Specification
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {jobDescription.employmentType}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {jobDescription.roleTitle}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Building2 className="w-4 h-4 text-indigo-400" />
                {jobDescription.companyName || 'Acme Technologies'}
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-4 h-4 text-sky-400" />
                {jobDescription.location}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <DollarSign className="w-4 h-4" />
                {jobDescription.compensation}
              </span>
            </div>
          </div>

          {/* Hook & About the Role */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 text-sm font-medium">
              💡 <strong>The Hook:</strong> {jobDescription.hook}
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                About the Role & Mission
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {jobDescription.aboutTheRole}
              </p>
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <span>Core Responsibilities</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                {jobDescription.responsibilities.length} outcomes
              </span>
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {jobDescription.responsibilities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-sm text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Grid: Must-Have Hard vs Soft Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hard Skills */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <span>🛠️ Must-Have Hard Skills & Domain</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {jobDescription.mustHaveHardSkills.map((skill, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Soft Skills */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <span>🤝 Must-Have Soft Skills & Leadership</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {jobDescription.mustHaveSoftSkills.map((skill, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-sky-400 font-bold">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Nice to Have & Why Join Us */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nice to have */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                🌟 Bonus / Nice-to-Have
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {jobDescription.niceToHaveSkills.map((skill, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-slate-500 font-bold">+</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Perks & Culture */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                🎁 Benefits & Why Join
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {jobDescription.whyJoinUs.map((perk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
