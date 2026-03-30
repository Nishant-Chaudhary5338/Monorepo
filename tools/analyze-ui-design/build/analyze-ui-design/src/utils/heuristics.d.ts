import type { BoundingBox, ComponentType, RawDetection, ColorInfo } from '../types/blueprint.types.js';
/**
 * Check if a bounding box likely represents a button based on shape
 */
export declare function isButtonShape(bbox: BoundingBox, color?: ColorInfo): boolean;
/**
 * Check if a bounding box likely represents an input field
 */
export declare function isInputShape(bbox: BoundingBox, color?: ColorInfo): boolean;
/**
 * Check if a bounding box likely represents a card/container
 */
export declare function isContainerShape(bbox: BoundingBox): boolean;
/**
 * Check if a bounding box likely represents a heading
 */
export declare function isHeadingShape(bbox: BoundingBox, imageHeight: number): boolean;
/**
 * Classify a component type based on its text content
 */
export declare function classifyByText(text: string): {
    type: ComponentType;
    confidence: number;
    reason: string;
};
/**
 * Classify based on font size category
 */
export declare function classifyByFontSize(fontSize: 'small' | 'medium' | 'large' | 'heading', text: string): ComponentType;
/**
 * Infer section type based on component positions and types
 */
export declare function inferSectionType(components: Array<{
    type: ComponentType;
    bbox: BoundingBox;
}>, imageHeight: number): 'header' | 'footer' | 'form' | 'nav' | 'content' | 'sidebar';
/**
 * Detect if a group of components forms a form pattern
 */
export declare function detectFormPattern(detections: RawDetection[]): {
    isForm: boolean;
    confidence: number;
    formComponents: string[];
};
/**
 * Detect navigation pattern (horizontal row of links/buttons)
 */
export declare function detectNavigationPattern(detections: RawDetection[]): {
    isNav: boolean;
    confidence: number;
    navComponents: string[];
};
/**
 * Detect the variant of an input based on its label
 */
export declare function detectInputVariant(label: string): string;
/**
 * Infer validation rules from label text
 */
export declare function inferValidationRules(label: string): Array<{
    type: string;
    value?: string | number;
    message?: string;
}>;
/**
 * Detect the overall screen type from all detections
 */
export declare function detectScreenType(detections: RawDetection[], formDetected: boolean, navDetected: boolean): {
    screenType: string;
    confidence: number;
};
/**
 * Infer button variant from text and color
 */
export declare function inferButtonVariant(text: string, color?: ColorInfo): string;
/**
 * Infer heading variant from font size and position
 */
export declare function inferHeadingVariant(fontSize: 'small' | 'medium' | 'large' | 'heading', yPosition: number, imageHeight: number): string;
//# sourceMappingURL=heuristics.d.ts.map