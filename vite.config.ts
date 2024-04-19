import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [
    react({
      devTarget: 'es2022', // Default: `es2020`
    }),
  ],
  root: './app',
  base: '/genify',
  css: { devSourcemap: true },
  server: {
    strictPort: true,
    cors: false,
  },
  build: {
    target: ['es2022', 'chrome122', 'firefox123', 'safari17.2', 'ios17.2'], // last 2
    outDir: '../dist', // relative to root
    emptyOutDir: true,
    modulePreload: { polyfill: false },
  },
})
