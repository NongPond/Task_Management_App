import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    // adjust to whatever port your Vite dev server is actually running on
    baseUrl: 'http://localhost:5173',

    // where your specs live
    specPattern: 'cypress/e2e/**/*.{cy.ts,cy.js}',

    // if you don’t yet have a support file, disable it
    supportFile: false,

    // you can also wire up node events here:
    setupNodeEvents(on, config) {
      // e.g. on('before:browser:launch', (browser = {}, launchOptions) => { … })
    },
  },
})


