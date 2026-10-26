import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Plus,
  Check,
  ArrowUpRight,
  Copy,
  Printer,
  Wrench,
} from 'lucide-react';
import {
  AnalysisReport,
  computeScoresFromSkills,
  MatchStatus,
  SkillCategory,
  SkillComparisonItem,
  ImprovementItem,
} from '../utils/analyzer';

interface ReportOverviewProps {
  report: AnalysisReport;
  simulatedSkillIds: Set<string>;
  onToggleSimulateSkill: (skillId: string) => void;
  onResetSimulation: () => void;
  onInsertKeywordIntoResume: (skillName: string) => void;
  onApplyImprovementRewrite: (improvement: ImprovementItem) => void;
  appliedImprovementIds: Set<string>;
  onOpenOptimizer: () => void;
}

const CATEGORIES: ('All' | SkillCategory)[] = [
  'All',
  'Languages & Core',
  'Frameworks & Libraries',
  'Cloud, Data & Infra',
  'Architecture & Methods',
  'Product & Leadership',
];

export const ReportOverview: React.FC<ReportOverviewProps> = ({
  report,
  simulatedSkillIds,
  onToggleSimulateSkill,
  onResetSimulation,
  onInsertKeywordIntoResume,
  onApplyImprovementRewrite,
  appliedImprovementIds,
  onOpenOptimizer,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | MatchStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'All' | SkillCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);

  const liveScores = useMemo(
    () => computeScoresFromSkills(report.skills, report.atsScore, simulatedSkillIds),
    [report.skills, report.atsScore, simulatedSkillIds]
  );

  const scoreDelta = liveScores.overallScore - report.overallScore;

  const counts = useMemo(() => {
    const matched = report.skills.filter((s) => s.status === 'matched').length;
    const partial = report.skills.filter((s) => s.status === 'partial').length;
    const missing = report.skills.filter((s) => s.status === 'missing').length;
    return { total: report.skills.length, matched, partial, missing };
  }, [report.skills]);

  const filteredSkills = useMemo(() => {
    return report.skills.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.skill.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.contextSnippet.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [report.skills, statusFilter, categoryFilter, searchQuery]);

  const handleCopyMarkdownReport = async () => {
    const matchedList = report.skills
      .filter((s) => s.status === 'matched')
      .map((s) => s.skill)
      .join(', ');
    const missingList = report.skills
      .filter((s) => s.status !== 'matched')
      .map((s) => `${s.skill} (${s.importance})`)
      .join(', ');

    const md = `# Resume Alignment Report: ${report.candidateName} — ${report.roleTitle}
Overall Alignment: ${liveScores.overallScore}% | Technical Skills: ${liveScores.hardSkillsScore}% | Domain & Methods: ${liveScores.domainScore}% | ATS Readiness: ${report.atsScore}%

## Executive Summary
${report.executiveSummary}

## Matching Skills (${counts.matched})
${matchedList || 'None detected'}

## Missing & Partial Keywords (${counts.missing + counts.partial})
${missingList || 'None'}

## Top Recommended Rewrites
${report.improvements
  .map((imp, idx) => `${idx + 1}. **${imp.title}**: ${imp.suggestedRewrite}`)
  .join('\n')}
`;
    try {
      await navigator.clipboard.writeText(md);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      // Fallback ignored
    }
  };

  const renderStatusIndicator = (item: SkillComparisonItem) => {
    const isSimulated = simulatedSkillIds.has(item.id);
    if (item.status === 'matched') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Matched</span>
        </span>
      );
    }
    if (isSimulated) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Simulated Match</span>
        </span>
      );
    }
    if (item.status === 'partial') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Partial (Synonym)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700">
        <XCircle className="w-3.5 h-3.5 shrink-0" />
        <span>Missing Keyword</span>
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Report Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>Candidate: {report.candidateName}</span>
            <span aria-hidden="true">·</span>
            <span>Target Role: {report.roleTitle}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">{report.sectionSummary.wordCount} words analyzed</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Skill Alignment & Keyword Gap Report
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            type="button"
            onClick={handleCopyMarkdownReport}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedSummary ? 'Copied Markdown Report' : 'Copy Report Markdown'}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            type="button"
            onClick={onOpenOptimizer}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Open Live Resume Editor</span>
          </button>
        </div>
      </div>

      {/* 4-Column Quantitative Alignment Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Overall Role Alignment</span>
            <span className="font-mono-tabular">Weighted Index</span>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span
              data-testid="overall-match-score"
              className={`text-4xl font-bold font-mono-tabular ${
                liveScores.overallScore >= 75
                  ? 'text-emerald-700'
                  : liveScores.overallScore >= 55
                  ? 'text-amber-700'
                  : 'text-red-700'
              }`}
            >
              {liveScores.overallScore}%
            </span>
            {scoreDelta > 0 && (
              <span className="text-xs font-semibold font-mono-tabular text-emerald-700">
                +{scoreDelta}% simulated
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600">
            {counts.matched} matched · {counts.partial} partial · {counts.missing} missing of {counts.total} skills
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Hard & Technical Skills</span>
            <span className="font-mono-tabular">Core Stack</span>
          </div>
          <div className="my-3">
            <span className="text-4xl font-bold font-mono-tabular text-slate-900">
              {liveScores.hardSkillsScore}%
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Languages, frameworks, cloud platforms, and data tooling
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Architecture & Leadership</span>
            <span className="font-mono-tabular">Domain Fit</span>
          </div>
          <div className="my-3">
            <span className="text-4xl font-bold font-mono-tabular text-slate-900">
              {liveScores.domainScore}%
            </span>
          </div>
          <p className="text-xs text-slate-600">
            System design, engineering methods, and cross-functional impact
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>ATS Parseability & Metrics</span>
            <span className="font-mono-tabular">Structure</span>
          </div>
          <div className="my-3">
            <span className="text-4xl font-bold font-mono-tabular text-slate-900">
              {report.atsScore}%
            </span>
          </div>
          <p className="text-xs text-slate-600">
            {report.sectionSummary.quantifiedBulletCount} of {report.sectionSummary.totalBulletCount} bullets include measurable metrics
          </p>
        </div>
      </div>

      {/* Executive Diagnosis Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">Executive Alignment Diagnosis</h3>
          {simulatedSkillIds.size > 0 && (
            <button
              type="button"
              onClick={onResetSimulation}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 underline"
            >
              Reset {simulatedSkillIds.size} simulated keyword{simulatedSkillIds.size > 1 ? 's' : ''}
            </button>
          )}
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{report.executiveSummary}</p>
      </div>

      {/* Interactive Skill Comparison & Missing Keyword Matrix */}
      <section aria-labelledby="skill-matrix-heading" className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h3 id="skill-matrix-heading" className="text-base font-bold text-slate-900">
                01. Skill Comparison & Missing Keyword Matrix
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Compare exact keyword occurrences in your resume vs. the job description. Toggle &ldquo;Simulate&rdquo; to preview score impact or insert missing terms directly.
              </p>
            </div>

            {/* Status Segmented Filter Control */}
            <div
              role="group"
              aria-label="Filter skills by match status"
              className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 self-start"
            >
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({counts.total})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('matched')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  statusFilter === 'matched' ? 'bg-white text-emerald-800 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Matched ({counts.matched})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('partial')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  statusFilter === 'partial' ? 'bg-white text-amber-800 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Partial ({counts.partial})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('missing')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  statusFilter === 'missing' ? 'bg-white text-red-800 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Missing ({counts.missing})
              </button>
            </div>
          </div>

          {/* Category Tabs & Search Input */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    categoryFilter === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                aria-label="Filter skills or keywords"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skill or keyword..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* High-Density Skill Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4 w-[18%]">Skill / Keyword</th>
                <th className="py-3 px-3 w-[14%]">Status</th>
                <th className="py-3 px-3 w-[20%]">Priority &amp; Category</th>
                <th className="py-3 px-3 w-[10%] text-right font-mono-tabular">Resume / JD</th>
                <th className="py-3 px-3 w-[22%]">Diagnostic Recommendation</th>
                <th className="py-3 px-4 w-[16%] text-right no-print">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredSkills.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-slate-500">
                    No skills match the active filter criteria. Reset filters to view all {counts.total} benchmarked skills.
                  </td>
                </tr>
              ) : (
                filteredSkills.map((item) => {
                  const isSimulated = simulatedSkillIds.has(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSimulated ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900 truncate">
                        {item.skill}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">{renderStatusIndicator(item)}</td>
                      <td className="py-3 px-3 text-slate-600 truncate">
                        <span className={item.importance === 'Critical' ? 'font-semibold text-slate-900' : ''}>
                          {item.importance}
                        </span>
                        <span aria-hidden="true" className="mx-1.5 text-slate-300">
                          ·
                        </span>
                        <span>{item.category}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono-tabular whitespace-nowrap">
                        <span className="font-semibold text-slate-900">{item.resumeCount}</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-slate-600">{item.jdCount}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <p className="text-slate-800 line-clamp-2 leading-snug">{item.recommendation}</p>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap no-print">
                        {item.status !== 'matched' ? (
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onToggleSimulateSkill(item.id)}
                              className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                                isSimulated
                                  ? 'bg-emerald-700 text-white border-emerald-700'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {isSimulated ? 'Simulated' : 'Simulate'}
                            </button>
                            <button
                              type="button"
                              onClick={() => onInsertKeywordIntoResume(item.skill)}
                              aria-label={`Add ${item.skill} to resume`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono-tabular">Verified</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Areas for Improvement & Actionable Bullet Rewrites */}
      <section aria-labelledby="improvements-heading" className="space-y-4">
        <div>
          <h3 id="improvements-heading" className="text-base font-bold text-slate-900">
            02. Areas for Improvement & Tailored Bullet Rewrites
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Concrete recommendations and ready-to-use accomplishment statements tailored to close your keyword and quantification gaps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {report.improvements.map((imp, idx) => {
            const isApplied = appliedImprovementIds.has(imp.id);
            return (
              <div
                key={imp.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  {/* Unboxed clean metadata header */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono-tabular font-semibold text-slate-800">
                      0{idx + 1}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        imp.priority === 'High' ? 'font-semibold text-red-700' : 'font-medium text-amber-700'
                      }
                    >
                      {imp.priority} Priority
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{imp.category}</span>
                    {imp.targetKeywords.length > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Targets: {imp.targetKeywords.join(', ')}</span>
                      </>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{imp.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{imp.diagnosis}</p>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">{imp.actionableAdvice}</p>
                </div>

                {/* Before / After Concrete Rewrite Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2.5 text-xs">
                  {imp.originalExcerpt && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-medium text-slate-500 block">
                        Current Resume Excerpt:
                      </span>
                      <p className="text-slate-600 line-through decoration-slate-400">
                        &ldquo;{imp.originalExcerpt}&rdquo;
                      </p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-emerald-800 block">
                      Suggested High-Impact Rewrite:
                    </span>
                    <p className="text-slate-900 font-medium leading-relaxed">
                      &ldquo;{imp.suggestedRewrite}&rdquo;
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-end no-print">
                    <button
                      type="button"
                      onClick={() => onApplyImprovementRewrite(imp)}
                      disabled={isApplied}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        isApplied
                          ? 'bg-emerald-100 text-emerald-900 cursor-default'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Applied to Resume</span>
                        </>
                      ) : (
                        <>
                          <span>Apply Rewrite to Resume</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ATS Formatting & Structural Audit */}
      <section aria-labelledby="ats-audit-heading" className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 id="ats-audit-heading" className="text-base font-bold text-slate-900">
              03. ATS Formatting & Structural Audit
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verification of section headers, contact parseability, and accomplishment quantification.
            </p>
          </div>
          <span className="text-xs font-mono-tabular text-slate-600">
            Estimated Recruiter Scan Time: {report.sectionSummary.estimatedReadTimeSec}s
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {report.atsChecks.map((check) => (
            <div key={check.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2">
                {check.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span className="text-xs font-semibold text-slate-900">{check.label}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{check.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
