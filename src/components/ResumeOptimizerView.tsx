import React, { useMemo, useState } from 'react';
import { Plus, RefreshCw, Copy, Check, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { AnalysisReport } from '../utils/analyzer';

interface ResumeOptimizerViewProps {
  resumeText: string;
  report: AnalysisReport;
  onChangeResume: (updatedText: string) => void;
  onInsertKeyword: (skill: string) => void;
  onReanalyze: () => void;
  isAnalyzing: boolean;
}

export const ResumeOptimizerView: React.FC<ResumeOptimizerViewProps> = ({
  resumeText,
  report,
  onChangeResume,
  onInsertKeyword,
  onReanalyze,
  isAnalyzing,
}) => {
  const [copiedResume, setCopiedResume] = useState(false);

  const missingOrPartialSkills = useMemo(
    () => report.skills.filter((s) => s.status !== 'matched'),
    [report.skills]
  );

  const matchedSkills = useMemo(
    () => report.skills.filter((s) => s.status === 'matched'),
    [report.skills]
  );

  const handleCopyTailoredResume = async () => {
    try {
      await navigator.clipboard.writeText(resumeText);
      setCopiedResume(true);
      setTimeout(() => setCopiedResume(false), 2000);
    } catch {
      // Ignore
    }
  };

  // Highlight matched and partial keywords inside the resume preview
  const highlightedLines = useMemo(() => {
    const lines = resumeText.split(/\r?\n/);
    const matchedTerms = Array.from(
      new Set(
        matchedSkills.flatMap((s) => [s.skill, ...s.matchedSynonyms])
      )
    );
    const partialTerms = Array.from(
      new Set(
        report.skills
          .filter((s) => s.status === 'partial')
          .flatMap((s) => (s.matchedSynonyms.length > 0 ? s.matchedSynonyms : [s.skill]))
      )
    );

    const allTerms = [
      ...matchedTerms.map((t) => ({ term: t, type: 'matched' as const })),
      ...partialTerms.map((t) => ({ term: t, type: 'partial' as const })),
    ].filter((x) => x.term.length >= 2);

    if (allTerms.length === 0) {
      return lines.map((line, i) => (
        <div key={i} className="min-h-[1.25rem]">
          {line}
        </div>
      ));
    }

    const escaped = allTerms
      .map((x) => x.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .sort((a, b) => b.length - a.length);
    const regex = new RegExp(`(?<![a-zA-Z0-9])(${escaped.join('|')})(?![a-zA-Z0-9])`, 'gi');

    return lines.map((line, lineIdx) => {
      if (!line.trim()) {
        return <div key={lineIdx} className="h-3" />;
      }
      const parts = line.split(regex);
      return (
        <div key={lineIdx} className="leading-relaxed">
          {parts.map((part, partIdx) => {
            const lowerPart = part.toLowerCase();
            const isMatched = matchedTerms.some((m) => m.toLowerCase() === lowerPart);
            const isPartial =
              !isMatched && partialTerms.some((p) => p.toLowerCase() === lowerPart);

            if (isMatched) {
              return (
                <mark
                  key={partIdx}
                  className="bg-emerald-100 text-emerald-950 font-semibold px-1 rounded-xs"
                >
                  {part}
                </mark>
              );
            }
            if (isPartial) {
              return (
                <mark
                  key={partIdx}
                  className="bg-amber-100 text-amber-950 font-medium px-1 rounded-xs"
                >
                  {part}
                </mark>
              );
            }
            return <React.Fragment key={partIdx}>{part}</React.Fragment>;
          })}
        </div>
      );
    });
  }, [resumeText, matchedSkills, report.skills]);

  return (
    <section aria-labelledby="optimizer-heading" className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Interactive Resume Tailoring · Live Keyword Density Highlighter
          </p>
          <h2 id="optimizer-heading" className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Live Resume Optimizer & Keyword Injector
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyTailoredResume}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            {copiedResume ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedResume ? 'Copied Tailored Resume' : 'Copy Tailored Resume'}</span>
          </button>

          <button
            type="button"
            onClick={onReanalyze}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Recalculating Score...' : 'Recalculate Alignment Score'}</span>
          </button>
        </div>
      </div>

      {/* Quick Keyword Injection Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">
            One-Click Missing Keyword Injector ({missingOrPartialSkills.length} remaining)
          </h3>
          <span className="text-xs text-slate-500 font-mono-tabular">
            Current Match: {report.overallScore}%
          </span>
        </div>

        {missingOrPartialSkills.length === 0 ? (
          <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            All target keywords from the job description are now present in your resume!
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {missingOrPartialSkills.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onInsertKeyword(item.skill)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{item.skill}</span>
                <span className="text-[10px] opacity-75">({item.importance})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2-Column Live Editor + Annotated Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <label htmlFor="optimizer-resume-editor" className="text-sm font-semibold text-slate-900">
              Editable Resume Document
            </label>
            <span className="text-xs text-slate-500">Edits sync automatically</span>
          </div>
          <textarea
            id="optimizer-resume-editor"
            value={resumeText}
            onChange={(e) => onChangeResume(e.target.value)}
            rows={20}
            className="w-full flex-1 font-mono text-xs leading-relaxed text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-3.5 focus:bg-white focus:border-slate-900 focus:outline-none resize-y"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-900">
              ATS Keyword Coverage Highlighter
            </span>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Exact Match ({matchedSkills.length})</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Adjacent Synonym</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-red-600" />
                <span>Missing ({missingOrPartialSkills.length})</span>
              </span>
            </div>
          </div>

          <div className="flex-1 font-mono text-xs text-slate-800 bg-slate-50/60 border border-slate-200 rounded-lg p-4 overflow-y-auto max-h-[520px]">
            {highlightedLines}
          </div>
        </div>
      </div>
    </section>
  );
};
