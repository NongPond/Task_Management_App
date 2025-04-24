describe('Task Manager App', () => {
  const testEmail = 'PondPondPond@gmail.com';
  const testPassword = 'Pondza123456789';

  // ฟังก์ชันสำหรับ login
  const login = () => {
    cy.visit('/login'); // ไปที่หน้า login
    cy.get('input[placeholder="you@example.com"]').type(testEmail); // กรอกอีเมล
    cy.get('input[placeholder="••••••••"]').type(testPassword); // กรอกรหัสผ่าน
    cy.contains('เข้าสู่ระบบ').click(); // คลิกปุ่มเข้าสู่ระบบ

    // รอการตอบกลับจาก API login
    cy.intercept('POST', '**/login').as('loginRequest');
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    // ตรวจสอบว่า token ถูกเก็บใน localStorage
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      expect(token).to.exist;
    });

    // ตรวจสอบว่าไปที่ /tasks หลังจาก login สำเร็จ
    cy.url().should('include', '/tasks');
  };

  it('Creates a new task successfully', () => {
    login(); // ทำการ login ก่อน

    // คลิก "Add Task"
    cy.contains('Add Task').click();

    // กรอกข้อมูลในฟอร์มสร้าง task
    cy.get('input[placeholder="Title"]').type('My Test Task');
    cy.get('input[placeholder="Description"]').type('Task description');
    
    // เลือกสถานะของ task
    cy.get('.ant-select').click();
    cy.contains('In Progress').click();

    // คลิกปุ่ม "Create Task"
    cy.contains('Create Task').click();

    // ตรวจสอบว่า task ที่สร้างใหม่มีชื่อที่แสดงขึ้นมาในหน้า
    cy.contains('My Test Task').should('exist');
  });
});
