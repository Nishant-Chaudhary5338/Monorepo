import { classifyByText, isButtonShape, isInputShape, detectInputVariant, } from '../utils/heuristics.js';
import { sortTopLeft, aspectRatio, bboxArea } from '../utils/bbox.js';
/**
 * Detect and classify UI components from layout blocks and text
 */
export function detectComponents(blocks, texts, imageWidth, imageHeight) {
    const detections = [];
    const detectionIndex = 0;
    // 1. Classify text elements
    for (const text of texts) {
        const classified = classifyByText(text.text);
        const detection = createDetection(`detection-${detectionIndex++}`, text.bbox, classified.type, text.text, classified.confidence, classified.reason, text.fontSize === 'heading' || classified.type === 'Heading', imageHeight);
        if (detection)
            detections.push(detection);
    }
    // 2. Detect shape-based components from blocks
    for (const block of blocks) {
        if (block.type === 'shape') {
            const shapeType = classifyByShape(block.bbox, block.color, imageHeight);
            if (shapeType) {
                const detection = createDetection(`detection-${detectionIndex++}`, block.bbox, shapeType.type, undefined, shapeType.confidence, shapeType.reason, false, imageHeight, block.color);
                if (detection)
                    detections.push(detection);
            }
        }
        // Detect input fields from text-like blocks
        if (block.type === 'text' && isInputShape(block.bbox, block.color)) {
            // Look for nearby text that could be a label
            const nearbyText = findNearbyText(block.bbox, texts, 'above');
            const label = nearbyText?.text || '';
            const detection = createDetection(`detection-${detectionIndex++}`, block.bbox, 'Input', label, 0.7, `Shape matches input field pattern, label: "${label}"`, false, imageHeight, block.color);
            if (detection) {
                detection.props = detection.props || {};
                detection.props.variant = detectInputVariant(label);
                detections.push(detection);
            }
        }
    }
    // 3. Associate labels with inputs (text above/near an input shape)
    associateLabels(detections, texts);
    // 4. Detect containers/cards from large regions
    const containers = detectContainers(blocks, imageWidth, imageHeight);
    detections.push(...containers);
    // 5. Post-process: deduplicate overlapping detections
    const deduplicated = deduplicateDetections(detections);
    // 6. Sort by position
    return sortTopLeft(deduplicated);
}
/**
 * Create a detection from analyzed data
 */
function createDetection(id, bbox, type, text, confidence, reason, isHeading, imageHeight, color) {
    // Skip tiny detections
    if (bbox.width < 10 || bbox.height < 8)
        return null;
    // Skip impossibly large detections (full image)
    if (bboxArea(bbox) > 500000)
        return null;
    // Refine heading classification
    if (isHeading && type === 'Text') {
        type = 'Heading';
    }
    return {
        id,
        bbox,
        inferredType: type,
        text,
        confidence,
        classificationReason: reason,
    };
}
/**
 * Classify a shape block into a component type
 */
function classifyByShape(bbox, color, imageHeight) {
    const ratio = aspectRatio(bbox);
    const area = bboxArea(bbox);
    // Button-like: wide, moderate height
    if (isButtonShape(bbox, color)) {
        return {
            type: 'Button',
            confidence: 0.7,
            reason: `Shape: ${Math.round(bbox.width)}x${Math.round(bbox.height)}, ratio ${ratio.toFixed(1)}`,
        };
    }
    // Input-like: wide, short
    if (isInputShape(bbox, color)) {
        return {
            type: 'Input',
            confidence: 0.65,
            reason: `Shape matches input field dimensions`,
        };
    }
    // Large container/card
    if (area > 30000 && ratio > 0.5 && ratio < 3) {
        return {
            type: 'Container',
            confidence: 0.5,
            reason: `Large region: ${Math.round(bbox.width)}x${Math.round(bbox.height)}`,
        };
    }
    // Image-like: square-ish, moderate size
    if (ratio > 0.6 && ratio < 1.5 && bbox.width > 40 && bbox.width < 300) {
        return {
            type: 'Image',
            confidence: 0.4,
            reason: `Square-ish shape, likely image/icon`,
        };
    }
    // Divider: very thin and wide
    if (bbox.height < 10 && bbox.width > 100) {
        return {
            type: 'Divider',
            confidence: 0.6,
            reason: `Thin horizontal line`,
        };
    }
    return null;
}
/**
 * Find text near a bounding box (above, below, left, right)
 */
