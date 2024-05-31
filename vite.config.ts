import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import type { Targets } from 'lightningcss'

/** targets updated may 31 2024 */
// >1% in NA, last 3
const targetsLightningCSS = {
  android: 125,
  chrome: 122,
  edge: 123,
  firefox: 124,
  ios_saf: (16 << 16) | (7 << 8), // v16.7
  safari: (17 << 16) | (3 << 8), // v17.3
  samsung: 24,
} satisfies Targets

// https://esbuild.github.io/api/#target
const targetsESBuild = [
  'es2022',
  'chrome122',
  'edge123',
  'firefox124',
  'ios16.7',
  'safari17.3',
]

const dev = import.meta.env.DEV

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react({
      devTarget: 'es2022', // Default: `es2020`
    }),
  ],
  root: './app',
  base: '/genify',
  css: {
    devSourcemap: dev,
    transformer: 'lightningcss',
    lightningcss: {
      targets: targetsLightningCSS,
    },
  },
  server: {
    strictPort: true,
    cors: false,
  },
  build: {
    target: targetsESBuild,
    outDir: '../dist', // relative to app root
    emptyOutDir: true,
    modulePreload: { polyfill: false },
    sourcemap: dev && 'inline',
    minify: !dev,
    cssMinify: 'lightningcss',
  },
})
