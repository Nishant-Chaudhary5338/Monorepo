import type {
  BoundingBox,
  ComponentType,
  ExtractedText,
  DetectedBlock,
  RawDetection,
  ColorInfo,
} from '../types/blueprint.types.js';
import { bboxArea, aspectRatio, bboxCenter, isInside, overlaps, sortTopLeft } from './bbox.js';
import { groupByRow, isVerticalStack, groupByProximity } from './grouping.js';

// ============================================================================
// TEXT PATTERN MATCHING
// ============================================================================

const INPUT_LABEL_PATTERNS = [
  /^(email|e-mail)$/i,
  /^(password|pwd|pass)$/i,
  /^(username|user\s*name|user)$/i,
  /^(name|full\s*name|first\s*name|last\s*name)$/i,
  /^(phone|mobile|tel|telephone|cell)$/i,
  /^(address|street|city|state|zip|postal)$/i,
  /^(search)$/i,
  /^(confirm|verify)$/i,
  /^(enter|type|input)\s/i,
  /^(amount|price|cost|total)$/i,
  /^(date|time|dob|birth)$/i,
  /^(website|url|link)$/i,
  /^(company|organization|org)$/i,
];

const BUTTON_PATTERNS = [
  /^(submit|send|save|create|add|update|edit|delete|remove)$/i,
  /^(login|log\s*in|sign\s*in|sign\s*up|register|signup)$/i,
  /^(cancel|close|back|return|dismiss)$/i,
  /^(next|previous|prev|continue|proceed|finish|done)$/i,
  /^(confirm|accept|agree|approve|yes|ok|okay)$/i,
  /^(download|upload|export|import|browse|choose|select)$/i,
  /^(buy|purchase|pay|checkout|order|subscribe)$/i,
  /^(search|find|go|start|begin|try|demo)$/i,
  /^(reset|clear|refresh|reload|retry)$/i,
  /^(learn\s*more|read\s*more|view|see|show|details|info)$/i,
];

const LINK_PATTERNS = [
  /^(forgot|reset)\s/i,
  /^(don't\s*have|already\s*have|need\s*an?)\s/i,
  /^(click|tap|press)\s/i,
  /^(terms|privacy|policy|help|support|faq|about|contact)$/i,
  /^(sign\s*up|register|create\s*account)$/i,
  /^(https?:\/\/|www\.)/i,
];

const HEADING_PATTERNS = [
  /^(welcome|hello|hi|hey)/i,
  /^(sign\s*in|log\s*in|log\s*up|register|create\s*account)/i,
  /^(dashboard|home|profile|settings|account)/i,
  /^(step\s*\d|phase\s*\d)/i,
  /^(error|warning|success|notice|alert|info)/i,
];

const CHECKBOX_LABELS = [
  /^(remember\s*me|stay\s*signed\s*in|keep\s*me\s*logged)/i,
  /^(i\s*agree|accept|terms|conditions|newsletter|subscribe)/i,
  /^(notify|notification|email\s*me)/i,
];

// ============================================================================
// SHAPE-BASED CLASSIFICATION
// ============================================================================

/**
 * Check if a bounding box likely represents a button based on shape
 */
export function isButtonShape(bbox: BoundingBox, color?: ColorInfo): boolean {
  const ratio = aspectRatio(bbox);

  // Buttons are typically wider than tall, but not extremely so
  if (ratio < 1.5 || ratio > 12) return false;

  // Buttons have a reasonable size
  if (bbox.height < 20 || bbox.height > 80) return false;
  if (bbox.width < 50 || bbox.width > 500) return false;

  // Buttons often have rounded corners or colored backgrounds
  if (color) {
    if (color.borderRadius && color.borderRadius !== 'none') return true;
    if (color.hasBorder) return true;
  }

  return true;
}

/**
 * Check if a bounding box likely represents an input field
 */
export function isInputShape(bbox: BoundingBox, color?: ColorInfo): boolean {
  const ratio = aspectRatio(bbox);

  // Inputs are typically wide and not very tall
  if (ratio < 2) return false;
  if (bbox.height < 25 || bbox.height > 70) return false;
  if (bbox.width < 100) return false;

  // Inputs often have borders
  if (color?.hasBorder) return true;

  return true;
}

/**
 * Check if a bounding box likely represents a card/container
 */
export function isContainerShape(bbox: BoundingBox): boolean {
  const area = bboxArea(bbox);

  // Containers are large
  if (area < 10000) return false;

  // Containers have reasonable aspect ratios
  const ratio = aspectRatio(bbox);
  if (ratio < 0.3 || ratio > 5) return false;

  return true;
}

/**
 * Check if a bounding box likely represents a heading
 */
export function isHeadingShape(bbox: BoundingBox, imageHeight: number): boolean {
  // Headings are typically in the upper portion of the screen
  if (bbox.y > imageHeight * 0.5) return false;

  return true;
}

// ============================================================================
// TEXT-BASED CLASSIFICATION
// ============================================================================

/**
 * Classify a component type based on its text content
 */
export function classifyByText(text: string): { type: ComponentType; confidence: number; reason: string } {
  const trimmed = text.trim();

  // Check button patterns first
  for (const pattern of BUTTON_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { type: 'Button', confidence: 0.9, reason: `Text "${trimmed}" matches button pattern` };
    }
  }

  // Check input label patterns
  for (const pattern of INPUT_LABEL_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { type: 'Input', confidence: 0.85, reason: `Text "${trimmed}" matches input label pattern` };
    }
  }

  // Check checkbox patterns
  for (const pattern of CHECKBOX_LABELS) {
    if (pattern.test(trimmed)) {
      return { type: 'Checkbox', confidence: 0.85, reason: `Text "${trimmed}" matches checkbox pattern` };
    }
  }

  // Check link patterns
  for (const pattern of LINK_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { type: 'Link', confidence: 0.8, reason: `Text "${trimmed}" matches link pattern` };
    }
  }

  // Check heading patterns
  for (const pattern of HEADING_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { type: 'Heading', confidence: 0.8, reason: `Text "${trimmed}" matches heading pattern` };
    }
  }

  return { type: 'Text', confidence: 0.5, reason: 'No specific pattern matched' };
}

