import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { fileURLToPath, URL } from 'node:url';
const local = (path: string) => fileURLToPath(new URL(path, import.meta.url));
export default defineConfig({
  define: { global: 'globalThis' },
  plugins: [react(), svgr({ include: '**/*.svg', svgrOptions: { svgo: false } })],
  resolve: { alias: [
    { find: '@/assets', replacement: local('./assets') },
    { find: '@', replacement: local('./src') },
    { find: /^react-native$/, replacement: 'react-native-web' },
    { find: /^react-native-svg$/, replacement: local('./src/web/svg.tsx') },
    { find: /^expo-router$/, replacement: local('./src/web/router.tsx') },
    { find: /^react-native-safe-area-context$/, replacement: local('./src/web/safe-area.tsx') },
    { find: /^expo-linear-gradient$/, replacement: local('./src/web/gradient.tsx') },
    { find: /^expo-constants$/, replacement: local('./src/web/constants.ts') },
    { find: /^expo-secure-store$/, replacement: local('./src/web/storage.ts') },
    { find: /^@react-native-async-storage\/async-storage$/, replacement: local('./src/web/storage.ts') }
  ] },
  server: { proxy: { '/api': { target: process.env.API_PROXY_TARGET || 'http://localhost:8080', changeOrigin: true }, '/auth': { target: process.env.API_PROXY_TARGET || 'http://localhost:8080', changeOrigin: true } } },
});
