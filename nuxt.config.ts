// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  nitro: {
    preset: 'node-server',
    storage: {
      // 將 submissions 指到本機資料夾 ./.data/submissions
      submissions: { driver: 'fs', base: './.data/submissions' }
    }
  },
  devtools: { enabled: true },
  tailwindcss: { viewer: false },
  modules: [
    '@nuxt/devtools',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-twemoji',
    'vuetify-nuxt-module',
  ],
  build: {
    transpile: ['vuetify-sonner']
  },
  app: {
    head: {
      title: 'VTuber Project',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#111827' },
        { name: 'description', content: 'VTuber 企劃：檔期、剪輯、關於與贊助合作' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
})
