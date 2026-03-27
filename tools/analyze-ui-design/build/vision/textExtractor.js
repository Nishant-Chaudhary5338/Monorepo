import Tesseract from 'tesseract.js';
import { extractRegion } from '../parsers/imageParser.js';
import { sortTopLeft } from '../utils/bbox.js';
/**
 * Extract text from an image using OCR (Tesseract.js)
 */
export async function extractText(image) {
    try {
        const result = await Tesseract.recognize(image.buffer, 'eng', {
            logger: () => { }, // Suppress logging
        });
        const texts = [];
        const textIndex = 0;
        // Process words from the OCR result
        if (result.data.words) {
            for (const word of result.data.words) {
                if (!word.text || word.text.trim().length === 0)
                    continue;
                if (word.confidence < 30)
                    continue; // Skip low-confidence detections
                const bbox = {
                    x: word.bbox.x0,
                    y: word.bbox.y0,
                    width: word.bbox.x1 - word.bbox.x0,
                    height: word.bbox.y1 - word.bbox.y0,
                };
                // Skip very small text (noise)
                if (bbox.width < 5 || bbox.height < 5)
                    continue;
                texts.push({
                    id: `text-${textIndex++}`,
                    text: word.text.trim(),
                    bbox,
                    confidence: word.confidence / 100,
                    fontSize: classifyFontSize(bbox.height, image.height),
                    fontWeight: classifyFontWeight(word),
                });
            }
        }
        // Merge nearby text into lines/paragraphs
        const mergedTexts = mergeNearbyTexts(texts);
        // Also extract line-level text for better context
        const lineTexts = extractLineTexts(result.data, textIndex);
        return [...mergedTexts, ...lineTexts];
    }
    catch (error) {
        console.error('OCR extraction failed:', error);
        return [];
    }
}
/**
 * Extract text from a specific region of an image
 */
export async function extractTextFromRegion(image, bbox) {
    try {
        const regionBuffer = await extractRegion(image, bbox.x, bbox.y, bbox.width, bbox.height);
        const regionImage = {
            width: Math.round(bbox.width),
            height: Math.round(bbox.height),
            channels: 3,
            buffer: regionBuffer,
            metadata: {},
        };
        const texts = await extractText(regionImage);
        // Adjust bboxes to be relative to the original image
        return texts.map(t => ({
            ...t,
            bbox: {
                x: t.bbox.x + bbox.x,
                y: t.bbox.y + bbox.y,
                width: t.bbox.width,
                height: t.bbox.height,
            },
        }));
    }
    catch {
        return [];
    }
}
/**
 * Classify font size based on text height relative to image
 */
function classifyFontSize(textHeight, imageHeight) {
    const relativeHeight = textHeight / imageHeight;
    if (relativeHeight > 0.05)
        return 'heading';
    if (relativeHeight > 0.03)
        return 'large';
    if (relativeHeight > 0.015)
        return 'medium';
    return 'small';
}
/**
 * Classify font weight based on OCR word properties
 */
function classifyFontWeight(word) {
    // Tesseract doesn't directly provide font weight
    // Use heuristics: bold text often has higher stroke width
    if (word.choices && word.choices.length > 0) {
        const confidence = word.confidence;
        // Higher confidence often correlates with clearer/bolder text
        if (confidence > 85)
            return 'bold';
        if (confidence > 70)
            return 'medium';
    }
    return 'normal';
}
/**
 * Merge nearby text elements into logical groups
 */
function mergeNearbyTexts(texts) {
    if (texts.length === 0)
        return [];
    const sorted = sortTopLeft(texts);
    const merged = [];
    const used = new Set();
    for (const i = 0; i < sorted.length; i++) {
        if (used.has(i))
            continue;
        const group = [sorted[i]];
        used.add(i);
        // Find nearby text on the same line
        for (const j = i + 1; j < sorted.length; j++) {
            if (used.has(j))
                continue;
            const prev = group[group.length - 1];
            const curr = sorted[j];
            // Check if on the same line (similar Y position)
            const yDiff = Math.abs(prev.bbox.y - curr.bbox.y);
            const avgHeight = (prev.bbox.height + curr.bbox.height) / 2;
            if (yDiff > avgHeight * 0.5)
                continue; // Not on the same line
            // Check horizontal proximity
            const xGap = curr.bbox.x - (prev.bbox.x + prev.bbox.width);
            if (xGap > avgHeight * 3)
                continue; // Too far apart
            group.push(curr);
            used.add(j);
        }
        // Merge the group
        if (group.length === 1) {
            merged.push(group[0]);
        }
        else {
            const combinedText = group.map(t => t.text).join(' ');
            const minX = Math.min(...group.map(t => t.bbox.x));
            const minY = Math.min(...group.map(t => t.bbox.y));
            const maxX = Math.max(...group.map(t => t.bbox.x + t.bbox.width));
            const maxY = Math.max(...group.map(t => t.bbox.y + t.bbox.height));
            merged.push({
                id: `merged-${merged.length}`,
                text: combinedText,
                bbox: { x: minX, y: minY, width: maxX - minX, height: maxY - minY },
                confidence: group.reduce((sum, t) => sum + t.confidence, 0) / group.length,
                fontSize: group[0].fontSize,
                fontWeight: group[0].fontWeight,
            });
        }
    }
    return merged;
}
/**
 * Extract line-level texts from OCR result for broader context
 */
function extractLineTexts(data, startIndex) {
    const lineTexts = [];
    const idx = startIndex;
    if (data.lines) {
        for (const line of data.lines) {
            if (!line.text || line.text.trim().length === 0)
                continue;
            if (line.confidence < 25)
                continue;
            const bbox = {
                x: line.bbox.x0,
                y: line.bbox.y0,
                width: line.bbox.x1 - line.bbox.x0,
                height: line.bbox.y1 - line.bbox.y0,
            };
            lineTexts.push({
                id: `line-${idx++}`,
                text: line.text.trim(),
                bbox,
                confidence: line.confidence / 100,
                fontSize: classifyFontSize(bbox.height, 800), // Approximate image height
                fontWeight: 'normal',
            });
        }
    }
    return lineTexts;
}
/**
 * Quick text extraction for small regions (faster, less accurate)
 */
export async function quickExtract(image) {
    try {
        const result = await Tesseract.recognize(image.buffer, 'eng', {
            logger: () => { },
        });
        return result.data.text?.trim() || '';
    }
    catch {
        return '';
    }
}
//# sourceMappingURL=textExtractor.js.map