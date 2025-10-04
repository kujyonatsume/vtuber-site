import path from "path"

const uploadDir = path.resolve('static')

const host = process.env.NODE_ENV == "development" ? "http://localhost:3000" : "http://vtuber.natsumes.cc"

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port:2053
  },
  tailwindcss: { viewer: false },
  nitro: {
    publicAssets: [
      { baseURL: '/static', dir: uploadDir },
    ],
    storage: {
      static: {
        driver: "fs",
        base: uploadDir,
      }
    },
    esbuild: {
      options: {
        tsconfigRaw: {
          compilerOptions: {
            experimentalDecorators: true
          }
        },
      },
    },
  },
  runtimeConfig: {
    sessionSecret: process.env.SESSION_SECRET,
    oauth: {
      google: {
        clientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
        redirectUri: host + process.env.OAUTH_GOOGLE_REDIRECT,
      },
      discord: {
        clientId: process.env.OAUTH_DISCORD_CLIENT_ID,
        clientSecret: process.env.OAUTH_DISCORD_CLIENT_SECRET,
        redirectUri: host + process.env.OAUTH_DISCORD_REDIRECT,
      }
    },
    public: {
      clientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
      uploadDir,
      uploadBase: '/static'
    }
  },
  modules: [
    '@nuxt/devtools',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-twemoji',
    'vuetify-nuxt-module',
    'dayjs-nuxt',
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
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  },
})
