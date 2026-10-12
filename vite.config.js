import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative asset paths, so the built site works from any folder or host.
  base: './',
  plugins: [react()],
  test: {
    // The app tests click through the whole flow, which is slow on a busy machine.
    testTimeout: 30000,
  },
});
