module.exports = {
    testEnvironment: 'jsdom',  // ใช้ jsdom เพื่อทดสอบในสภาพแวดล้อมของเบราว์เซอร์
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],  // ใช้ @testing-library/jest-dom
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',  // ใช้ ts-jest สำหรับการทดสอบไฟล์ TypeScript
    },
    testMatch: ['**/?(*.)+(spec|test).ts?(x)'],  // กำหนดรูปแบบการตั้งชื่อไฟล์ทดสอบ
  };
  