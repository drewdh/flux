import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import browserslistToEsbuild from 'browserslist-to-esbuild';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      common: '/src/common',
      utilities: '/src/utilities',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  server: {
    port: 3000,
    https: {
      cert: './certs/localhost.pem',
      key: './certs/localhost-key.pem',
    },
  },
  build: {
    target: browserslistToEsbuild(),
  },
});
