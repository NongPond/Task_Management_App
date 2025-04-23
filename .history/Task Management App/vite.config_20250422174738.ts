import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

test: {
  environment: "jsdom",
  globals: true,
  coverage: {
    reporter: ["text", "json", "html"],
    lines: 90,
    functions: 90,
    branches: 90,
    statements: 90,
  },
},

