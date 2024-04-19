import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// what is process.env.NODE_ENV ?

export default defineConfig({
  plugins: [
    react({
      devTarget: 'es2022', // Default: `es2020`
    }),
  ],
  root: './app',
  css: { devSourcemap: true },
  build: {
    target: ['es2022', 'chrome122', 'firefox123', 'safari17.2', 'ios17.2']
  }
})