/**
 * Classify based on font size category
 */
export function classifyByFontSize(
  fontSize: 'small' | 'medium' | 'large' | 'heading',
  text: string,
): ComponentType {
  if (fontSize === 'heading') return 'Heading';
  if (fontSize === 'large') {
    const classified = classifyByText(text);
    if (classified.type === 'Heading') return 'Heading';
  }
  return 'Text';
}

// ============================================================================
// POSITION-BASED CLASSIFICATION
// ============================================================================

/**
 * Infer section type based on component positions and types
 */
export function inferSectionType(
  components: Array<{ type: ComponentType; bbox: BoundingBox }>,
  imageHeight: number,
): 'header' | 'footer' | 'form' | 'nav' | 'content' | 'sidebar' {
  if (components.length === 0) return 'content';

  const avgY = components.reduce((sum, c) => sum + c.bbox.y, 0) / components.length;
  const maxY = Math.max(...components.map(c => c.bbox.y + c.bbox.height));

  // Header: components in the top 15% of the screen
  if (avgY < imageHeight * 0.15) return 'header';

  // Footer: components in the bottom 15% of the screen
  if (maxY > imageHeight * 0.85) return 'footer';

  // Check for form pattern
  const inputs = components.filter(c => c.type === 'Input');
  const buttons = components.filter(c => c.type === 'Button');
  if (inputs.length >= 2 && buttons.length >= 1) return 'form';

  // Check for navigation
  const links = components.filter(c => c.type === 'Link' || c.type === 'Nav');
  if (links.length >= 3) return 'nav';

  return 'content';
}

// ============================================================================
// FORM DETECTION
// ============================================================================

/**
 * Detect if a group of components forms a form pattern
 */
export function detectFormPattern(
  detections: RawDetection[],
): { isForm: boolean; confidence: number; formComponents: string[] } {
  const inputs = detections.filter(d => d.inferredType === 'Input');
  const buttons = detections.filter(d => d.inferredType === 'Button');

  if (inputs.length < 2) {
    return { isForm: false, confidence: 0, formComponents: [] };
  }

  // Check if inputs are vertically stacked
  const inputBboxes = inputs.map(i => ({ id: i.id, bbox: i.bbox }));
  const verticallyStacked = isVerticalStack(inputBboxes);

  // Check if there's a button below the inputs
  const sortedInputs = [...inputs].sort((a, b) => a.bbox.y - b.bbox.y);
  const lastInput = sortedInputs[sortedInputs.length - 1];
  const hasButtonBelow = buttons.some(b => b.bbox.y > lastInput.bbox.y);

  const confidence = 0;
  if (verticallyStacked) confidence += 0.4;
  if (hasButtonBelow) confidence += 0.3;
  if (inputs.length >= 3) confidence += 0.2;
  if (inputs.length >= 2) confidence += 0.1;

  const formComponents = [...inputs.map(i => i.id), ...buttons.map(b => b.id)];

  return { isForm: confidence >= 0.5, confidence, formComponents };
}

/**
 * Detect navigation pattern (horizontal row of links/buttons)
 */
export function detectNavigationPattern(
  detections: RawDetection[],
): { isNav: boolean; confidence: number; navComponents: string[] } {
  const navCandidates = detections.filter(
    d => d.inferredType === 'Link' || d.inferredType === 'Button' || d.inferredType === 'Nav',
  );

  if (navCandidates.length < 2) {
    return { isNav: false, confidence: 0, navComponents: [] };
  }

  // Check horizontal alignment
  const rows = groupByRow(navCandidates, 15);
  const largestRow = rows.reduce((max, row) => (row.length > max.length ? row : max), rows[0]);

  if (largestRow.length >= 3) {
    return {
      isNav: true,
      confidence: Math.min(0.9, 0.5 + largestRow.length * 0.1),
      navComponents: largestRow.map(c => c.id),
    };
  }

  return { isNav: false, confidence: 0, navComponents: [] };
}

