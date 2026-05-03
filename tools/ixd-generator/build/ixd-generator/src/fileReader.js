import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { spawnSync } from 'child_process';
import sharp from 'sharp';
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff']);
const MAX_WIDTH = 1568; // Claude Vision optimal width
const PDFTOPPM = '/opt/homebrew/bin/pdftoppm';
export async function readDesignFile(filePath, pageNumber = 1) {
    if (!fs.existsSync(filePath))
        throw new Error(`File not found: ${filePath}`);
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.pdf')
        return readPdfPage(filePath, pageNumber);
    if (IMAGE_EXTS.has(ext))
        return readImageFile(filePath);
    throw new Error(`Unsupported format: ${ext}. Supported: ${[...IMAGE_EXTS, '.pdf'].join(', ')}`);
}
export function getPdfPageCount(filePath) {
    if (!fs.existsSync(filePath))
        throw new Error(`File not found: ${filePath}`);
    // Use pdftoppm -l 1 and pdfinfo-compatible approach: run pdftoppm dry-run
    // Faster: use pdftoppm to list via -l 9999 and count output files
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ixd-count-'));
    try {
        const r = spawnSync(PDFTOPPM, ['-png', '-r', '10', '-l', '1', filePath, path.join(tmp, 'p')], { encoding: 'utf8' });
        // Get actual count via a second call that would fail on page > count
        // Better: use pdfinfo if available, else try pdftoppm with high page and count
        const r2 = spawnSync('sh', ['-c', `${PDFTOPPM} -png -r 10 "${filePath}" "${tmp}/cnt" 2>/dev/null; ls "${tmp}"/cnt-*.ppm "${tmp}"/cnt-*.png 2>/dev/null | wc -l`], { encoding: 'utf8' });
        // Clean run all pages at 10dpi to count
        const r3 = spawnSync(PDFTOPPM, ['-png', '-r', '10', filePath, path.join(tmp, 'all')], { encoding: 'utf8' });
        const files = fs.readdirSync(tmp).filter(f => f.startsWith('all') && (f.endsWith('.png') || f.endsWith('.ppm')));
        return Math.max(1, files.length);
    }
    finally {
        fs.rmSync(tmp, { recursive: true, force: true });
    }
}
async function readImageFile(filePath) {
    const buffer = fs.readFileSync(filePath);
    const { data, info } = await sharp(buffer)
        .resize(MAX_WIDTH, null, { fit: 'inside', withoutEnlargement: true })
        .png()
        .toBuffer({ resolveWithObject: true });
    return {
        base64: data.toString('base64'),
        mimeType: 'image/png',
        width: info.width,
        height: info.height,
        page: 1,
        totalPages: 1,
        source: 'image',
    };
}
async function readPdfPage(filePath, pageNumber) {
    const totalPages = getPdfPageCount(filePath);
    if (pageNumber < 1 || pageNumber > totalPages) {
        throw new Error(`Page ${pageNumber} out of range (1–${totalPages})`);
    }
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ixd-pdf-'));
    try {
        const outPrefix = path.join(tmp, 'page');
        // Render at 150 DPI — good quality without huge file size
        const result = spawnSync(PDFTOPPM, ['-png', '-r', '150', '-f', String(pageNumber), '-l', String(pageNumber), filePath, outPrefix], { encoding: 'utf8', timeout: 20000 });
        if (result.error)
            throw new Error(`pdftoppm failed: ${result.error.message}`);
        if (result.status !== 0)
            throw new Error(`pdftoppm error: ${result.stderr || 'unknown'}`);
        const files = fs.readdirSync(tmp).filter(f => f.endsWith('.png') || f.endsWith('.ppm'));
        if (files.length === 0)
            throw new Error('pdftoppm produced no output');
        const imgPath = path.join(tmp, files[0]);
        const { data, info } = await sharp(imgPath)
            .resize(MAX_WIDTH, null, { fit: 'inside', withoutEnlargement: true })
            .png()
            .toBuffer({ resolveWithObject: true });
        return {
            base64: data.toString('base64'),
            mimeType: 'image/png',
            width: info.width,
            height: info.height,
            page: pageNumber,
            totalPages,
            source: 'pdf',
        };
    }
    finally {
        fs.rmSync(tmp, { recursive: true, force: true });
    }
}
//# sourceMappingURL=fileReader.js.map