import * as fs from 'fs';
import * as path from 'path';

export interface ComponentEntry {
  name: string;
  importPath: string;
  propsPreview: string;
  hasVariants: boolean;
}

export interface UICatalog {
  packageName: string;
  componentsPath: string;
  components: ComponentEntry[];
  totalCount: number;
}

export function getUICatalog(componentsDir: string, packageName = '@repo/ui'): UICatalog {
  if (!fs.existsSync(componentsDir)) {
    throw new Error(`Components directory not found: ${componentsDir}`);
  }

  const entries = fs.readdirSync(componentsDir, { withFileTypes: true });
  const components: ComponentEntry[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const name = entry.name;
    const componentDir = path.join(componentsDir, name);
    const mainFile = path.join(componentDir, `${name}.tsx`);
    const typesFile = path.join(componentDir, `${name}.types.ts`);
    const variantsFile = path.join(componentDir, `${name}.variants.ts`);

    if (!fs.existsSync(mainFile)) continue;

    const propsPreview = extractPropsPreview(typesFile, mainFile);
    const hasVariants = fs.existsSync(variantsFile);

    components.push({
      name,
      importPath: `${packageName}`,
      propsPreview,
      hasVariants,
    });
  }

  return {
    packageName,
    componentsPath: componentsDir,
    components,
    totalCount: components.length,
  };
}

function extractPropsPreview(typesFile: string, mainFile: string): string {
  if (fs.existsSync(typesFile)) {
    const content = fs.readFileSync(typesFile, 'utf-8');
    const match = content.match(/export interface \w+Props\s*\{([^}]{0,600})/);
    if (match) {
      return match[1]
        .split('\n')
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('*') && !l.startsWith('/') && !l.startsWith('@'))
        .join(' ')
        .slice(0, 300);
    }
  }

  // Fallback: scan main file for props
  if (fs.existsSync(mainFile)) {
    const content = fs.readFileSync(mainFile, 'utf-8');
    const match = content.match(/interface \w+Props\s*\{([^}]{0,300})/);
    if (match) return match[1].replace(/\s+/g, ' ').trim().slice(0, 200);
  }

  return '';
}

export function formatCatalogForPrompt(catalog: UICatalog): string {
  const lines: string[] = [
    `# @repo/ui Component Catalog (${catalog.totalCount} components)`,
    `Import from: "${catalog.packageName}"`,
    '',
    '## Available Components',
    '',
  ];

  for (const c of catalog.components) {
    lines.push(`### ${c.name}`);
    lines.push(`- Import: \`import { ${c.name} } from "${c.importPath}"\``);
    if (c.hasVariants) lines.push(`- Has variants (check component for variant prop options)`);
    if (c.propsPreview) lines.push(`- Props: ${c.propsPreview}`);
    lines.push('');
  }

  return lines.join('\n');
}
