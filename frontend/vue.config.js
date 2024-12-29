const webpack = require('webpack'); // Importing webpack

module.exports = {
  transpileDependencies: true,
  devServer: {
    host: process.env.VUE_APP_HOST || 'localhost',
    port: process.env.VUE_APP_PORT || 8080,
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          VUE_APP_BACKEND_API_URL: JSON.stringify(process.env.VUE_APP_BACKEND_API_URL || 'http://localhost:3000'),
        },
      }),
    ],
  },
};
