import { detectInputVariant, inferValidationRules, inferButtonVariant, inferHeadingVariant, } from '../utils/heuristics.js';
import { sortTopLeft } from '../utils/bbox.js';
/**
 * Convert raw detections into normalized, structured components
 */
export function buildComponents(rawDetections, texts, imageHeight, sectionMap, pageNumber = 1) {
    const components = [];
    const sorted = sortTopLeft(rawDetections);
    for (let i = 0; i < sorted.length; i++) {
        const raw = sorted[i];
        const component = normalizeDetection(raw, i, texts, imageHeight, sectionMap, pageNumber);
        if (component) {
            components.push(component);
        }
    }
    // Assign parent-child relationships
    assignHierarchy(components);
    return components;
}
/**
 * Normalize a raw detection into a DetectedComponent
 */
function normalizeDetection(raw, order, texts, imageHeight, sectionMap, pageNumber) {
    const section = sectionMap.get(raw.id) || 'body';
    const position = {
        section,
        order,
        bbox: raw.bbox,
        page: pageNumber,
    };
    const props = {};
    // Copy text/label from raw detection
    if (raw.text)
        props.text = raw.text;
    if (raw.label)
        props.label = raw.label;
    let variant;
    let validation;
    switch (raw.inferredType) {
        case 'Input': {
            const label = raw.label || raw.text || '';
            variant = detectInputVariant(label);
            props.type = variant;
            props.placeholder = generatePlaceholder(label);
            props.label = label;
            const rawRules = inferValidationRules(label);
            validation = rawRules.map(r => ({
                type: r.type,
                value: r.value,
                message: r.message,
            }));
            break;
        }
        case 'Button': {
            const text = raw.text || '';
            variant = inferButtonVariant(text);
            props.text = text;
            props.ariaLabel = text;
            break;
        }
        case 'Heading': {
            const text = raw.text || '';
            variant = inferHeadingVariant(raw.props?.fontSize || 'large', raw.bbox.y, imageHeight);
            props.text = text;
            props.ariaLabel = text;
            break;
        }
        case 'Text': {
            const text = raw.text || '';
            props.text = text;
            if (raw.props?.fontSize === 'small') {
                variant = 'caption';
            }
            else {
                variant = 'body';
            }
            break;
        }
        case 'Link': {
            const text = raw.text || '';
            props.text = text;
            props.href = '#';
            props.ariaLabel = text;
            break;
        }
        case 'Checkbox': {
            const text = raw.text || '';
            props.text = text;
            props.label = text;
            props.checked = false;
            break;
        }
        case 'Image': {
            props.alt = raw.text || 'Image';
            break;
        }
        case 'Container': {
            // No special props needed
            break;
        }
        case 'Divider': {
            // No special props needed
            break;
        }
        default:
            if (raw.text)
                props.text = raw.text;
    }
    return {
        id: raw.id,
        name: raw.inferredType,
        variant,
        props,
        validation,
        position,
        confidence: raw.confidence,
    };
}
/**
 * Generate a placeholder text for an input based on its label
 */
function generatePlaceholder(label) {
    const lower = label.toLowerCase();
    if (/email/.test(lower))
        return 'Enter your email';
    if (/password/.test(lower))
        return 'Enter your password';
    if (/username/.test(lower))
        return 'Enter your username';
    if (/name/.test(lower))
        return 'Enter your name';
    if (/phone/.test(lower))
        return 'Enter your phone number';
    if (/search/.test(lower))
        return 'Search...';
    if (/address/.test(lower))
        return 'Enter your address';
    return `Enter ${label.toLowerCase()}`;
}
/**
 * Assign parent-child relationships based on spatial containment
 */
function assignHierarchy(components) {
    // Sort by area (largest first) so containers come before children
    const sorted = [...components].sort((a, b) => {
        const areaA = a.position.bbox.width * a.position.bbox.height;
        const areaB = b.position.bbox.width * b.position.bbox.height;
        return areaB - areaA;
    });
    for (let i = 0; i < sorted.length; i++) {
        const container = sorted[i];
        if (container.name !== 'Container')
            continue;
        for (let j = 0; j < components.length; j++) {
            const child = components[j];
            if (child.id === container.id)
                continue;
            if (child.parentId)
                continue; // Already assigned
            // Check if child is inside container
            const cBox = container.position.bbox;
            const chBox = child.position.bbox;
            const isInside = chBox.x >= cBox.x &&
                chBox.y >= cBox.y &&
                chBox.x + chBox.width <= cBox.x + cBox.width &&
                chBox.y + chBox.height <= cBox.y + cBox.height;
            if (isInside) {
                child.parentId = container.id;
                if (!container.children)
                    container.children = [];
                container.children.push(child.id);
            }
        }
    }
}
//# sourceMappingURL=componentBuilder.js.map