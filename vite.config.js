import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: [
        './index.html',
        './generator.html',
        './chat.html',
        './profile.html',
        './login.html',
        './explore-budget.html',
        './explore-quick.html',
        './explore-protein.html',
        './explore-comfort.html',
      ],
    },
  },
});
