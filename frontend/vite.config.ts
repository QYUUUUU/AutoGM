import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// ─────────────────────────────────────────────────────────────────────────
// Multi-entry build: one JS/CSS pair per "thing that gets mounted into a
// Twig page". `chrome` (header+footer) loads on every page via
// base.html.twig. `home` is the home.html.twig body. When we migrate the
// next page off Bootstrap (dashboard, characters, maps, ...), add one more
// line here, e.g.:
//   dashboard: path.resolve(__dirname, 'src/dashboard/main.tsx'),
// and it'll build to app/public/js/dashboard.js + app/public/css/dashboard.css
// automatically, following the same pattern.
// ─────────────────────────────────────────────────────────────────────────
const entries = {
  chrome: path.resolve(__dirname, 'src/chrome/main.tsx'),
  home: path.resolve(__dirname, 'src/home/main.tsx'),
  admin_dashboard: path.resolve(__dirname, 'src/admin_dashboard/main.tsx'),
  auth: path.resolve(__dirname, 'src/auth/main.tsx'),
  characters: path.resolve(__dirname, 'src/characters/main.tsx'),
  dashboard: path.resolve(__dirname, 'src/dashboard/main.tsx'),
  rituals: path.resolve(__dirname, 'src/rituals/main.tsx'),
  monde: path.resolve(__dirname, 'src/monde/main.tsx'),
  maps: path.resolve(__dirname, 'src/maps/main.tsx'),
  faveurs: path.resolve(__dirname, 'src/faveurs/main.tsx'),
  eclats: path.resolve(__dirname, 'src/eclats/main.tsx'),
  character_sheet: path.resolve(__dirname, 'src/character_sheet/main.tsx'),
  create_character: path.resolve(__dirname, 'src/create_character/main.tsx'),  // Add more entries here as needed for other pages/components
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // AutoGM serves app/public directly at web root
    // (app.use(expressStatic('./app/public'))), so js/chrome.js ends up at
    // /js/chrome.js and css/chrome.css at /css/chrome.css -- same
    // convention as the existing /css, /js, /images.
    outDir: path.resolve(__dirname, '../app/public'),
    emptyOutDir: false, // NEVER wipe app/public -- other real files live there
    rollupOptions: {
      input: entries,
      output: {
        // Fixed, predictable filenames (no content hash) so Twig templates
        // can reference them directly, no manifest step needed.
        entryFileNames: 'js/[name].js',
        // Rollup splits code shared between entries (React, routes.ts, etc.)
        // into a separate chunk and can name it arbitrarily -- force a clear
        // name instead so the output is self-explanatory on disk.
        chunkFileNames: 'js/shared-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            // Rollup names CSS assets after the JS entry that imported them,
            // so chrome's CSS lands as css/chrome.css, home's as css/home.css.
            return 'css/[name][extname]'
          }
          return 'assets/[name][extname]'
        },
      },
    },
  },
})
