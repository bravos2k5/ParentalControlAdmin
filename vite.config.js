import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProd = mode === 'production'
  const dropConsole = env.VITE_DROP_CONSOLE === 'true' || isProd

  return {
    plugins: [
      vue(),
      // Enable Vue DevTools only in development
      !isProd && vueDevTools(),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    build: {
      target: 'es2019',
      cssCodeSplit: true,
      sourcemap: 'hidden',
      minify: 'esbuild',
      reportCompressedSize: false,
      assetsInlineLimit: 4096, // inline small assets <4kb
      outDir: 'dist',
      assetsDir: 'assets',
      // Drop console/debugger in production
      esbuild: {
        drop: dropConsole ? ['console', 'debugger'] : [],
      },
      rollupOptions: {
        output: {
          // Consistent hashed filenames for cache busting
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: ({ name }) => {
            // Group assets by type
            if (!name) return 'assets/[name]-[hash][extname]'
            const ext = name.split('.').pop()
            if (/(png|jpe?g|gif|svg|webp|avif)$/i.test(ext)) return 'assets/images/[name]-[hash][extname]'
            if (/(css)$/i.test(ext)) return 'assets/styles/[name]-[hash][extname]'
            if (/(woff2?|ttf|eot|otf)$/i.test(ext)) return 'assets/fonts/[name]-[hash][extname]'
            return 'assets/[name]-[hash][extname]'
          },
          manualChunks: {
            vue: ['vue'],
            router: ['vue-router'],
            pinia: ['pinia'],
            axios: ['axios'],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'axios'],
    },
  }
})
