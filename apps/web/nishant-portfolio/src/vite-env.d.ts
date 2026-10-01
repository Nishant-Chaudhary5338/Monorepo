/// <reference types="vite/client" />

declare module "*.md?compiled" {
  const compiled: { html: string; toc: { id: string; text: string; level: 2 | 3 }[] };
  export default compiled;
}

interface ImportMetaEnv {
  readonly VITE_APP_EMAILJS_SERVICE_ID: string;
  readonly VITE_APP_EMAILJS_TEMPLATE_ID: string;
  readonly VITE_APP_EMAILJS_USER_ID: string;
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}