// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css', '@fortawesome/fontawesome-svg-core/styles.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  colorMode: {
    preference: 'light'
  },
  modules: ['@nuxtjs/google-fonts', 'radix-vue/nuxt', '@nuxt/ui'],
  googleFonts: {
    families: {
      Rubik: {
        wght: [100,200,300,400,500,600,700,800,900],
        ital: [100]
      },
    }
  }
})