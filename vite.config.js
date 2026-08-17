import { cloudflare } from '@cloudflare/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { sites } from './build/sites-vite-plugin.js';

const isCodexSandbox = process.env.CODEX_SANDBOX === 'seatbelt';

export default defineConfig({
  server: isCodexSandbox
    ? { watch: { useFsEvents: false, usePolling: true } }
    : undefined,
  plugins: [
    react(),
    sites(),
    cloudflare({
      config: {
        name: 'server',
        main: './worker/index.js',
        compatibility_flags: ['nodejs_compat'],
      },
    }),
  ],
});
