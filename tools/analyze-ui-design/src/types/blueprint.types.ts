// ============================================================================
// BOUNDING BOX & GEOMETRY
// ============================================================================

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

// ============================================================================
// PARSED INPUT
// ============================================================================

export interface ParsedImage {
  width: number;
  height: number;
  channels: number;
  buffer: Buffer;
  metadata: Record<string, unknown>;
}

export interface ParsedPage {
  pageNumber: number;
  image: ParsedImage;
}

// ============================================================================
// DETECTED BLOCKS (raw vision output)
// ============================================================================

export interface DetectedBlock {
  readonly id: string;
  bbox: BoundingBox;
  type: 'region' | 'text' | 'shape' | 'image';
  confidence: number;
  color?: ColorInfo;
}

export interface ColorInfo {
  dominant: string;       // hex color
  average: string;        // hex color
  hasBorder: boolean;
  borderColor?: string;
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full';
}

export interface ExtractedText {
  readonly id: string;
  text: string;
  bbox: BoundingBox;
  confidence: number;
  fontSize: 'small' | 'medium' | 'large' | 'heading';
  fontWeight: 'normal' | 'medium' | 'bold';
}

export interface RawDetection {
  readonly id: string;
  bbox: BoundingBox;
  inferredType: ComponentType;
  label?: string;
  text?: string;
  confidence: number;
  classificationReason: string;
  props?: Record<string, unknown>;
}

// ============================================================================
// COMPONENT TYPES
// ============================================================================

export type ComponentType =
  | 'Input'
  | 'Button'
  | 'Text'
  | 'Heading'
  | 'Container'
  | 'Image'
  | 'Link'
  | 'Checkbox'
  | 'Radio'
  | 'Select'
  | 'Textarea'
  | 'Card'
  | 'Nav'
  | 'Icon'
  | 'Divider'
  | 'Unknown';

export type InputVariant = 'text' | 'email' | 'password' | 'search' | 'number' | 'tel' | 'url';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
export type TextVariant = 'body' | 'caption' | 'label' | 'subtitle' | 'overline';
export type HeadingVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

// ============================================================================
// DETECTED COMPONENT (normalized)
// ============================================================================

export interface DetectedComponent {
  readonly id: string;
  name: ComponentType;
  variant?: string;
  props: ComponentProps;
  validation?: ValidationRule[];
  position: ComponentPosition;
  confidence: number;
  children?: string[];  // IDs of child components
  readonly parentId?: string;    // ID of parent container
}

export interface ComponentProps {
  text?: string;
  placeholder?: string;
  type?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  href?: string;
  alt?: string;
  src?: string;
  checked?: boolean;
  options?: string[];
  className?: string;
  ariaLabel?: string;
  [key: string]: unknown;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: string | number;
  message?: string;
}

export interface ComponentPosition {
  section: string;
  order: number;
  bbox: BoundingBox;
  page?: number;
}

// ============================================================================
// LAYOUT
// ============================================================================

export interface LayoutStructure {
  type: LayoutType;
  sections: LayoutSection[];
  structure: string[];  // Ordered component IDs
}

export type LayoutType = 'page' | 'form' | 'dashboard' | 'card' | 'navigation' | 'modal' | 'list' | 'unknown';

export interface LayoutSection {
  readonly id: string;
  name: string;
  type: 'header' | 'body' | 'footer' | 'sidebar' | 'form-group' | 'card-group' | 'nav' | 'content';
  componentIds: string[];
  bbox: BoundingBox;
}

// ============================================================================
// DESIGN SYSTEM HINTS
// ============================================================================

export interface DesignSystemHints {
  requiredComponents: string[];
  variantUsage: Record<string, string[]>;
  colorPalette: ColorPalette;
  typography: TypographyHints;
  spacing: SpacingHints;
}

export interface ColorPalette {
  primary?: string;
  secondary?: string;
  background?: string;
  foreground?: string;
  accent?: string;
  destructive?: string;
  muted?: string;
  border?: string;
}

export interface TypographyHints {
  headingFont?: string;
  bodyFont?: string;
  headingSizes: string[];
  bodySizes: string[];
  fontFamilies: string[];
}

export interface SpacingHints {
  consistentSpacing: boolean;
  gapPattern: 'small' | 'medium' | 'large' | 'mixed';
  paddingPattern: 'tight' | 'normal' | 'loose';
}

// ============================================================================
// TESTING HINTS
// ============================================================================

export interface TestingHints {
  snapshotCandidates: string[];    // Component IDs good for snapshot tests
  interactionTests: InteractionTest[];
  accessibilityChecks: AccessibilityCheck[];
}

export interface InteractionTest {
  readonly componentId: string;
  action: 'click' | 'type' | 'select' | 'check' | 'navigate';
  description: string;
  expectedResult: string;
}

export interface AccessibilityCheck {
  readonly componentId: string;
  check: 'aria-label' | 'alt-text' | 'contrast' | 'focus-order' | 'keyboard-nav';
  severity: 'error' | 'warning' | 'info';
  message: string;
}

// ============================================================================
// ANALYSIS OPTIONS
// ============================================================================

export interface AnalysisOptions {
  platform: 'web' | 'mobile';
  designSystem?: DesignSystemMetadata;
  maxImageWidth?: number;
  ocrLanguage?: string;
  confidenceThreshold?: number;
}

export interface DesignSystemMetadata {
  name?: string;
  componentMapping?: Record<string, string>;
  colorTokens?: Record<string, string>;
}

// ============================================================================
// COMPONENT BLUEPRINT (final output)
// ============================================================================

export interface ComponentBlueprint {
  meta: BlueprintMeta;
  components: DetectedComponent[];
  layout: LayoutStructure;
  designSystemHints: DesignSystemHints;
  testing: TestingHints;
}

export interface BlueprintMeta {
  source: 'image' | 'pdf';
  screenType: string;
  confidence: number;
  analyzedAt: string;
  platform: 'web' | 'mobile';
  pageCount: number;
  imageSize: {
    width: number;
    height: number;
  };
}

// ============================================================================
// PIPELINE INTERMEDIATE RESULTS
// ============================================================================

export interface VisionResults {
  blocks: DetectedBlock[];
  texts: ExtractedText[];
  colors: ColorInfo;
}

export interface DetectionResults {
  rawDetections: RawDetection[];
  formDetected: boolean;
  navigationDetected: boolean;
}