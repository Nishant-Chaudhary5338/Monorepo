import * as path from 'path';
import type {
  ParsedImage,
  ParsedPage,
  AnalysisOptions,
  ComponentBlueprint,
  BlueprintMeta,
  DetectedComponent,
  VisionResults,
} from './types/blueprint.types.js';
import { isImageFile, parseImage } from './parsers/imageParser.js';
import { isPdfFile, parsePdf } from './parsers/pdfParser.js';
import { detectLayout } from './vision/layoutDetector.js';
import { extractText } from './vision/textExtractor.js';
import { detectComponents } from './vision/componentDetector.js';
import { extractStyles } from './vision/styleExtractor.js';
import { buildComponents } from './builders/componentBuilder.js';
import { buildLayout } from './builders/layoutBuilder.js';
import { buildBlueprint } from './builders/blueprintBuilder.js';
import { detectFormPattern, detectNavigationPattern, detectScreenType } from './utils/heuristics.js';

const DEFAULT_OPTIONS: AnalysisOptions = {
  platform: 'web',
  maxImageWidth: 1920,
  ocrLanguage: 'eng',
  confidenceThreshold: 0.3,
};

/**
 * Main analysis pipeline: file path → Component Blueprint JSON
 */
export async function analyzeUI(
  filePath: string,
  options: Partial<AnalysisOptions> = {},
): Promise<ComponentBlueprint> {
  const opts: AnalysisOptions = { ...DEFAULT_OPTIONS, ...options };

  // Step 1: Parse input
  const pages = await parseInput(filePath, opts);

  // Step 2-4: Process each page
  const allComponents: DetectedComponent[] = [];
  let primaryMeta: BlueprintMeta | null = null;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const blueprint = await analyzeImage(page.image, filePath, i + 1, pages.length, opts);

    // Offset component IDs for multi-page
    if (pages.length > 1) {
      for (const comp of blueprint.components) {
        comp.id = `p${page.pageNumber}-${comp.id}`;
        if (comp.children) {
          comp.children = comp.children.map(c => `p${page.pageNumber}-${c}`);
        }
        if (comp.parentId) {
          comp.parentId = `p${page.pageNumber}-${comp.parentId}`;
        }
      }
      for (const section of blueprint.layout.sections) {
        section.id = `p${page.pageNumber}-${section.id}`;
        section.componentIds = section.componentIds.map(c => `p${page.pageNumber}-${c}`);
      }
    }

    allComponents.push(...blueprint.components);

    if (i === 0) {
      primaryMeta = blueprint.meta;
    }
  }

  // For multi-page, merge layouts
  if (pages.length > 1 && primaryMeta) {
    primaryMeta.pageCount = pages.length;
  }

  const finalMeta: BlueprintMeta = primaryMeta || {
    source: isPdfFile(filePath) ? 'pdf' : 'image',
    screenType: 'unknown',
    confidence: 0.5,
    analyzedAt: new Date().toISOString(),
    platform: opts.platform,
    pageCount: pages.length,
    imageSize: {
      width: pages[0]?.image.width || 0,
      height: pages[0]?.image.height || 0,
    },
  };

  // Build combined layout for all components
  const primaryImage = pages[0]?.image;
  if (!primaryImage) {
    throw new Error('No image data available for analysis');
  }

  const { layout } = buildLayout(allComponents, primaryImage.width, primaryImage.height);

  // Extract styles from the primary image
  const styles = await extractStyles(primaryImage);

  // Build final blueprint
  const blueprint = buildBlueprint(
    finalMeta,
    allComponents,
    layout,
    styles.palette,
    styles.typography,
    styles.spacing,
    opts,
  );

  return blueprint;
}

/**
 * Parse input file into images
 */
async function parseInput(filePath: string, options: AnalysisOptions): Promise<ParsedPage[]> {
  if (isPdfFile(filePath)) {
    return parsePdf(filePath, options.maxImageWidth);
  }

  if (isImageFile(filePath)) {
    const image = await parseImage(filePath, options.maxImageWidth);
    return [{ pageNumber: 1, image }];
  }

  throw new Error(
    `Unsupported file format: ${path.extname(filePath)}. Supported: .png, .jpg, .jpeg, .webp, .gif, .bmp, .tiff, .pdf`,
  );
}

/**
 * Analyze a single image through the full vision pipeline
 */
async function analyzeImage(
  image: ParsedImage,
  sourcePath: string,
  pageNumber: number,
  totalPages: number,
  options: AnalysisOptions,
): Promise<ComponentBlueprint> {
  // Step 2: Extract raw data (in parallel)
  const [blocks, texts, styles] = await Promise.all([
    detectLayout(image),
    extractText(image),
    extractStyles(image),
  ]);

  // Step 3: Detect components from raw data
  const rawDetections = detectComponents(blocks, texts, image.width, image.height);

  // Filter by confidence threshold
  const threshold = options.confidenceThreshold ?? 0.3;
  const filteredDetections = rawDetections.filter(d => d.confidence >= threshold);

  // Detect patterns
  const formResult = detectFormPattern(filteredDetections);
  const navResult = detectNavigationPattern(filteredDetections);
  const screenResult = detectScreenType(filteredDetections, formResult.isForm, navResult.isNav);

  // Step 4: Build structured data
  const tempComponents = filteredDetections.map((d, i) => ({
    id: d.id,
    name: d.inferredType,
    variant: undefined,
    props: {},
    position: {
      section: 'temp',
      order: i,
      bbox: d.bbox,
      page: pageNumber,
    },
    confidence: d.confidence,
  }));

  const { layout, sectionMap } = buildLayout(tempComponents, image.width, image.height);

  // Build normalized components with section info
  const components = buildComponents(
    filteredDetections,
    texts,
    image.height,
    sectionMap,
    pageNumber,
  );

  // Step 5: Build final blueprint
  const source: 'image' | 'pdf' = isPdfFile(sourcePath) ? 'pdf' : 'image';

  const meta: BlueprintMeta = {
    source,
    screenType: screenResult.screenType,
    confidence: screenResult.confidence,
    analyzedAt: new Date().toISOString(),
    platform: options.platform,
    pageCount: totalPages,
    imageSize: {
      width: image.width,
      height: image.height,
    },
  };

  return buildBlueprint(
    meta,
    components,
    layout,
    styles.palette,
    styles.typography,
    styles.spacing,
    options,
  );
}