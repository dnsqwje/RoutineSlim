import { defineConfig, loadEnv } from 'vite';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.API_PROXY_TARGET || 'http://localhost:8080';
  const paths = ['/api', '/auth', '/oauth2', '/login/oauth2'];
  const proxy = Object.fromEntries(paths.map(path => [path, { target, changeOrigin: true }]));
  return {
    test: { environment: 'jsdom', globals: true, pool: 'threads', poolOptions: { threads: { singleThread: true } } },
    server: { port: 5173, strictPort: true, proxy },
    preview: { port: 4173, strictPort: true, proxy },
  };
});
