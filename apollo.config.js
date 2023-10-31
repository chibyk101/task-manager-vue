// apollo.config.js
module.exports = {
    client: {
      service: {
        name: 'my-app',
        // URL to the GraphQL API
        url: 'http://task-manager.test/graphql',
      },
      // Files processed by the extension
      includes: [
        'src/**/*.vue',
        'src/**/*.js',
      ],
    },
  }