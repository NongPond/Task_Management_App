describe('Task Manager App', () => {
  const testEmail = 'PondPondPond@gmail.com';
  const testPassword = 'Pondza123456789';

  it('Registers a new user successfully', () => {
    cy.visit('/register');

    // ใช้ timeout ที่มากขึ้นเพื่อให้แน่ใจว่า element ถูกโหลด
    cy.get('input[name="email"]', { timeout: 20000 }).should('exist').type(testEmail);
    cy.get('input[name="password"]', { timeout: 20000 }).should('exist').type(testPassword);
    cy.contains('สมัครสมาชิก').click();

    cy.url().should('include', '/');
  });

  it('Logs in and redirects to task page', () => {
    cy.visit('/login');

    // ใช้ timeout และตรวจสอบว่า input email อยู่ใน DOM
    cy.get('input[name="email"]', { timeout: 20000 }).should('exist').type(testEmail);
    cy.get('input[name="password"]', { timeout: 20000 }).should('exist').type(testPassword);

    cy.contains('เข้าสู่ระบบ').click();

    // รอการตอบกลับจาก API
    cy.intercept('POST', '**/login').as('loginRequest');
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    // ตรวจสอบว่า token มีอยู่ใน localStorage
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      expect(token).to.exist;
    });

    // ตรวจสอบการเปลี่ยนแปลง URL
    cy.url().should('include', '/tasks');
  });

  it('Creates a new task successfully', () => {
    cy.visit('/tasks'); // ไปที่หน้า tasks โดยตรง

    cy.contains('Add Task').click();

    // กรอกข้อมูล task ใหม่
    cy.get('input[placeholder="Title"]', { timeout: 10000 }).should('exist').type('My Test Task');
    cy.get('input[placeholder="Description"]').type('Task description');
    
    cy.get('.ant-select').click();
    cy.contains('In Progress').click();
    
    cy.contains('Create Task').click();

    cy.contains('My Test Task').should('exist');
  });
});

