describe('Task Manager App', () => {
  const testEmail = 'PondPondPond@gmail.com';
  const testPassword = 'Pondza123456789';

  // ฟังก์ชันสำหรับ login
  const login = () => {
    cy.visit('/login');
    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="••••••••"]').type(testPassword);
    cy.contains('เข้าสู่ระบบ').click();

    // รอการตอบกลับจาก API login
    cy.intercept('POST', '**/login').as('loginRequest');
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    // ตรวจสอบว่า token ถูกเก็บใน localStorage
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      expect(token).to.exist;
    });

    // ตรวจสอบว่าไปที่ /tasks
    cy.url().should('include', '/tasks');
    cy.contains('Task Manager').should('exist');
  };

  it('Registers a new user successfully', () => {
    cy.visit('/register');
    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="••••••••"]').type(testPassword);
    cy.contains('สมัครสมาชิก').click();
    cy.url().should('include', '/');
  });

  it('Logs in and redirects to task page', () => {
    login(); // login ก่อน

    // ตรวจสอบว่าไปที่หน้า /tasks หลังจาก login
    cy.url().should('include', '/tasks');
    cy.contains('Task Manager').should('exist');
  });

  it('Shows error message for invalid login', () => {
    cy.visit('/');
    cy.get('input[placeholder="you@example.com"]').type('wrong@email.com');
    cy.get('input[placeholder="••••••••"]').type('wrongPassword');
    cy.contains('เข้าสู่ระบบ').click();

    // รอให้ข้อความแสดง
    cy.contains('อีเมลหรือรหัสผ่านไม่ถูกต้อง', { timeout: 10000 }).should('be.visible');
  });

  it('Creates a new task successfully', () => {
    login(); // login ก่อน

    // คลิก "Add Task"
    cy.contains('Add Task').click();

    // กรอกข้อมูล task
    cy.get('input[placeholder="Title"]', { timeout: 10000 }).should('be.visible').type('My Test Task');
    cy.get('input[placeholder="Description"]').type('Task description');
    cy.get('.ant-select').click();
    cy.contains('In Progress').click();

    // คลิก "Create Task"
    cy.contains('Create Task').click();

    // ตรวจสอบว่า task ใหม่ถูกสร้างแล้ว
    cy.contains('My Test Task').should('exist');
  });
});





