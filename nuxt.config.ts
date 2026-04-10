import 'dotenv/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  srcDir: 'app/',
  serverDir: '../server/',
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    public: {}
  },
  nitro: {
    experimental: {
      wasm: true
    }
  }
})