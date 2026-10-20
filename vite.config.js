import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function apiDevPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        try {
          const apiFile = path.resolve(__dirname, 'api', 'index.js');
          const module = await import(/* @vite-ignore */ `file://${apiFile}?t=${Date.now()}`);
          if (module.default && typeof module.default === 'function') {
            await module.default(req, res);
          } else {
            next();
          }
        } catch (err) {
          console.error('Vite API Dev Server Error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: 'Internal API Server Error', error: err.message }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load ALL env variables (not just VITE_ prefixed) into process.env
  // so API handlers running as middleware can access them via process.env
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      tailwindcss(),
      apiDevPlugin(),
    ],
  };
});
