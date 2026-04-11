/**
 * cv-generator.ts
 * Picks the right resume variant for a job, converts docx→pdf if needed,
 * and outputs to data/output/ as NishantChaudhary.pdf (always this name).
 */
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { generateCoverLetter } from '../lib/claude.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESUMES_DIR = path.join(__dirname, '../../resumes');
const OUTPUT_DIR = path.join(__dirname, '../../data/output');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

export type ResumeVariant = 'faang' | 'hybrid' | 'ats' | 'general';

const VARIANT_FILES: Record<ResumeVariant, string> = {
  faang:   path.join(RESUMES_DIR, 'variant_faang.pdf'),
  hybrid:  path.join(RESUMES_DIR, 'variant_hybrid.docx'),
  ats:     path.join(RESUMES_DIR, 'variant_ats.docx'),
  general: path.join(RESUMES_DIR, 'variant_general.pdf'),
};

// Output paths — always the same public-facing filenames
export const OUTPUT_RESUME_PATH      = path.join(OUTPUT_DIR, 'NishantChaudhary.pdf');
export const OUTPUT_COVER_LETTER_PATH = path.join(OUTPUT_DIR, 'NishantChaudhary_CoverLetter.pdf');

/**
 * Choose the best variant based on job location and Claude's suggestion.
 * Claude's suggestion takes priority; location is the fallback heuristic.
 */
export function chooseVariant(
  claudeSuggestion: ResumeVariant | undefined,
  jobLocation: string
): ResumeVariant {
  if (claudeSuggestion && VARIANT_FILES[claudeSuggestion]) {
    return claudeSuggestion;
  }

  const loc = jobLocation.toLowerCase();
  if (loc.includes('india') || loc.includes('delhi') || loc.includes('bangalore') || loc.includes('mumbai') || loc.includes('noida')) {
    return 'ats';
  }
  if (loc.includes('europe') || loc.includes('germany') || loc.includes('netherlands') || loc.includes('uk') || loc.includes('france') || loc.includes('spain') || loc.includes('berlin') || loc.includes('amsterdam')) {
    return 'hybrid';
  }
  if (loc.includes('usa') || loc.includes('us') || loc.includes('united states') || loc.includes('san francisco') || loc.includes('new york') || loc.includes('seattle')) {
    return 'faang';
  }

  return 'general';
}

/**
 * Convert a .docx file to PDF using LibreOffice headless.
 * LibreOffice must be installed: brew install --cask libreoffice
 */
function docxToPdf(docxPath: string, outputDir: string): string {
  const baseName = path.basename(docxPath, '.docx') + '.pdf';
  const outPath = path.join(outputDir, baseName);

  // 1. Try LibreOffice (best quality, cross-platform)
  try {
    execSync(`soffice --headless --convert-to pdf --outdir "${outputDir}" "${docxPath}"`, {
      stdio: 'pipe', timeout: 30000,
    });
    if (fs.existsSync(outPath)) return outPath;
  } catch { /* not installed */ }

  // 2. Try macOS osascript via Pages (built-in on Mac)
  try {
    const absDocx = path.resolve(docxPath);
    const absPdf  = path.resolve(outPath);
    const script  = `
      tell application "Pages"
        set d to open POSIX file "${absDocx}"
        export d to POSIX file "${absPdf}" as PDF
        close d saving no
      end tell`;
    execSync(`osascript -e '${script.replace(/'/g, "'\"'\"'")}'`, {
      stdio: 'pipe', timeout: 30000,
    });
    if (fs.existsSync(outPath)) return outPath;
  } catch { /* Pages not available or failed */ }

  // 3. Try python docx2pdf (pip3 install docx2pdf — uses Word on Mac)
  try {
    execSync(`python3 -c "from docx2pdf import convert; convert('${docxPath}', '${outPath}')"`, {
      stdio: 'pipe', timeout: 30000,
    });
    if (fs.existsSync(outPath)) return outPath;
  } catch { /* not installed */ }

  // 4. Fallback: use the general PDF variant
  console.warn('⚠️  No docx→pdf converter found. Falling back to general PDF variant.');
  console.warn('   To fix: brew install --cask libreoffice');
  return VARIANT_FILES['general'];
}

/**
 * Prepare the resume for a job application:
 * 1. Pick variant
 * 2. Convert docx→pdf if needed
 * 3. Copy to OUTPUT_RESUME_PATH (NishantChaudhary.pdf)
 * Returns the output path (always NishantChaudhary.pdf)
 */
export async function prepareResume(variant: ResumeVariant): Promise<string> {
  const src = VARIANT_FILES[variant];

  let pdfPath: string;
  if (src.endsWith('.docx')) {
    pdfPath = docxToPdf(src, OUTPUT_DIR);
  } else {
    pdfPath = src;
  }

  // Always rename to NishantChaudhary.pdf for submission
  fs.copyFileSync(pdfPath, OUTPUT_RESUME_PATH);
  return OUTPUT_RESUME_PATH;
}

/**
 * Generate a tailored cover letter using Claude and save as PDF.
 * Uses reportlab-style simple text PDF via a Python helper,
 * or writes a .txt fallback if Python/reportlab not available.
 */
export async function prepareCoverLetter(job: {
  title: string;
  company: string;
  description: string;
  tailoringNotes: string;
}): Promise<string> {
  const text = await generateCoverLetter(job);

  // Write as plain txt first (always works)
  const txtPath = path.join(OUTPUT_DIR, 'NishantChaudhary_CoverLetter.txt');
  fs.writeFileSync(txtPath, text, 'utf-8');

  // Try to generate PDF from the text using Python reportlab
  const pyScript = `
import sys
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm

out = sys.argv[1]
text = open(sys.argv[2]).read()

doc = SimpleDocTemplate(out, pagesize=A4,
  leftMargin=2.5*cm, rightMargin=2.5*cm,
  topMargin=3*cm, bottomMargin=3*cm)

styles = getSampleStyleSheet()
body = ParagraphStyle('Body', parent=styles['Normal'], fontSize=11, leading=16, spaceAfter=12)

story = []
for para in text.split('\\n\\n'):
  para = para.strip()
  if para:
    story.append(Paragraph(para.replace('\\n', '<br/>'), body))
    story.append(Spacer(1, 6))

doc.build(story)
print('ok')
`;

  const pyScriptPath = path.join(OUTPUT_DIR, '_gen_cl.py');
  fs.writeFileSync(pyScriptPath, pyScript);

  try {
    execSync(
      `python3 "${pyScriptPath}" "${OUTPUT_COVER_LETTER_PATH}" "${txtPath}"`,
      { stdio: 'pipe', timeout: 15000 }
    );
  } catch {
    // If reportlab not available, copy base cover letter PDF as fallback
    console.warn('⚠️  reportlab not available — using base cover letter PDF');
    fs.copyFileSync(
      path.join(RESUMES_DIR, 'cover_letter_base.pdf'),
      OUTPUT_COVER_LETTER_PATH
    );
  }

  return OUTPUT_COVER_LETTER_PATH;
}
