import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const USERNAME = 'uncannystranger';
const UNSPLASH_API_ROOT = 'https://api.unsplash.com';

const stringParam = (value: unknown) => (typeof value === 'string' ? value : '');

const safeInteger = (value: string, fallback: number, min: number, max: number) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
};

const safePhotoId = (value: string) => /^[A-Za-z0-9_-]{4,80}$/.test(value);

const makeUnsplashUrl = (query: URLSearchParams) => {
  const pathValue = stringParam(query.get('path'));
  const url = new URL(UNSPLASH_API_ROOT);

  if (pathValue === `/users/${USERNAME}/photos`) {
    url.pathname = pathValue;
    url.searchParams.set('page', String(safeInteger(stringParam(query.get('page')), 1, 1, 50)));
    url.searchParams.set('per_page', String(safeInteger(stringParam(query.get('per_page')), 30, 1, 30)));
    url.searchParams.set('order_by', stringParam(query.get('order_by')) === 'oldest' ? 'oldest' : 'latest');
    if (stringParam(query.get('stats')) === 'true') url.searchParams.set('stats', 'true');
    return url;
  }

  const photoMatch = pathValue.match(/^\/photos\/([A-Za-z0-9_-]{4,80})$/);
  if (photoMatch && safePhotoId(photoMatch[1])) {
    url.pathname = `/photos/${photoMatch[1]}`;
    return url;
  }

  return null;
};

const unsplashDevApi = () => ({
  name: 'unsplash-dev-api',
  configureServer(server) {
    const env = loadEnv(server.config.mode, process.cwd(), '');

    server.middlewares.use('/api/unsplash', async (req, res) => {
      const sendJson = (status: number, body: unknown) => {
        res.statusCode = status;
        res.setHeader('content-type', 'application/json; charset=utf-8');
        res.setHeader('cache-control', 'no-store');
        res.end(JSON.stringify(body));
      };

      if (req.method !== 'GET') {
        sendJson(405, { error: 'Method not allowed', code: 'method-not-allowed' });
        return;
      }

      const key = env.VITE_UNSPLASH_ACCESS_KEY || env.UNSPLASH_ACCESS_KEY || process.env.VITE_UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_ACCESS_KEY;
      if (!key) {
        sendJson(500, { error: 'Photo service is not configured.', code: 'missing-config' });
        return;
      }

      const originalUrl = (req as typeof req & { originalUrl?: string }).originalUrl || req.url || '';
      const requestUrl = new URL(originalUrl, 'http://localhost');
      const unsplashUrl = makeUnsplashUrl(requestUrl.searchParams);
      if (!unsplashUrl) {
        sendJson(400, { error: 'Invalid photo request.', code: 'invalid-request' });
        return;
      }

      try {
        const response = await fetch(unsplashUrl.toString(), {
          headers: {
            authorization: `Client-ID ${key}`,
            accept: 'application/json',
          },
        });
        const payload = await response.json();
        if (!response.ok) {
          sendJson(response.status >= 500 ? 502 : response.status, {
            error: 'Photo service request failed.',
            code: response.status === 429 ? 'rate-limited' : 'upstream-error',
          });
          return;
        }
        sendJson(200, payload);
      } catch {
        sendJson(502, { error: 'Photo service is unavailable.', code: 'network-error' });
      }
    });
  },
});

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react(), unsplashDevApi()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          framer: ['framer-motion'],
          react: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
});
