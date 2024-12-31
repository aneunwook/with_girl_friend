const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      zlib: require.resolve('browserify-zlib'),
      path: require.resolve('path-browserify'),
      url: require.resolve('url/'),

    },
  },
  // 추가적인 Webpack 설정이 필요한 경우 여기에 추가
};
