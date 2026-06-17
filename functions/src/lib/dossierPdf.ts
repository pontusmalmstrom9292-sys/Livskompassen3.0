import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { CanonicalDossierEntry } from './dossierCanonicalHash';
import type { DossierAiForewordResult } from './dossierAiForeword';

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 48;
const LINE_HEIGHT = 13;
const MAX_CHARS = 88;

function wrapText(text: string): string[] {
  const lines: string[] = [];
  const paragraphs = text.split(/\n/);
  for (const paragraph of paragraphs) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push('');
      continue;
    }
    let current = '';
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length > MAX_CHARS) {
        if (current) lines.push(current);
        current = word.length > MAX_CHARS ? word.slice(0, MAX_CHARS) : word;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

function entryBody(entry: CanonicalDossierEntry): string {
  const parts = Object.entries(entry.payload)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}: ${v}`);
  return parts.join('\n') || '(tom post)';
}

type PdfBuildOptions = {
  dossierId: string;
  documentHash: string;
  generatedAtIso: string;
  reportType: string;
  dateFrom: string;
  dateTo: string;
  includeAiForeword: boolean;
  aiForeword?: DossierAiForewordResult;
  entries: CanonicalDossierEntry[];
  tacticSummary?: { technique: string; count: number }[];
};

export async function buildDossierPdf(options: PdfBuildOptions): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const ink = rgb(0.12, 0.14, 0.18);

  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  const drawLine = (text: string, bold = false) => {
    if (y < MARGIN + LINE_HEIGHT) {
      page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    }
    page.drawText(text, {
      x: MARGIN,
      y,
      size: 10,
      font: bold ? fontBold : font,
      color: ink,
    });
    y -= LINE_HEIGHT;
  };

  const drawBlock = (text: string, bold = false) => {
    for (const line of wrapText(text)) {
      drawLine(line, bold);
    }
  };

  drawLine('Livskompassen — Dossier-Generator', true);
  drawLine(`Rapport: ${options.reportType}`);
  drawLine(`Period: ${options.dateFrom} — ${options.dateTo}`);
  drawLine(`Genererad: ${options.generatedAtIso}`);
  drawLine(`Dossier-ID: ${options.dossierId}`);
  drawLine(`SHA-256 (kanonisk payload): ${options.documentHash}`);
  drawLine('');

  if (options.includeAiForeword && options.aiForeword) {
    drawLine('— AI-försätt (sammanfattning — bevis nedan är ordagrant WORM) —', true);
    drawBlock(options.aiForeword.foreword);
    drawLine('');
    if (options.aiForeword.timeline.length > 0) {
      drawLine('— Tidslinje (AI-strukturerad) —', true);
      for (const row of options.aiForeword.timeline) {
        drawLine(`${row.date}: ${row.fact}`);
      }
      drawLine('');
    }
  } else {
    drawLine(
      options.includeAiForeword
        ? 'AI-försätt: beställt men kunde inte genereras — bevisdelen nedan är ordagrant WORM.'
        : 'AI-försätt: ej inkluderat. Bevis = ordagrant WORM.',
    );
    drawLine('');
  }

  drawLine('— Bevis (kronologiskt) —', true);

  const sorted = [...options.entries].sort((a, b) => {
    const t = a.createdAt.localeCompare(b.createdAt);
    if (t !== 0) return t;
    return `${a.collection}:${a.docId}`.localeCompare(`${b.collection}:${b.docId}`);
  });

  for (const entry of sorted) {
    drawLine('');
    drawLine(
      `[${entry.createdAt.slice(0, 10)}] ${entry.collection} / ${entry.docId}`,
      true,
    );
    drawBlock(entryBody(entry));
  }

  if (options.tacticSummary && options.tacticSummary.length > 0) {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
    drawLine('Taktik-sammanfattning (regex-assisterad metadata)', true);
    drawLine(
      'Endast räknare från pattern_scan_metadata — inte diagnos, inte en del av WORM-beviskroppen.',
    );
    drawLine(`Period: ${options.dateFrom} — ${options.dateTo}`);
    drawLine('');
    for (const row of options.tacticSummary) {
      drawLine(`${row.technique}: ${row.count} valv-poster`);
    }
  }

  page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;
  drawLine('Integritetsstämpel', true);
  drawLine(`Dossier-ID: ${options.dossierId}`);
  drawLine(`SHA-256: ${options.documentHash}`);
  drawLine('Detta utdrag är en deterministisk rendering av valda WORM-poster.');
  drawLine('Ingen automatisk delning har skett från Livskompassen.');

  return pdf.save();
}
