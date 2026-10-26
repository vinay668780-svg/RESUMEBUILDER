import React from 'react';
import { Trash2, ArrowUpRight, FileSpreadsheet } from 'lucide-react';
import { AnalysisReport } from '../utils/analyzer';

interface SavedHistoryViewProps {
  history: AnalysisReport[];
  activeReportId: string;
  onSelectReport: (report: AnalysisReport) => void;
  onDeleteReport: (reportId: string) => void;
  onStartNewAnalysis: () => void;
}

export const SavedHistoryView: React.FC<SavedHistoryViewProps> = ({
  history,
  activeReportId,
  onSelectReport,
  onDeleteReport,
  onStartNewAnalysis,
}) => {
  return (
    <section aria-labelledby="history-heading" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Session & LocalStorage Comparison Log
          </p>
          <h2 id="history-heading" className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Saved Alignment Runs & Iteration History
          </h2>
        </div>

        <button
          type="button"
          onClick={onStartNewAnalysis}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          New Resume Comparison
        </button>
      </div>

      {history.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-900">No Saved Analysis Runs Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Run a resume and job description comparison in the Workspace to track how your alignment score improves across iterations.
          </p>
          <button
            type="button"
            onClick={onStartNewAnalysis}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Go to Workspace
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4">Candidate & Target Role</th>
                  <th className="py-3 px-4 text-right font-mono-tabular">Overall Match</th>
                  <th className="py-3 px-4 text-right font-mono-tabular">Hard Skills</th>
                  <th className="py-3 px-4 text-right font-mono-tabular">Domain Fit</th>
                  <th className="py-3 px-4 text-right font-mono-tabular">ATS Score</th>
                  <th className="py-3 px-4">Skill Breakdown</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {history.map((item) => {
                  const matched = item.skills.filter((s) => s.status === 'matched').length;
                  const missing = item.skills.filter((s) => s.status !== 'matched').length;
                  const isCurrent = item.id === activeReportId;
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isCurrent ? 'bg-slate-50/90' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{item.roleTitle}</div>
                        <div className="text-slate-500 mt-0.5">
                          {item.candidateName} ·{' '}
                          <span className="font-mono-tabular">
                            {new Date(item.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-tabular font-bold text-slate-900">
                        {item.overallScore}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-tabular text-slate-700">
                        {item.hardSkillsScore}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-tabular text-slate-700">
                        {item.domainScore}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-tabular text-slate-700">
                        {item.atsScore}%
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono-tabular">
                        {matched} matched · {missing} gaps
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onSelectReport(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                          >
                            <span>View Report</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteReport(item.id)}
                            aria-label={`Delete report for ${item.roleTitle}`}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
