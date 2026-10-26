import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { analyzeResumeAgainstJob, AnalysisReport, ImprovementItem } from './src/utils/analyzer';
import { parseReadableTextFromBuffer } from './src/utils/fileExtractor';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// POST /api/extract-resume: Extracts clean structured text from uploaded PDF/Image/Document
app.post('/api/extract-resume', async (req, res) => {
  try {
    const { fileName, mimeType, base64Data } = req.body || {};
    if (!base64Data || typeof base64Data !== 'string') {
      res.status(400).json({ error: 'Missing file payload (base64Data).' });
      return;
    }

    const ai = getGeminiClient();
    if (ai) {
      try {
        const supportedMime =
          mimeType && /^(application\/pdf|image\/(png|jpeg|jpg|webp)|text\/plain)$/i.test(mimeType)
            ? mimeType
            : 'application/pdf';

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: supportedMime,
                  data: base64Data,
                },
              },
              {
                text: 'Extract all text from this resume document accurately. Preserve section headings (SUMMARY, EXPERIENCE, EDUCATION, SKILLS), job titles, dates, bullet points, and metrics in clean plain text.',
              },
            ],
          },
        });

        const extractedText = response.text?.trim();
        if (extractedText && extractedText.length > 20) {
          res.json({
            text: extractedText,
            method: 'gemini-multimodal',
          });
          return;
        }
      } catch (aiError) {
        console.warn('Gemini multimodal extraction fallback triggered:', aiError);
      }
    }

    // Deterministic buffer extraction fallback
    const decoded = Buffer.from(base64Data, 'base64').toString('utf-8');
    const parsed = parseReadableTextFromBuffer(decoded, fileName || 'resume.pdf');
    res.json({
      text: parsed,
      method: 'pdf-stream-parser',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to extract text from document.';
    res.status(500).json({ error: message });
  }
});

// POST /api/analyze: Runs deterministic skill comparison and optionally enriches with Gemini 3.8 Flash
app.post('/api/analyze', async (req, res) => {
  try {
    const { resumeText, jobDescriptionText } = req.body || {};
    if (!resumeText || typeof resumeText !== 'string' || !resumeText.trim()) {
      res.status(400).json({ error: 'Resume text is required for analysis.' });
      return;
    }
    if (!jobDescriptionText || typeof jobDescriptionText !== 'string' || !jobDescriptionText.trim()) {
      res.status(400).json({ error: 'Job description text is required for analysis.' });
      return;
    }

    // Always compute the deterministic baseline first
    const baseReport: AnalysisReport = analyzeResumeAgainstJob(resumeText, jobDescriptionText);

    const ai = getGeminiClient();
    if (!ai) {
      res.json(baseReport);
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are an expert technical recruiter and ATS optimization engine.
Compare the following Candidate Resume against the Target Job Description.

CANDIDATE RESUME:
${resumeText.slice(0, 8000)}

TARGET JOB DESCRIPTION:
${jobDescriptionText.slice(0, 8000)}

Provide:
1. A concise 2-sentence executive summary of the candidate's fit and primary gap.
2. Up to 4 high-impact resume improvements with concrete before/after bullet point rewrites tailored to this exact job description.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveSummary: {
                type: Type.STRING,
                description: '2-sentence executive fit summary.',
              },
              improvements: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    category: {
                      type: Type.STRING,
                      description: 'One of: Keyword Gap, Impact Quantification, ATS Structure, Role Alignment',
                    },
                    priority: {
                      type: Type.STRING,
                      description: 'High or Medium',
                    },
                    diagnosis: { type: Type.STRING },
                    actionableAdvice: { type: Type.STRING },
                    targetKeywords: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    originalExcerpt: { type: Type.STRING },
                    suggestedRewrite: { type: Type.STRING },
                  },
                  required: [
                    'title',
                    'category',
                    'priority',
                    'diagnosis',
                    'actionableAdvice',
                    'targetKeywords',
                    'suggestedRewrite',
                  ],
                },
              },
            },
            required: ['executiveSummary', 'improvements'],
          },
        },
      });

      const rawJson = response.text?.trim();
      if (rawJson) {
        const parsed = JSON.parse(rawJson);
        if (parsed.executiveSummary) {
          baseReport.executiveSummary = parsed.executiveSummary;
        }
        if (Array.isArray(parsed.improvements) && parsed.improvements.length > 0) {
          const validCategories = new Set([
            'Keyword Gap',
            'Impact Quantification',
            'ATS Structure',
            'Role Alignment',
          ]);
          const aiImprovements: ImprovementItem[] = parsed.improvements.map(
            (imp: Record<string, unknown>, idx: number) => ({
              id: `ai-imp-${idx}`,
              title: String(imp.title || 'Targeted Resume Enhancement'),
              category: (validCategories.has(String(imp.category))
                ? imp.category
                : 'Role Alignment') as ImprovementItem['category'],
              priority: imp.priority === 'Medium' ? 'Medium' : 'High',
              diagnosis: String(imp.diagnosis || ''),
              actionableAdvice: String(imp.actionableAdvice || ''),
              targetKeywords: Array.isArray(imp.targetKeywords)
                ? imp.targetKeywords.map(String)
                : [],
              originalExcerpt: imp.originalExcerpt ? String(imp.originalExcerpt) : undefined,
              suggestedRewrite: String(imp.suggestedRewrite || ''),
            })
          );
          baseReport.improvements = aiImprovements;
        }
        baseReport.analysisEngine = 'hybrid-gemini';
      }
    } catch (aiErr) {
      // Keep deterministic baseline if Gemini call fails
      console.warn('Using deterministic analysis report due to AI service warning:', aiErr);
    }

    res.json(baseReport);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected analysis error.';
    res.status(500).json({ error: message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Calibre server listening on http://localhost:${PORT}`);
  });
}

startServer();
