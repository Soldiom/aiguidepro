import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/*',
          dest: '.'
        }
      ]
    })
  ],
  // Set the base path for assets. Using './' for relative paths ensures the app
  // works correctly whether it's deployed at the root of a domain or in a subdirectory.
  base: '/aiguidepro/',
  publicDir: 'public'
});
