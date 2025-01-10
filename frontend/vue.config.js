const webpack = require('webpack'); // Importing webpack
module.exports = {
  devServer: {
    host: '0.0.0.0', // Allows external access to the container
    port: 8080,      // Frontend runs on port 8080
    hot: true,       // Hot Module Replacement
    liveReload: true, // Enable live reload
    watchFiles: ['src/**/*', 'public/**/*'], // Ensure file watching
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },







  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env.VUE_APP_BACKEND_API_URL': JSON.stringify(
          process.env.VUE_APP_BACKEND_API_URL || 'http://localhost:3000'
        ),
      }),
    ],
  },
};


