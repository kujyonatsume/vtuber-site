import colors from 'tailwindcss/colors'
import { formatHex } from 'culori'
import path from "path";

const uploadDir = path.join(import.meta.dirname, ".data", "file");
const { env } = process;

const host =
  env.NODE_ENV == "development"
    ? `http://localhost:${env.PORT}`
    : `https://${env.DOMAIN}`;

const tailwindColor = {} as Record<string, string>
for (const [k, v] of Object.entries(colors)) {
  if (v?.['500']) tailwindColor[k] = formatHex(v['500']) as string
}

export default defineNuxtConfig({
  compatibilityDate: "2025-12-21",
  modules: [
    "@nuxt/devtools",
    "vuetify-nuxt-module",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@nuxt/fonts",
    "nuxt-twemoji",
    "@hypernym/nuxt-anime",
  ],
  devServer: {
    port: Number(env.PORT),
  },
  devtools: { enabled: true },
  nitro: {
    publicAssets: [{ baseURL: "/static", dir: uploadDir }],
    storage: {
      static: {
        driver: "fs",
        base: uploadDir,
      },
    },
    esbuild: {
      options: {
        tsconfigRaw: {
          compilerOptions: {
            experimentalDecorators: true,
          },
        },
      },
    },
  },
  runtimeConfig: {
    dbPath: env.DB_PATH,
    ownerEmail: env.OWNER_EMAIL,
    ownerName: env.OWNER_NAME,
    ownerPassword: env.OWNER_PASSWORD,
    sessionSecret: env.SESSION_SECRET,
    oauth: {
      google: {
        clientId: env.OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: env.OAUTH_GOOGLE_CLIENT_SECRET,
        redirectUri: host + env.OAUTH_GOOGLE_REDIRECT,
      },
      discord: {
        clientId: env.OAUTH_DISCORD_CLIENT_ID,
        clientSecret: env.OAUTH_DISCORD_CLIENT_SECRET,
        redirectUri: host + env.OAUTH_DISCORD_REDIRECT,
      },
    },
    public: {
      clientId: env.OAUTH_GOOGLE_CLIENT_ID,
      uploadDir, uploadBase: "/static",
    },
  },
  imports: {
    autoImport: true,
  },
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  },
  css: [
    "assets/styles/layers.css",
    "vuetify/styles",
    "assets/styles/tailwind.css",
  ],
  vuetify: {
    moduleOptions: {
      styles: { configFile: "assets/styles/settings.scss" },

      ssrClientHints: {
        reloadOnFirstRequest: false,
        viewportSize: true,
        // Keep theme stable from Vuetify `defaultTheme` instead of forcing browser dark mode.
        prefersColorScheme: false,
        prefersReducedMotion: true,
      },
    },
    vuetifyOptions: {
      theme: {
        // default 'system' requires `ssr: false` to avoid hydration warnings
        defaultTheme: "light",
        utilities: true,
        themes: {
          light: {
            dark: false,
            colors: {
              ...tailwindColor,
              background: "#f8fafc",
              surface: "#ffffff",
              primary: "#3f82f8",
              secondary: "#ff7a1f",
              info: "#3f82f8",
              success: "#22c55e",
              warning: "#f59e0b",
              error: "#ef4444",
              "on-surface": "#0f172a",
              neutral: "#94a3b8",
            },
          },
          dark: {
            dark: true,
            colors: {
              ...tailwindColor,
              background: "#0f172a",
              surface: "#1f2937",
              primary: "#93beff",
              secondary: "#ffb573",
              info: "#93beff",
              success: "#4ade80",
              warning: "#fbbf24",
              error: "#f87171",
              "on-surface": "#f8fafc",
              neutral: "#cbd5e1",
            },
          },
        },
      },
      display: {
        mobileBreakpoint: "md",
        thresholds: {
          xs: 0,
          sm: 600,
          md: 960,
          lg: 1280,
          xl: 1920,
          xxl: 2560,
        },
      },
    },
  },
  i18n: {
    baseUrl: host,
    defaultLocale: "zh",
    strategy: "no_prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n",
      redirectOn: "root",
    },
    vueI18n: "./i18n.config.ts",

    locales: [
      { code: "zh", language: "zh-TW", name: "繁體中文", file: "zh-TW.json" },
      { code: "en", language: "en-US", name: "English", file: "en-US.json" },
    ],
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
    head: {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#111827" }
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },
});
