import { mergeBboxes } from '../utils/bbox.js';
/**
 * Sort components by position (top-left to bottom-right)
 */
function sortByPosition(components) {
    return [...components].sort((a, b) => {
        const aBbox = a.position.bbox;
        const bBbox = b.position.bbox;
        if (Math.abs(aBbox.y - bBbox.y) < 15)
            return aBbox.x - bBbox.x;
        return aBbox.y - bBbox.y;
    });
}
/**
 * Group components by row (similar Y position)
 */
function groupByRow(components, tolerance = 20) {
    if (components.length === 0)
        return [];
    const sorted = [...components].sort((a, b) => a.position.bbox.y - b.position.bbox.y);
    const groups = [];
    let currentGroup = [sorted[0]];
    let currentY = sorted[0].position.bbox.y;
    for (let i = 1; i < sorted.length; i++) {
        if (Math.abs(sorted[i].position.bbox.y - currentY) <= tolerance) {
            currentGroup.push(sorted[i]);
        }
        else {
            groups.push(currentGroup);
            currentGroup = [sorted[i]];
            currentY = sorted[i].position.bbox.y;
        }
    }
    groups.push(currentGroup);
    return groups;
}
/**
 * Check if components form a vertical stack
 */
function isVerticalStack(components) {
    if (components.length < 2)
        return false;
    const sorted = [...components].sort((a, b) => a.position.bbox.y - b.position.bbox.y);
    let alignedCount = 0;
    const firstCenterX = sorted[0].position.bbox.x + sorted[0].position.bbox.width / 2;
    const maxDeviation = Math.max(...components.map(c => c.position.bbox.width)) * 0.3;
    for (let i = 1; i < sorted.length; i++) {
        const centerX = sorted[i].position.bbox.x + sorted[i].position.bbox.width / 2;
        if (Math.abs(centerX - firstCenterX) <= maxDeviation)
            alignedCount++;
    }
    return alignedCount >= sorted.length * 0.6;
}
/**
 * Build the layout structure from detected components
 */
export function buildLayout(components, imageWidth, imageHeight) {
    const sectionMap = new Map();
    // 1. Detect layout type
    const layoutType = detectLayoutType(components, imageHeight);
    // 2. Group components into sections
    const sections = buildSections(components, imageWidth, imageHeight);
    // 3. Map component IDs to section IDs
    for (const section of sections) {
        for (const compId of section.componentIds) {
            sectionMap.set(compId, section.id);
        }
    }
    // 4. Build ordered structure array
    const structure = sortByPosition(components).map(c => c.id);
    // 5. Update component section assignments
    for (const component of components) {
        const sectionId = sectionMap.get(component.id);
        if (sectionId) {
            component.position.section = sectionId;
        }
    }
    return {
        layout: {
            type: layoutType,
            sections,
            structure,
        },
        sectionMap,
    };
}
/**
 * Detect the overall layout type
 */
function detectLayoutType(components, imageHeight) {
    if (components.length === 0)
        return 'unknown';
    const types = components.map(c => c.name);
    // Form: multiple inputs + button
    const inputs = types.filter(t => t === 'Input').length;
    const buttons = types.filter(t => t === 'Button').length;
    if (inputs >= 2 && buttons >= 1)
        return 'form';
    // Navigation: multiple links/buttons in a row
    const links = types.filter(t => t === 'Link').length;
    if (links >= 3)
        return 'navigation';
    // Dashboard: containers + various elements
    const containers = types.filter(t => t === 'Container').length;
    if (containers >= 2 && components.length > 5)
        return 'dashboard';
    // Card: single container with children
    if (containers === 1 && components.length <= 5)
        return 'card';
    // List: multiple similar items in vertical stack
    const nonContainerComponents = components.filter(c => c.name !== 'Container');
    if (nonContainerComponents.length >= 3 && isVerticalStack(nonContainerComponents))
        return 'list';
    return 'page';
}
/**
 * Build layout sections from components
 */
function buildSections(components, imageWidth, imageHeight) {
    const sections = [];
    const assigned = new Set();
    // 1. Detect header (components in top 15% of image)
    const headerComponents = components.filter(c => c.position.bbox.y + c.position.bbox.height < imageHeight * 0.15);
    if (headerComponents.length > 0) {
        sections.push(createSection('header', 'Header', 'header', headerComponents));
        headerComponents.forEach(c => assigned.add(c.id));
    }
    // 2. Detect footer (components in bottom 10% of image)
    const footerComponents = components.filter(c => c.position.bbox.y > imageHeight * 0.9);
    if (footerComponents.length > 0) {
        sections.push(createSection('footer', 'Footer', 'footer', footerComponents));
        footerComponents.forEach(c => assigned.add(c.id));
    }
    // 3. Detect navigation (horizontal groups of links/buttons)
    const navCandidates = components.filter(c => !assigned.has(c.id) && (c.name === 'Link' || c.name === 'Button' || c.name === 'Nav'));
    const navGroups = groupByRow(navCandidates, 15);
    for (const group of navGroups) {
        if (group.length >= 3) {
            sections.push(createSection(`nav-${sections.length}`, 'Navigation', 'nav', group));
            group.forEach(c => assigned.add(c.id));
        }
    }
    // 4. Detect form groups (vertical stacks of inputs)
    const unassignedComponents = components.filter(c => !assigned.has(c.id));
    const inputs = unassignedComponents.filter(c => c.name === 'Input');
    const buttons = unassignedComponents.filter(c => c.name === 'Button');
    if (inputs.length >= 2) {
        const maxY = Math.max(...inputs.map(i => i.position.bbox.y));
        const formComponents = [
            ...inputs,
            ...buttons.filter(b => b.position.bbox.y > maxY),
        ];
        if (formComponents.length >= 2) {
            sections.push(createSection('form-group', 'Form', 'form-group', formComponents));
            formComponents.forEach(c => assigned.add(c.id));
        }
    }
    // 5. Detect card groups
    const containers = unassignedComponents.filter(c => !assigned.has(c.id) && c.name === 'Container');
    if (containers.length >= 2) {
        sections.push(createSection('card-group', 'Cards', 'card-group', containers));
        containers.forEach(c => assigned.add(c.id));
    }
    // 6. Group remaining components into content sections
    const remaining = components.filter(c => !assigned.has(c.id));
    if (remaining.length > 0) {
        const rows = groupByRow(remaining, 30);
        for (let i = 0; i < rows.length; i++) {
            sections.push(createSection(`content-${i}`, 'Content', 'content', rows[i]));
            rows[i].forEach(c => assigned.add(c.id));
        }
    }
    // Sort sections by vertical position
    sections.sort((a, b) => a.bbox.y - b.bbox.y);
    return sections;
}
/**
 * Create a layout section from a group of components
 */
function createSection(id, name, type, components) {
    const bboxes = components.map(c => c.position.bbox);
    const mergedBbox = bboxes.reduce((acc, bbox) => mergeBboxes(acc, bbox));
    return {
        id,
        name,
        type,
        componentIds: components.map(c => c.id),
        bbox: mergedBbox,
    };
}
//# sourceMappingURL=layoutBuilder.js.map