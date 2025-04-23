/** cypress.config.cjs */
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    experimentalFetchPolyfill: true, // ✅ เปิด intercept fetch
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.{cy.ts,cy.js}',
    supportFile: false,
  },
})




