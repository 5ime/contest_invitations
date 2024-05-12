export default({
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss"],
  serverMiddleware: [
    '~/server-middleware/poster'
  ],
})