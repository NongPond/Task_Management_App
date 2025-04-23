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
