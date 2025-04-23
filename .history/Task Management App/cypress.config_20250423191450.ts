/** cypress.config.cjs */
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.{cy.ts,cy.js}',
    supportFile: false,
  },
})

experimentalFetchPolyfill: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
    },
    baseUrl: 'http://localhost:5173'
  },

