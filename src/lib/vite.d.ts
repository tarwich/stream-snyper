interface ImportMetaEnv {
  readonly VITE_AUTH_ENDPOINT?: string;
  readonly VITE_FUNCTIONS_ENDPOINT?: string;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
