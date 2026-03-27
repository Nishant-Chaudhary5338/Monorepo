import type {
  DetectedComponent,
  LayoutStructure,
  DesignSystemHints,
  TestingHints,
  ComponentBlueprint,
  BlueprintMeta,
  ColorPalette,
  TypographyHints,
  SpacingHints,
  InteractionTest,
  AccessibilityCheck,
  AnalysisOptions,
} from '../types/blueprint.types.js';

/**
 * Build the final Component Blueprint from all intermediate results
 */
export function buildBlueprint(
  meta: BlueprintMeta,
  components: DetectedComponent[],
  layout: LayoutStructure,
  palette: ColorPalette,
  typography: TypographyHints,
  spacing: SpacingHints,
  options: AnalysisOptions,
): ComponentBlueprint {
  const designSystemHints = buildDesignSystemHints(components, palette, typography, spacing);
  const testing = buildTestingHints(components, layout);

  return {
    meta,
    components,
    layout,
    designSystemHints,
    testing,
  };
}

/**
 * Build design system hints from detected components and styles
 */
function buildDesignSystemHints(
  components: DetectedComponent[],
  palette: ColorPalette,
  typography: TypographyHints,
  spacing: SpacingHints,
): DesignSystemHints {
  // Collect required component types
  const componentTypes = new Set(components.map(c => c.name));
  const requiredComponents = Array.from(componentTypes).filter(t => t !== 'Unknown');

  // Build variant usage map
  const variantUsage: Record<string, string[]> = {};
  for (const component of components) {
    if (component.variant) {
      if (!variantUsage[component.name]) {
        variantUsage[component.name] = [];
      }
      if (!variantUsage[component.name].includes(component.variant)) {
        variantUsage[component.name].push(component.variant);
      }
    }
  }

  return {
    requiredComponents,
    variantUsage,
    colorPalette: palette,
    typography,
    spacing,
  };
}

/**
 * Build testing hints from detected components
 */
function buildTestingHints(
  components: DetectedComponent[],
  layout: LayoutStructure,
): TestingHints {
  const snapshotCandidates: string[] = [];
  const interactionTests: InteractionTest[] = [];
  const accessibilityChecks: AccessibilityCheck[] = [];

  for (const component of components) {
    // Snapshot candidates: containers and headings (good for visual regression)
    if (component.name === 'Container' || component.name === 'Heading') {
      snapshotCandidates.push(component.id);
    }

    // Interaction tests based on component type
    switch (component.name) {
      case 'Button':
        interactionTests.push({
          componentId: component.id,
          action: 'click',
          description: `Click "${component.props.text || 'button'}" button`,
          expectedResult: 'Button click event fires, associated action executes',
        });
        break;

      case 'Input':
        interactionTests.push({
          componentId: component.id,
          action: 'type',
          description: `Type text into "${component.props.label || component.props.placeholder || 'input'}" field`,
          expectedResult: 'Input value updates, onChange event fires',
        });
        break;

      case 'Checkbox':
        interactionTests.push({
          componentId: component.id,
          action: 'check',
          description: `Toggle "${component.props.label || 'checkbox'}" checkbox`,
          expectedResult: 'Checkbox state toggles, onChange event fires',
        });
        break;

      case 'Link':
        interactionTests.push({
          componentId: component.id,
          action: 'click',
          description: `Click "${component.props.text || 'link'}" link`,
          expectedResult: 'Navigation occurs or associated action executes',
        });
        break;

      case 'Select':
        interactionTests.push({
          componentId: component.id,
          action: 'select',
          description: `Select option from "${component.props.label || 'select'}" dropdown`,
          expectedResult: 'Selected value updates, onChange event fires',
        });
        break;
    }

    // Accessibility checks
    if (component.name === 'Input' && !component.props.label) {
      accessibilityChecks.push({
        componentId: component.id,
        check: 'aria-label',
        severity: 'error',
        message: 'Input field is missing a label or aria-label for accessibility',
      });
    }

    if (component.name === 'Image' && (!component.props.alt || component.props.alt === 'Image')) {
      accessibilityChecks.push({
        componentId: component.id,
        check: 'alt-text',
        severity: 'error',
        message: 'Image is missing descriptive alt text',
      });
    }

    if (component.name === 'Button' && !component.props.text && !component.props.ariaLabel) {
      accessibilityChecks.push({
        componentId: component.id,
        check: 'aria-label',
        severity: 'warning',
        message: 'Button has no visible text or aria-label',
      });
    }

    if (component.name === 'Link') {
      accessibilityChecks.push({
        componentId: component.id,
        check: 'keyboard-nav',
        severity: 'info',
        message: 'Verify link is keyboard accessible and has focus styles',
      });
    }
  }

  // Check form focus order
  const formSection = layout.sections.find(s => s.type === 'form-group');
  if (formSection) {
    const formComponents = formSection.componentIds
      .map(id => components.find(c => c.id === id))
      .filter(Boolean) as DetectedComponent[];

    const inputsAndButtons = formComponents.filter(
      c => c.name === 'Input' || c.name === 'Button',
    );

    if (inputsAndButtons.length > 1) {
      accessibilityChecks.push({
        componentId: formSection.id,
        check: 'focus-order',
        severity: 'info',
        message: 'Verify form fields follow a logical tab order',
      });
    }
  }

  return {
    snapshotCandidates,
    interactionTests,
    accessibilityChecks,
  };
}