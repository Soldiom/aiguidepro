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
        },
        // Copy AI Agent System documentation files
        {
          src: '100X_AI_AGENT_GUIDE.md',
          dest: '.'
        },
        {
          src: 'AI_GUIDE_INDEX.md',
          dest: '.'
        },
        {
          src: 'ARCHITECTURE_DIAGRAMS.md',
          dest: '.'
        },
        {
          src: 'CURATED_RESOURCES.md',
          dest: '.'
        },
        {
          src: 'DEPLOYMENT_GUIDE.md',
          dest: '.'
        },
        {
          src: 'IMPLEMENTATION_GUIDES.md',
          dest: '.'
        },
        {
          src: 'IMPLEMENTATION_SUMMARY.md',
          dest: '.'
        },
        // Copy quickstart scripts directory
        {
          src: 'quickstart-scripts',
          dest: '.'
        }
      ]
    })
  ],
  // Set the base path for assets. Using './' for relative paths ensures the app
  // works correctly whether it's deployed at the root of a domain or in a subdirectory.
  base: './',
  publicDir: 'public'
});
