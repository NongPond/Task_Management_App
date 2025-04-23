// ตรวจสอบไฟล์ setup() หรือ render ใน Register.test.tsx
// ตัวอย่างควรเป็นแบบนี้:
import { render } from "@testing-library/react";
import Register from "../Register";

const setup = () => render(<Register />);
