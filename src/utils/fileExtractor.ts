export interface ExtractedResumeResult {
  text: string;
  fileName: string;
  method: 'utf8-direct' | 'gemini-multimodal' | 'pdf-stream-parser';
  characterCount: number;
}

/**
 * Deterministic fallback parser for extracting readable ASCII/UTF-8 text strings
 * from simple PDF buffers or RTF/HTML files when offline or without multimodal API.
 */
export function parseReadableTextFromBuffer(rawText: string, fileName: string): string {
  const lowerName = fileName.toLowerCase();

  if (lowerName.endsWith('.html') || lowerName.endsWith('.htm')) {
    return rawText
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<\/(p|div|li|h[1-6]|tr|br)>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  if (lowerName.endsWith('.pdf') || rawText.startsWith('%PDF')) {
    // Extract text inside PDF text blocks (...) or BT ... ET operators
    const parentheticalMatches = rawText.match(/\(([^()\\]{2,200})\)/g) || [];
    const cleanedTokens = parentheticalMatches
      .map((m) => m.slice(1, -1))
      .filter(
        (token) =>
          /[a-zA-Z]{2,}/.test(token) &&
          !/^(Type|Font|Page|Catalog|Outlines|Parent|Resources|ProcSet|MediaBox|Contents|Filter|FlateDecode|Length|BaseFont|Subtype|Encoding|WinAnsiEncoding)/i.test(
            token.trim()
          )
      );

    if (cleanedTokens.length >= 5) {
      return cleanedTokens.join(' ').replace(/\s+/g, ' ').trim();
    }
  }

  return rawText.trim();
}

export async function extractTextFromUploadedFile(file: File): Promise<ExtractedResumeResult> {
  const lowerName = file.name.toLowerCase();
  const isDirectText =
    file.type.startsWith('text/') ||
    lowerName.endsWith('.txt') ||
    lowerName.endsWith('.md') ||
    lowerName.endsWith('.csv') ||
    lowerName.endsWith('.json') ||
    lowerName.endsWith('.html') ||
    lowerName.endsWith('.htm');

  if (isDirectText) {
    const raw = await file.text();
    const cleaned = parseReadableTextFromBuffer(raw, file.name);
    return {
      text: cleaned,
      fileName: file.name,
      method: 'utf8-direct',
      characterCount: cleaned.length,
    };
  }

  // Convert binary/multimodal file (PDF, PNG, JPG, WEBP, DOCX) to base64 and send to server
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64Data = btoa(binary);

  try {
    const response = await fetch('/api/extract-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        mimeType: file.type || (lowerName.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream'),
        base64Data,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.text && data.text.trim().length > 0) {
        return {
          text: data.text.trim(),
          fileName: file.name,
          method: data.method || 'gemini-multimodal',
          characterCount: data.text.trim().length,
        };
      }
    }
  } catch {
    // Fallback to client-side stream parser below
  }

  const rawLatin = new TextDecoder('utf-8', { fatal: false }).decode(arrayBuffer);
  const fallbackText = parseReadableTextFromBuffer(rawLatin, file.name);
  if (fallbackText && fallbackText.length > 20) {
    return {
      text: fallbackText,
      fileName: file.name,
      method: 'pdf-stream-parser',
      characterCount: fallbackText.length,
    };
  }

  throw new Error(
    `Could not extract readable text from "${file.name}". Please upload a text-based PDF, TXT, Markdown file, or paste your resume text directly.`
  );
}
