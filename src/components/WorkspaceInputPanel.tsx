import React, { useRef, useState } from 'react';
import { Upload, FileText, Sparkles, AlertCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { ROLE_PRESETS, RolePreset } from '../utils/presets';
import { extractTextFromUploadedFile, ExtractedResumeResult } from '../utils/fileExtractor';

interface WorkspaceInputPanelProps {
  resumeText: string;
  jobDescriptionText: string;
  activePresetId: string;
  onChangeResume: (text: string) => void;
  onChangeJobDescription: (text: string) => void;
  onSelectPreset: (preset: RolePreset) => void;
  onClearAll: () => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  validationError: string | null;
}

export const WorkspaceInputPanel: React.FC<WorkspaceInputPanelProps> = ({
  resumeText,
  jobDescriptionText,
  activePresetId,
  onChangeResume,
  onChangeJobDescription,
  onSelectPreset,
  onClearAll,
  onRunAnalysis,
  isAnalyzing,
  validationError,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isExtractingFile, setIsExtractingFile] = useState(false);
  const [extractionMeta, setExtractionMeta] = useState<ExtractedResumeResult | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileSelection = async (file: File | undefined) => {
    if (!file) return;
    setIsExtractingFile(true);
    setFileError(null);
    try {
      const result = await extractTextFromUploadedFile(file);
      onChangeResume(result.text);
      setExtractionMeta(result);
    } catch (err) {
      setFileError(err instanceof Error ? err.message : 'Unable to extract text from file.');
    } finally {
      setIsExtractingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const resumeWordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;
  const jdWordCount = jobDescriptionText.trim() ? jobDescriptionText.trim().split(/\s+/).length : 0;

  return (
    <section aria-labelledby="workspace-heading" className="space-y-6">
      {/* Header & Role Benchmark Presets */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="space-y-1.5 max-w-xl">
          <p className="text-xs font-medium text-slate-500">
            Resume Text Extraction · Skill Benchmarking · ATS Gap Diagnostics
          </p>
          <h1 id="workspace-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Extract resume text and benchmark skills against any job description
          </h1>
        </div>

        {/* Interactive Role Benchmark Selector */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-slate-500 mr-1 whitespace-nowrap">Role Benchmark:</span>
          <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            {ROLE_PRESETS.map((preset) => {
              const selected = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setExtractionMeta(null);
                    setFileError(null);
                    onSelectPreset(preset);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    selected
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              setExtractionMeta(null);
              setFileError(null);
              onClearAll();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Inputs
          </button>
        </div>
      </div>

      {/* Validation or File Error Banner */}
      {(validationError || fileError) && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-900 text-sm"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Input Validation Required</p>
            <p className="text-red-800 text-xs leading-relaxed">{validationError || fileError}</p>
          </div>
        </div>
      )}

      {/* 2-Column Split Input Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Column 1: Resume Upload & Extracted Text Editor */}
        <div className="flex flex-col bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <label htmlFor="resume-textarea" className="block text-sm font-semibold text-slate-900">
                01. Candidate Resume Source
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload PDF, Image, TXT, Markdown, or HTML to extract text, or edit directly below
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                id="resume-file-upload"
                type="file"
                accept=".pdf,.txt,.md,.html,.htm,.png,.jpg,.jpeg,.webp,.json,.csv"
                onChange={(e) => handleFileSelection(e.target.files?.[0])}
                className="sr-only"
              />
              <button
                type="button"
                disabled={isExtractingFile}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                {isExtractingFile ? 'Extracting Text...' : 'Upload Resume File'}
              </button>
            </div>
          </div>

          {/* Extraction Metadata Line (Unboxed clean metadata) */}
          {extractionMeta && (
            <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50/70 px-3 py-2 rounded-lg border border-emerald-200">
              <span className="truncate">
                Extracted from <strong>{extractionMeta.fileName}</strong> ·{' '}
                {extractionMeta.method === 'gemini-multimodal'
                  ? 'Multimodal Document OCR'
                  : extractionMeta.method === 'pdf-stream-parser'
                  ? 'PDF Stream Parser'
                  : 'Direct UTF-8 Text'}
              </span>
              <span className="font-mono-tabular shrink-0 ml-2">
                {extractionMeta.characterCount} chars
              </span>
            </div>
          )}

          <textarea
            id="resume-textarea"
            value={resumeText}
            onChange={(e) => onChangeResume(e.target.value)}
            placeholder="Paste candidate resume text here or click 'Upload Resume File' above to extract text from a document..."
            rows={15}
            className="w-full flex-1 font-mono text-xs leading-relaxed text-slate-800 bg-slate-50/70 border border-slate-200 rounded-lg p-3.5 focus:bg-white focus:border-slate-900 focus:outline-none transition-colors resize-y"
          />

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Supports Experience, Skills, Education, and Summary parsing</span>
            <span className="font-mono-tabular">{resumeWordCount} words</span>
          </div>
        </div>

        {/* Column 2: Target Job Description Input */}
        <div className="flex flex-col bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <label htmlFor="jd-textarea" className="block text-sm font-semibold text-slate-900">
                02. Target Job Description
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Paste the full job posting including responsibilities and required qualifications
              </p>
            </div>

            <span className="text-xs text-slate-500 font-mono-tabular">
              Auto-weights Critical vs. Recommended skills
            </span>
          </div>

          <textarea
            id="jd-textarea"
            value={jobDescriptionText}
            onChange={(e) => onChangeJobDescription(e.target.value)}
            placeholder="Paste the target job description here (responsibilities, required skills, qualifications, tech stack)..."
            rows={15}
            className="w-full flex-1 font-mono text-xs leading-relaxed text-slate-800 bg-slate-50/70 border border-slate-200 rounded-lg p-3.5 focus:bg-white focus:border-slate-900 focus:outline-none transition-colors resize-y"
          />

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Extracts hard technical skills, domain methods, and leadership criteria</span>
            <span className="font-mono-tabular">{jdWordCount} words</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <FileText className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            Ready to compare <strong className="font-mono-tabular text-slate-900">{resumeWordCount}</strong> resume words against{' '}
            <strong className="font-mono-tabular text-slate-900">{jdWordCount}</strong> job description words.
          </span>
        </div>

        <button
          type="button"
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAnalyzing ? 'Generating Alignment Report...' : 'Analyze Resume Match'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
