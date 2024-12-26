const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: process.env.VUE_APP_HOST || 'localhost',
    port: process.env.VUE_APP_PORT || 8080
  }
})
