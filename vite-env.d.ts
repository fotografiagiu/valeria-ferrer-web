/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_OVERRIDES_URL?: string;
  readonly VITE_OVERRIDES_PROXY_TARGET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
