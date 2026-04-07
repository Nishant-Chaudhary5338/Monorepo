import type { StorybookConfig } from "@storybook/react-vite"

import { dirname } from "path"
import { createRequire } from "module"

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
    // exported by storybook@10. Mark them external so Rollup doesn't try
    // to resolve/bundle those internal subpaths.
    config.build = config.build ?? {};
    config.build.rollupOptions = config.build.rollupOptions ?? {};
    const existing = config.build.rollupOptions.external;
    const internalPattern = /^storybook\/internal\//;
    config.build.rollupOptions.external = Array.isArray(existing)
      ? [...existing, internalPattern]
      : existing
        ? [existing as RegExp, internalPattern]
        : [internalPattern];
    return config;
  },
}
export default config
