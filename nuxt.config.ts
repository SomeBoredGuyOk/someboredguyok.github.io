// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
  ],
  css: ['~/assets/css/main.css'],
  ui: {
    // This forces the import of Prose components
    mdc: true 
  },
  // app: {
  //   baseURL: "/",
  //   buildAssetsDir: 'assets',
  // },
  icon: {
    clientBundle: {
 
      scan: true,
 
      sizeLimitKb: 256,
      icons: [
        'lucide:check',
        'lucide:user',
        'lucide:settings'
      ]
    },
  },
})
