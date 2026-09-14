import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');
  const apiTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8787';

  return {
    root: __dirname,
    plugins: [react()],
    publicDir: path.join(__dirname, 'public'),
    envDir: path.resolve(__dirname, '..'),
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: path.join(__dirname, 'dist'),
      emptyOutDir: true,
      sourcemap: false,
      // Do not preload catalog chunks on the login-critical path.
      // Avoid manualChunks for @dnd-kit: it pulled React into that chunk and
      // forced the login bundle to download dnd just to import React.
      modulePreload: {
        resolveDependencies: (_filename, deps) =>
          deps.filter(
            (dep) =>
              !dep.includes('CatalogScreen') &&
              !dep.includes('ActivityFeed') &&
              !dep.includes('dnd-')
          ),
      },
    },
  };
});
