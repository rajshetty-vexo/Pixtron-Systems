import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const ngrokHost = 'intermeningeal-eloisa-unadorably.ngrok-free.dev';
  const apiPort = env.API_PORT || '3001';
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    define: {},
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: true,
      allowedHosts: [ngrokHost],
      proxy: {
        '/api': {
          target: `http://localhost:${apiPort}`,
          changeOrigin: true,
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      allowedHosts: [ngrokHost],
    },
  };
});
