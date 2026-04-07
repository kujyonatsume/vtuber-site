import path from "path";

const uploadDir = path.resolve("static");
const { env } = process;

const host =
  env.NODE_ENV == "development"
    ? `http://localhost:${env.PORT}`
    : `https://${env.DOMAIN}`;

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devServer: {
    port: Number(env.PORT),
  },
  devtools: { enabled: true },
  tailwindcss: {
    viewer: false,
    cssPath: "~/assets/css/tailwind.scss",
  },
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
      uploadDir,
      uploadBase: "/static",
    },
  },
  modules: [
    "@nuxt/devtools",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "nuxt-twemoji",
    "vuetify-nuxt-module",
    "@hypernym/nuxt-anime",
  ],
  imports: {
    imports: [{ from: "~/utils/toast", name: "toast" }],
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
    head: {
      title: "VTuber Project",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#111827" },
        {
          name: "description",
          content: "VTuber 企劃：檔期、剪輯、關於與贊助合作",
        },
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },
});
