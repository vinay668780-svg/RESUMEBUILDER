import { useState, useCallback } from 'react';
import { TopBar, ActiveTab } from './components/TopBar';
import { WorkspaceInputPanel } from './components/WorkspaceInputPanel';
import { ReportOverview } from './components/ReportOverview';
import { ResumeOptimizerView } from './components/ResumeOptimizerView';
import { SavedHistoryView } from './components/SavedHistoryView';
import { ROLE_PRESETS, RolePreset } from './utils/presets';
import {
  analyzeResumeAgainstJob,
  AnalysisReport,
  ImprovementItem,
} from './utils/analyzer';

const STORAGE_KEY = 'calibre_analysis_history_v1';

function loadSavedHistory(): AnalysisReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const initialPreset = ROLE_PRESETS[0];
  const [activeTab, setActiveTab] = useState<ActiveTab>('workspace');
  const [activePresetId, setActivePresetId] = useState<string>(initialPreset.id);
  const [resumeText, setResumeText] = useState<string>(initialPreset.resumeText);
  const [jobDescriptionText, setJobDescriptionText] = useState<string>(
    initialPreset.jobDescriptionText
  );

  const [report, setReport] = useState<AnalysisReport>(() =>
    analyzeResumeAgainstJob(initialPreset.resumeText, initialPreset.jobDescriptionText)
  );
  const [history, setHistory] = useState<AnalysisReport[]>(() => {
    const stored = loadSavedHistory();
    if (stored.length > 0) return stored;
    const initial = analyzeResumeAgainstJob(
      initialPreset.resumeText,
      initialPreset.jobDescriptionText
    );
    return [initial];
  });

  const [simulatedSkillIds, setSimulatedSkillIds] = useState<Set<string>>(new Set());
  const [appliedImprovementIds, setAppliedImprovementIds] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const persistHistory = useCallback((updated: AnalysisReport[]) => {
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 15)));
    } catch {
      // Ignore storage quota errors
    }
  }, []);

  const executeAnalysis = useCallback(
    async (targetResume: string, targetJd: string, switchTabOnSuccess = true) => {
      const cleanResume = targetResume.trim();
      const cleanJd = targetJd.trim();

      if (!cleanResume && !cleanJd) {
        setValidationError(
          'Please provide both a candidate resume (via file upload or text) and a target job description before running the analysis.'
        );
        return;
      }
      if (!cleanResume) {
        setValidationError(
          'Candidate resume text is empty. Upload a resume document or paste your resume content to continue.'
        );
        return;
      }
      if (!cleanJd) {
        setValidationError(
          'Target job description is empty. Paste the job requirements to compare skills and keywords.'
        );
        return;
      }

      setValidationError(null);
      setIsAnalyzing(true);
      setSimulatedSkillIds(new Set());

      try {
        let nextReport: AnalysisReport | null = null;
        try {
          const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              resumeText: cleanResume,
              jobDescriptionText: cleanJd,
            }),
          });
          if (response.ok) {
            nextReport = await response.json();
          }
        } catch {
          // Fallback to client-side deterministic engine
        }

        if (!nextReport) {
          nextReport = analyzeResumeAgainstJob(cleanResume, cleanJd);
        }

        setReport(nextReport);
        persistHistory([nextReport, ...history.filter((h) => h.id !== nextReport!.id)].slice(0, 15));
        if (switchTabOnSuccess) {
          setActiveTab('report');
        }
      } finally {
        setIsAnalyzing(false);
      }
    },
    [history, persistHistory]
  );

  const handleSelectPreset = (preset: RolePreset) => {
    setActivePresetId(preset.id);
    setResumeText(preset.resumeText);
    setJobDescriptionText(preset.jobDescriptionText);
    setValidationError(null);
    setSimulatedSkillIds(new Set());
    setAppliedImprovementIds(new Set());
    const freshReport = analyzeResumeAgainstJob(preset.resumeText, preset.jobDescriptionText);
    setReport(freshReport);
    persistHistory([freshReport, ...history].slice(0, 15));
    setStatusNotice(`Loaded benchmark: ${preset.label}`);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleClearAll = () => {
    setActivePresetId('');
    setResumeText('');
    setJobDescriptionText('');
    setValidationError(null);
    setSimulatedSkillIds(new Set());
    setAppliedImprovementIds(new Set());
  };

  const handleToggleSimulateSkill = (skillId: string) => {
    setSimulatedSkillIds((prev) => {
      const next = new Set(prev);
      if (next.has(skillId)) {
        next.delete(skillId);
      } else {
        next.add(skillId);
      }
      return next;
    });
  };

  const handleInsertKeywordIntoResume = (skillName: string) => {
    let updatedResume = resumeText;
    if (new RegExp(`\\b${skillName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(updatedResume)) {
      setStatusNotice(`"${skillName}" is already present in your resume text.`);
      setTimeout(() => setStatusNotice(null), 2500);
      return;
    }

    if (/SKILLS/i.test(updatedResume)) {
      updatedResume = `${updatedResume.trim()}\n- Additional Core Competencies: ${skillName}`;
    } else {
      updatedResume = `${updatedResume.trim()}\n\nSKILLS\n${skillName}`;
    }

    setResumeText(updatedResume);
    const updatedReport = analyzeResumeAgainstJob(updatedResume, jobDescriptionText);
    setReport(updatedReport);
    persistHistory([updatedReport, ...history].slice(0, 15));
    setStatusNotice(`Added "${skillName}" to resume and recalculated alignment (${updatedReport.overallScore}%).`);
    setTimeout(() => setStatusNotice(null), 3500);
  };

  const handleApplyImprovementRewrite = (improvement: ImprovementItem) => {
    let updatedResume = resumeText;
    if (
      improvement.originalExcerpt &&
      updatedResume.includes(improvement.originalExcerpt)
    ) {
      updatedResume = updatedResume.replace(
        improvement.originalExcerpt,
        improvement.suggestedRewrite
      );
    } else {
      updatedResume = `${updatedResume.trim()}\n- ${improvement.suggestedRewrite}`;
    }

    setResumeText(updatedResume);
    setAppliedImprovementIds((prev) => new Set(prev).add(improvement.id));
    const updatedReport = analyzeResumeAgainstJob(updatedResume, jobDescriptionText);
    setReport(updatedReport);
    persistHistory([updatedReport, ...history].slice(0, 15));
    setStatusNotice(
      `Applied tailored rewrite to resume — Alignment score updated to ${updatedReport.overallScore}%.`
    );
    setTimeout(() => setStatusNotice(null), 3500);
  };

  const handleDeleteHistoryItem = (reportId: string) => {
    const filtered = history.filter((h) => h.id !== reportId);
    persistHistory(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onPrimaryAction={() => executeAnalysis(resumeText, jobDescriptionText, true)}
        isAnalyzing={isAnalyzing}
        savedCount={history.length}
      />

      {/* Toast Notification Bar */}
      {statusNotice && (
        <div
          role="status"
          aria-live="polite"
          className="bg-slate-900 text-white text-xs font-medium px-6 py-2.5 text-center no-print"
        >
          {statusNotice}
        </div>
      )}

      <main className="flex-1 w-full max-w-[1320px] mx-auto px-4 sm:px-6 py-8 space-y-10">
        {activeTab === 'workspace' && (
          <>
            <WorkspaceInputPanel
              resumeText={resumeText}
              jobDescriptionText={jobDescriptionText}
              activePresetId={activePresetId}
              onChangeResume={(val) => {
                setResumeText(val);
                if (validationError) setValidationError(null);
              }}
              onChangeJobDescription={(val) => {
                setJobDescriptionText(val);
                if (validationError) setValidationError(null);
              }}
              onSelectPreset={handleSelectPreset}
              onClearAll={handleClearAll}
              onRunAnalysis={() => executeAnalysis(resumeText, jobDescriptionText, true)}
              isAnalyzing={isAnalyzing}
              validationError={validationError}
            />

            {/* Live Report Preview directly beneath Workspace when inputs are populated */}
            {resumeText.trim() && jobDescriptionText.trim() && (
              <div className="pt-6 border-t border-slate-200">
                <ReportOverview
                  report={report}
                  simulatedSkillIds={simulatedSkillIds}
                  onToggleSimulateSkill={handleToggleSimulateSkill}
                  onResetSimulation={() => setSimulatedSkillIds(new Set())}
                  onInsertKeywordIntoResume={handleInsertKeywordIntoResume}
                  onApplyImprovementRewrite={handleApplyImprovementRewrite}
                  appliedImprovementIds={appliedImprovementIds}
                  onOpenOptimizer={() => setActiveTab('optimizer')}
                />
              </div>
            )}
          </>
        )}

        {activeTab === 'report' && (
          <ReportOverview
            report={report}
            simulatedSkillIds={simulatedSkillIds}
            onToggleSimulateSkill={handleToggleSimulateSkill}
            onResetSimulation={() => setSimulatedSkillIds(new Set())}
            onInsertKeywordIntoResume={handleInsertKeywordIntoResume}
            onApplyImprovementRewrite={handleApplyImprovementRewrite}
            appliedImprovementIds={appliedImprovementIds}
            onOpenOptimizer={() => setActiveTab('optimizer')}
          />
        )}

        {activeTab === 'optimizer' && (
          <ResumeOptimizerView
            resumeText={resumeText}
            report={report}
            onChangeResume={setResumeText}
            onInsertKeyword={handleInsertKeywordIntoResume}
            onReanalyze={() => executeAnalysis(resumeText, jobDescriptionText, false)}
            isAnalyzing={isAnalyzing}
          />
        )}

        {activeTab === 'history' && (
          <SavedHistoryView
            history={history}
            activeReportId={report.id}
            onSelectReport={(selected) => {
              setReport(selected);
              setActiveTab('report');
            }}
            onDeleteReport={handleDeleteHistoryItem}
            onStartNewAnalysis={() => setActiveTab('workspace')}
          />
        )}
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-4 text-xs text-slate-500 no-print">
        <div className="max-w-[1320px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Calibre — Resume &amp; Job Description Skill Alignment Studio</span>
          <span>Supports PDF, Image, TXT, Markdown &amp; HTML Resume Extraction</span>
        </div>
      </footer>
    </div>
  );
}
