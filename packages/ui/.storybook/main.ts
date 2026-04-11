import type { StorybookConfig } from "@storybook/react-vite"

import { dirname, resolve } from "path"
import { fileURLToPath } from "url"
import { createRequire } from "module"

const __dirname = dirname(fileURLToPath(import.meta.url))

const require = createRequire(import.meta.url)

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(require.resolve(`${value}/package.json`))
}
const config: StorybookConfig = {
  stories: [
    "../components/**/*.mdx",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@storybook/addon-vitest"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-onboarding"),
  ],
  framework: getAbsolutePath("@storybook/react-vite"),
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  viteFinal: async (config) => {
    // @storybook/blocks@8 imports storybook/internal/* paths that are not
    // exported by storybook@10. Alias them to the real v10 paths so both
    // the Vite dev-server optimizer and the Rollup build can resolve them.
    const storybookRoot = dirname(require.resolve("storybook/package.json"))

    // Force Vite to CJS-wrap semver so `import semver from 'semver'` works
    const semverPath = dirname(require.resolve("semver/package.json"))

    config.resolve = config.resolve ?? {}
    // Convert existing alias object to array so we can mix string and regex entries
    const existingAliases = Array.isArray(config.resolve.alias)
      ? config.resolve.alias
      : Object.entries(config.resolve.alias as Record<string, string> ?? {}).map(([find, replacement]) => ({ find, replacement }))

    config.resolve.alias = [
      ...existingAliases,
      { find: "storybook/internal/theming", replacement: `${storybookRoot}/dist/theming/index.js` },
      { find: "semver", replacement: `${semverPath}/index.js` },
      // React 19 ships useSyncExternalStore natively. Redirect both the bare shim
      // and its /index.js variant (which Vite/esbuild can't serve as ESM) to our
      // tiny ESM re-export from React. Uses regex for exact matching to avoid
      // prefix-replacement mangling the trailing /index.js onto the resolved path.
      {
        find: /^use-sync-external-store\/shim(\/index\.js)?$/,
        replacement: resolve(__dirname, "use-sync-external-store-shim.js"),
      },
    ]

    // Exclude @storybook/blocks from Vite pre-bundling so esbuild
    // doesn't choke on the internal imports during dep optimization.
    config.optimizeDeps = config.optimizeDeps ?? {}
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude ?? []),
      "@storybook/blocks",
    ]
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include ?? []),
      "semver",
    ]

    return config
  },
}
export default config