// ============================================================================
// INPUT VARIANT DETECTION
// ============================================================================

/**
 * Detect the variant of an input based on its label
 */
export function detectInputVariant(label: string): string {
  const lower = label.toLowerCase();

  if (/email|e-mail/.test(lower)) return 'email';
  if (/password|pwd|pass/.test(lower)) return 'password';
  if (/search/.test(lower)) return 'search';
  if (/phone|tel|mobile/.test(lower)) return 'tel';
  if (/url|website|link/.test(lower)) return 'url';
  if (/amount|price|number|qty|quantity/.test(lower)) return 'number';
  if (/date|dob|birth/.test(lower)) return 'text';

  return 'text';
}

// ============================================================================
// VALIDATION RULE DETECTION
// ============================================================================

/**
 * Infer validation rules from label text
 */
export function inferValidationRules(label: string): Array<{ type: string; value?: string | number; message?: string }> {
  const rules: Array<{ type: string; value?: string | number; message?: string }> = [];
  const lower = label.toLowerCase();

  // Required fields
  if (/email|password|username|name|phone|address/.test(lower)) {
    rules.push({ type: 'required', message: `${label} is required` });
  }

  // Email validation
  if (/email/.test(lower)) {
    rules.push({ type: 'email', message: 'Please enter a valid email address' });
  }

  // Password minimum length
  if (/password/.test(lower)) {
    rules.push({ type: 'minLength', value: 8, message: 'Password must be at least 8 characters' });
  }

  // Phone pattern
  if (/phone|tel|mobile/.test(lower)) {
    rules.push({ type: 'pattern', value: '^[0-9+\\-\\s()]+$', message: 'Please enter a valid phone number' });
  }

  return rules;
}

// ============================================================================
// SCREEN TYPE DETECTION
// ============================================================================

/**
 * Detect the overall screen type from all detections
 */
export function detectScreenType(
  detections: RawDetection[],
  formDetected: boolean,
  navDetected: boolean,
): { screenType: string; confidence: number } {
  const types = detections.map(d => d.inferredType);
  const texts = detections.map(d => d.text?.toLowerCase() || '').join(' ');

  // Login screen
  if (/login|sign\s*in|log\s*in/.test(texts) && formDetected) {
    return { screenType: 'login', confidence: 0.9 };
  }

  // Registration screen
  if (/register|sign\s*up|create\s*account|join/.test(texts) && formDetected) {
    return { screenType: 'registration', confidence: 0.85 };
  }

  // Dashboard
  if (/dashboard|overview|analytics|metrics|stats/.test(texts)) {
    return { screenType: 'dashboard', confidence: 0.8 };
  }

  // Settings
  if (/settings|preferences|configuration|account/.test(texts)) {
    return { screenType: 'settings', confidence: 0.75 };
  }

  // Profile
  if (/profile|user|avatar|account/.test(texts)) {
    return { screenType: 'profile', confidence: 0.7 };
  }

  // Form (generic)
  if (formDetected) {
    return { screenType: 'form', confidence: 0.7 };
  }

  // Navigation-heavy page
  if (navDetected) {
    return { screenType: 'navigation', confidence: 0.6 };
  }

  // Content page
  const headings = types.filter(t => t === 'Heading').length;
  const paragraphs = types.filter(t => t === 'Text').length;
  if (headings > 0 && paragraphs > 2) {
    return { screenType: 'content', confidence: 0.6 };
  }

  return { screenType: 'unknown', confidence: 0.3 };
}

// ============================================================================
// VARIANT INFERENCE
// ============================================================================

/**
 * Infer button variant from text and color
 */
export function inferButtonVariant(text: string, color?: ColorInfo): string {
  const lower = text.toLowerCase();

  if (/cancel|close|back|dismiss/.test(lower)) return 'outline';
  if (/delete|remove|destroy/.test(lower)) return 'destructive';
  if (/learn\s*more|read\s*more|view|see/.test(lower)) return 'link';
  if (/forgot|reset/.test(lower)) return 'ghost';
  if (color?.borderRadius === 'full') return 'secondary';

  return 'primary';
}

/**
 * Infer heading variant from font size and position
 */
export function inferHeadingVariant(
  fontSize: 'small' | 'medium' | 'large' | 'heading',
  yPosition: number,
  imageHeight: number,
): string {
  const relativeY = yPosition / imageHeight;

  if (fontSize === 'heading' && relativeY < 0.1) return 'h1';
  if (fontSize === 'heading') return 'h2';
  if (fontSize === 'large' && relativeY < 0.2) return 'h2';
  if (fontSize === 'large') return 'h3';

  return 'h4';
}