import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import type { Targets } from 'lightningcss'

/** targets updated jan 23 2025 */
// >1% in NA, last 3
// https://caniuse.com/mdn-javascript_builtins_set_union
const targetsLightningCSS = {
  android: 131,
  chrome: 130,
  edge: 130,
  firefox: 132,
  ios_saf: (18 << 16) | (0 << 8), // v18.0
  safari: (18 << 16) | (0 << 8), // v18.0
  // samsung: 25,
} satisfies Targets

// https://esbuild.github.io/api/#target
const targetsESBuild = [
  'es2022',
  'chrome130',
  'edge130',
  'firefox132',
  'ios18.0',
  'safari18.0',
]

const dev = import.meta.env.NODE_ENV === 'development'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react({
      devTarget: 'es2022', // Default: `es2020`
    }),
  ],
  root: './app',
  base: dev ? '/' : '/genify',
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
