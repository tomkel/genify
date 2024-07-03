import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import type { Targets } from 'lightningcss'

/** targets updated jul 1 2024 */
// >1% in NA, last 3
// https://caniuse.com/mdn-javascript_builtins_set_union
const targetsLightningCSS = {
  android: 126,
  chrome: 123,
  edge: 124,
  firefox: 127,
  // ios_saf: (16 << 16) | (7 << 8), // v16.7
  ios_saf: (17 << 16) | (3 << 8), // v17.3
  safari: (17 << 16) | (3 << 8), // v17.3
  // samsung: 25,
} satisfies Targets

// https://esbuild.github.io/api/#target
const targetsESBuild = [
  'es2024',
  'chrome123',
  'edge124',
  'firefox127',
  'ios17.3',
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
