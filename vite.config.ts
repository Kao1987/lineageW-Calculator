import { fileURLToPath, URL } from 'node:url'
import { defineConfig, ServerOptions } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { createMimeFixPlugin } from './vite-plugins/mime-fix'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  base:
    process.env.CI === 'github'
      ? '/lineageW-Labs/' // GitHub Pages
      : '/', // 伺服器 (Nginx)
  plugins: [
    vue(),
    vueDevTools(),
    createMimeFixPlugin(),
    basicSsl(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        'vue-i18n',
        {
          '@vueuse/core': ['useDark', 'useToggle'],
        },
      ],
      dts: true,
      vueTemplate: true,
      eslintrc: {
        enabled: true,
      },
    }),
    Components({
      dts: true,
      dirs: ['src/components', 'modules/*/components', 'modules/shared/components'],
      resolvers: [
        // 自動解析模組元件
        (componentName) => {
          if (componentName.startsWith('PetEvaluate')) {
            return `@/pet-evaluate/components/${componentName}.vue`
          }
          if (componentName.startsWith('JobChange')) {
            return `@/job-change/components/${componentName}.vue`
          }
          return null
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      // 模組特定路徑 - 必須放在通用 @ 路徑之前
      '@/job-change': fileURLToPath(new URL('./modules/job-change', import.meta.url)),
      '@/pet-evaluate': fileURLToPath(new URL('./modules/pet-evaluate', import.meta.url)),
      '@/shared': fileURLToPath(new URL('./modules/shared', import.meta.url)),
      '@/shared-stores': fileURLToPath(new URL('./modules/shared/stores', import.meta.url)),
      '@/shared-utils': fileURLToPath(new URL('./modules/shared/utils', import.meta.url)),
      '@/modules': fileURLToPath(new URL('./modules', import.meta.url)),

      // 通用路徑 - 放在最後
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@/components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@/stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      '@/types': fileURLToPath(new URL('./src/types', import.meta.url)),
      '@/utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@/api': fileURLToPath(new URL('./src/api', import.meta.url)),
    },
  },
  server: {
    https: {},
    port: 3000,
    fs: {
      // 允許服務超出根目錄的檔案
      allow: ['..'],
    },
    middlewareMode: false,
  } as ServerOptions,
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
  },
})
