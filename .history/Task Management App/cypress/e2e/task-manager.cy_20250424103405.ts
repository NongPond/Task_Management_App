describe('Task Manager App', () => {
  const testEmail = 'PondPondPond@gmail.com';
  const testPassword = 'Pondza123456789';

  // สร้างฟังก์ชัน login() ที่จะใช้ในหลายๆ test
  const login = () => {
    cy.visit('/');

    cy.intercept('POST', '**/login').as('loginRequest');

    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="••••••••"]').type(testPassword);
    cy.contains('เข้าสู่ระบบ').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      expect(token).to.exist;
    });

    cy.url({ timeout: 10000 }).should('include', '/tasks');
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
    login(); // เรียกใช้งานฟังก์ชัน login() ที่เราประกาศไว้

    cy.contains('Task Manager').should('exist');
  });

  it('Shows error message for invalid login', () => {
    cy.visit('/');
  
    cy.get('input[placeholder="you@example.com"]').type('wrong@email.com');
    cy.get('input[placeholder="••••••••"]').type('wrongPassword');
    cy.get('button').contains('เข้าสู่ระบบ').click();
  
    cy.contains('อีเมลหรือรหัสผ่านไม่ถูกต้อง', { timeout: 10000 }).should('be.visible');
  });

  it('Creates a new task successfully', () => {
    login(); // login แล้วไปที่ /tasks
  
    cy.contains('Add Task').click();
  
    cy.get('input[placeholder="Title"]', { timeout: 10000 }).type('My Test Task');
    cy.get('input[placeholder="Description"]').type('Task description');
    cy.get('.ant-select').click();
    cy.contains('In Progress').click();
    cy.contains('Create Task').click();
  
    cy.contains('My Test Task').should('exist');
  });
});

  

});




