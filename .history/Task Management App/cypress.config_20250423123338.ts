import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // URL ที่แอปเรารันอยู่
    specPattern: 'cypress/e2e/**/*.cy.{ts,js}', // pattern หาไฟล์ test
    supportFile: false, // ถ้ายังไม่ใช้ไฟล์ support
  },
})

