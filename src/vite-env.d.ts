/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPER_ADMIN_EMAIL?: string;
  readonly VITE_SUPER_ADMIN_PASSWORD?: string;
  readonly VITE_SUPER_ADMIN_SECURITY_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

