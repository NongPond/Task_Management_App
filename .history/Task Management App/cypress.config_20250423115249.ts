import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts', // หรือ .js ถ้ายังไม่ได้ใช้ TS
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
  },
});



