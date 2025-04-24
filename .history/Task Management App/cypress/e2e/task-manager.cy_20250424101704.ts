describe('Task Manager App', () => {
  const testEmail = 'PondPondPond@gmail.com';
  const testPassword = 'Pondza123456789';

  it('Registers a new user successfully', () => {
    cy.visit('/register');

    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="••••••••"]').type(testPassword);
    cy.contains('สมัครสมาชิก').click();

    cy.url().should('include', '/');
  });

  it('Logs in and redirects to task page', () => {
    cy.visit('/');

    // Intercept login request
    cy.intercept('POST', '**/login').as('loginRequest');

    // Fill login form
    cy.get('input[placeholder="you@example.com"]').type('111111000001@gmail.com');
    cy.get('input[placeholder="••••••••"]').type('Pondza123456789');
    cy.get('button').contains('เข้าสู่ระบบ').click();

    // Wait for login API response
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    // Check token exists in localStorage
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      expect(token).to.exist;
    });

    // Confirm redirected to /tasks
    cy.url({ timeout: 10000 }).should('include', '/tasks');
    cy.contains('Task Manager').should('exist');
  });

  it('Shows error message for invalid login', () => {
    cy.visit('/');
  
    cy.get('input[placeholder="you@example.com"]').type('wrong@email.com');
    cy.get('input[placeholder="••••••••"]').type('wrongPassword');
    cy.get('button').contains('เข้าสู่ระบบ').click();
  
    // รอให้ข้อความปรากฏ
    cy.contains('อีเมลหรือรหัสผ่านไม่ถูกต้อง', { timeout: 10000 }).should('be.visible');
  });

  it('Creates a new task successfully', () => {
    // ต้อง login ก่อนทดสอบหน้านี้ (แนะนำให้เรียก login() ถ้าเขียนไว้)
    cy.visit('/');
  
    // ทำ login ก่อนสร้าง task
    cy.get('input[placeholder="you@example.com"]').type('pond.testuser@gmail.com');
    cy.get('input[placeholder="••••••••"]').type('Pondza123456789');
    cy.contains('เข้าสู่ระบบ').click();
    cy.url().should('include', '/tasks');
  
    // เปิดฟอร์มสร้าง task
    cy.contains('Add Task').click();
  
    // กรอกข้อมูล task
    cy.get('input[placeholder="Title"]', { timeout: 10000 }).should('exist').type('My Test Task');
    cy.get('input[placeholder="Description"]').type('Task description');
    cy.get('.ant-select').click();
    cy.contains('In Progress').click();
  
    // กดปุ่มสร้าง
    cy.contains('Create Task').click();
  
    // ตรวจสอบว่า task แสดงในหน้าจอ
    cy.contains('My Test Task').should('exist');
  });
  
  

});




