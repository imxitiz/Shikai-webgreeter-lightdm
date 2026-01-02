import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
// import fs from 'node:fs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
// const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'))

export default defineConfig(({ mode }): UserConfig => {
  const isDev = mode === 'development'

  return {
    base: './',
    plugins: [
      tailwindcss(),
      react(),
      svgr({
        svgrOptions: {
          exportType: 'default',
          ref: true,
          svgo: !isDev,
          titleProp: true
        },
        include: '**/*.svg'
      }),
      {
        name: 'yaml-loader',
        transform(code: string, id: string) {
          if (id.endsWith('.yml') || id.endsWith('.yaml')) {
            return {
              code: `export default ${JSON.stringify(code)}`,
              map: null
            }
          }
        }
      }
    ],
    root: 'src',
    publicDir: resolve(__dirname, 'public'),
    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
      sourcemap: isDev,
      minify: isDev ? false : 'terser',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/index.html'),
          app: resolve(__dirname, 'src/app.html'),
          modern: resolve(__dirname, 'src/modern.html'),
          monitor: resolve(__dirname, 'src/monitor.html')
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return '[name][extname]'
            }
            if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
              return 'assets/fonts/[name][extname]'
            }
            return 'assets/[name][extname]'
          }
        }
      },
      terserOptions: {
        format: {
          comments: false
        }
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@js': resolve(__dirname, 'src/js'),
        '@css': resolve(__dirname, 'src/css'),
        '@lang': resolve(__dirname, 'src/lang')
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },
    server: {
      port: 3000,
      open: true
    }
  }
})
