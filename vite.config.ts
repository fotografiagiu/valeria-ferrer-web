import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const overridesProxyTarget =
      env.VITE_OVERRIDES_PROXY_TARGET || 'https://valeria-ferrer-panel.vercel.app';
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          // Dev same-origin fetch → real panel (Production by default; override for local :8787).
          '/api/public': {
            target: overridesProxyTarget,
            changeOrigin: true,
          },
        },
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              router: ['react-router-dom'],
              motion: ['framer-motion'],
              icons: ['lucide-react']
            }
          }
        },
        chunkSizeWarningLimit: 1000,
        assetsInlineLimit: 4096,
        cssCodeSplit: true
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