function findNearbyText(bbox, texts, direction) {
    const maxDistance = 60;
    let bestMatch = null;
    let bestDistance = Infinity;
    for (const text of texts) {
        let distance;
        const center = {
            x: bbox.x + bbox.width / 2,
            y: bbox.y + bbox.height / 2,
        };
        const textCenter = {
            x: text.bbox.x + text.bbox.width / 2,
            y: text.bbox.y + text.bbox.height / 2,
        };
        switch (direction) {
            case 'above':
                if (text.bbox.y >= bbox.y)
                    continue;
                distance = Math.abs(textCenter.x - center.x) + (bbox.y - text.bbox.y - text.bbox.height);
                break;
            case 'below':
                if (text.bbox.y <= bbox.y)
                    continue;
                distance = Math.abs(textCenter.x - center.x) + (text.bbox.y - bbox.y - bbox.height);
                break;
            case 'left':
                if (text.bbox.x >= bbox.x)
                    continue;
                distance = Math.abs(textCenter.y - center.y) + (bbox.x - text.bbox.x - text.bbox.width);
                break;
            case 'right':
                if (text.bbox.x <= bbox.x)
                    continue;
                distance = Math.abs(textCenter.y - center.y) + (text.bbox.x - bbox.x - bbox.width);
                break;
        }
        if (distance < maxDistance && distance < bestDistance) {
            bestDistance = distance;
            bestMatch = text;
        }
    }
    return bestMatch;
}
/**
 * Associate text labels with input fields
 */
function associateLabels(detections, texts) {
    const inputDetections = detections.filter(d => d.inferredType === 'Input');
    for (const input of inputDetections) {
        // Look for label text above the input
        const labelAbove = findNearbyText(input.bbox, texts, 'above');
        if (labelAbove && labelAbove.text.length < 50) {
            input.label = labelAbove.text;
            input.props = input.props || {};
            input.props.label = labelAbove.text;
            input.props.variant = detectInputVariant(labelAbove.text);
            input.classificationReason += `; label: "${labelAbove.text}"`;
        }
    }
}
/**
 * Detect container/card components from large layout blocks
 */
function detectContainers(blocks, imageWidth, imageHeight) {
    const containers = [];
    const containerIndex = 0;
    for (const block of blocks) {
        if (block.type !== 'region')
            continue;
        const area = bboxArea(block.bbox);
        const ratio = aspectRatio(block.bbox);
        // Large enough to be a container, but not the full image
        if (area > 20000 && area < imageWidth * imageHeight * 0.8) {
            // Check if it looks like a card
            const isCard = ratio > 0.5 && ratio < 3 && block.bbox.width > 100 && block.bbox.height > 80;
            containers.push({
                id: `container-${containerIndex++}`,
                bbox: block.bbox,
                inferredType: 'Container',
                confidence: isCard ? 0.6 : 0.4,
                classificationReason: `Large region, likely ${isCard ? 'card' : 'container'}`,
            });
        }
    }
    return containers;
}
/**
 * Remove duplicate/overlapping detections
 */
function deduplicateDetections(detections) {
    if (detections.length <= 1)
        return detections;
    const result = [];
    const used = new Set();
    for (const i = 0; i < detections.length; i++) {
        if (used.has(i))
            continue;
        let best = detections[i];
        for (const j = i + 1; j < detections.length; j++) {
            if (used.has(j))
                continue;
            const overlap = calculateOverlapRatio(detections[i].bbox, detections[j].bbox);
            if (overlap > 0.7) {
                // High overlap - keep the one with higher confidence
                if (detections[j].confidence > best.confidence) {
                    best = detections[j];
                }
                used.add(j);
            }
        }
        result.push(best);
    }
    return result;
}
/**
 * Calculate overlap ratio between two bboxes (0-1)
 */
function calculateOverlapRatio(a, b) {
    const xOverlap = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
    const yOverlap = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
    const overlapArea = xOverlap * yOverlap;
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    const smallerArea = Math.min(areaA, areaB);
    return smallerArea === 0 ? 0 : overlapArea / smallerArea;
}
//# sourceMappingURL=componentDetector.js.map