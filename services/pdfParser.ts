// Lightweight PDF parsing helper using pdfjs-dist to extract plain text for chapter detection.
// This runs client-side; large PDFs (120+ pages) will be processed sequentially with progress callbacks.

// Types are loosely declared to avoid needing @types; pdfjs-dist doesn't ship full TS types by default.
// We declare minimal structural types used in this module.
export interface PDFPageProxy { getTextContent: () => Promise<{ items: any[] }>; }
export interface PDFDocumentProxy { numPages: number; getPage: (n: number) => Promise<PDFPageProxy>; }

// Lazy import so bundle impact is minimized until feature is used.
async function loadPdfJs() {
  // Dynamic import with Vite-friendly worker URL
  // @ts-ignore
  const pdfjs = await import('pdfjs-dist');
  // @ts-ignore
  const workerUrlMod = await import('pdfjs-dist/build/pdf.worker.mjs?url');
  // @ts-ignore
  const workerUrl = workerUrlMod?.default || workerUrlMod;
  // @ts-ignore
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  return pdfjs;
}

export interface RawPdfPage { index: number; text: string; }
export interface ChapterDraft { id: string; title: string; pages: number[]; raw: string; }
export interface ParseOptions { onProgress?: (ratio: number) => void; signal?: AbortSignal; }

// Broaden Arabic heading detection to handle ordinals and digits, with punctuation variants.
const AR_ORDINALS = '(الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر|\\d+)';
const headingRe1 = new RegExp(
  `^\\s*(?:الفصل|القسم)\\s+${AR_ORDINALS}(?:\\s*[:：\\-–—.]?\\s*.*)?$`,
  'm'
);
const headingRe2 = /^\s*(?:المقدمة|تمهيد)\b/m;
const headingRe3 = /^\s*(?:الخاتمة|الختام|الملاحق)\b/m;
const headingRe4 = /^\s*شكر\s*وتقدير\b/m;

const chapterHeadingPatterns: RegExp[] = [headingRe1, headingRe2, headingRe3, headingRe4];

function detectHeading(line: string): boolean {
  return chapterHeadingPatterns.some(r => r.test(line));
}

export async function extractPdfText(file: File, opts: ParseOptions = {}): Promise<RawPdfPage[]> {
  const pdfjs = await loadPdfJs();
  const arrayBuf = await file.arrayBuffer();
  const pdf: PDFDocumentProxy = await pdfjs.getDocument({ data: arrayBuf }).promise;
  const pages: RawPdfPage[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const page: PDFPageProxy = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((it: any) => (it.str || '')).join('\n');
    pages.push({ index: i, text });
    opts.onProgress?.(i / pdf.numPages);
  }
  return pages;
}

export function buildChapters(pages: RawPdfPage[]): ChapterDraft[] {
  const drafts: ChapterDraft[] = [];
  let current: ChapterDraft | null = null;
  for (const p of pages) {
    const lines = p.text.split(/\n+/).map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (detectHeading(line)) {
        if (current) drafts.push(current);
        const title = line.replace(/\s*[:：\-–—.]+\s*$/, '').trim();
        const id = title
          .replace(/\s+/g, '-')
          .replace(/[^ء-ي\-0-9a-zA-Z]/g, '')
          .toLowerCase();
        current = { id, title, pages: [p.index], raw: '' };
      } else {
        if (!current) {
          // Skip text before first detected heading
          continue;
        }
        current.raw += (current.raw ? '\n\n' : '') + line;
        if (!current.pages.includes(p.index)) current.pages.push(p.index);
      }
    }
  }
  if (current) drafts.push(current);
  return drafts;
}

// Simple normalization pass: fix common OCR issues.
const replacements: [RegExp, string][] = [
  [/االصطناعي/g, 'الاصطناعي'],
  [/إىل/g, 'إلى'],
  [/األ/g, 'الأ'],
  [/اال/g, 'ال'],
  [/اال/g, 'ال'],
  [/ال يتجزأ/g, 'لا يتجزأ'],
  [/\s+ـ\s+/g, ' '],
  [/\s*[:：]\s*/g, ': '],
];

export function normalizeArabic(raw: string): string {
  let out = raw;
  for (const [re, to] of replacements) out = out.replace(re, to);
  return out;
}

export function chapterDraftToJsx(ch: ChapterDraft): string {
  const paras = normalizeArabic(ch.raw).split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  const body = paras.map(p => `            <p>${escapeHtml(p)}</p>`).join('\n');
  return `        {\n            id: '${ch.id}',\n            title: '${escapeQuotes(ch.title)}',\n            content: () => { return <>\n${body}\n            </>; }\n        }`;
}

function escapeQuotes(s: string) { return s.replace(/'/g, "\\'"); }
function escapeHtml(s: string) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// Generate TypeScript file content holding chapters array
export function generateTsFile(drafts: ChapterDraft[]): string {
  const chaptersJsx = drafts.map(d => chapterDraftToJsx(d)).join(',\n');
  return `// Auto-generated from PDF import. Do not edit manually.\nimport React from 'react';\n\nexport const importedChapters = [\n${chaptersJsx}\n];\n`;
}

// Fallback: if no headings are detected, export everything as a single full chapter.
export function generateFallbackTsFile(pages: RawPdfPage[]): string {
  const full = normalizeArabic(pages.map(p => p.text).join('\n\n'));
  const paras = full.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  const body = paras.map(p => `            <p>${escapeHtml(p)}</p>`).join('\n');
  return `// Auto-generated from PDF import (fallback). Do not edit manually.\nimport React from 'react';\n\nexport const importedChapters = [\n  {\n    id: 'chapter-1',\n    title: 'الفصل الأول: النص الكامل',\n    content: () => { return <>\n${body}\n    </>; }\n  }\n];\n`;
}
