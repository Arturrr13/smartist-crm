// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    shim: false,
  },

  compatibilityDate: "2025-07-15",

  devtools: { enabled: false },

  modules: ["@nuxt/eslint", "@nuxt/image"],

  css: ["@/assets/styles/main.scss", "swiper/css"],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/utils/mixins.scss" as *;\n',
        },
      },
    },
  },

  app: {
    head: {
      charset: "utf-8",
      title: "Project Title",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "theme-color",
          content: "#0e0e0e",
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          property: "og:image:width",
          content: "600",
        },
        {
          property: "og:image:height",
          content: "314",
        },
        {
          property: "og:image:type",
          content: "image/jpeg",
        },
        {
          property: "og:site_name",
          content: "Smartist",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          name: "title",
          content: "Smartist",
        },
        {
          name: "description",
          content: "Smartist",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  runtimeConfig: {
    public: {
      dev_mode: Boolean(process.env.DEV_MODE),
    },
  },
})
