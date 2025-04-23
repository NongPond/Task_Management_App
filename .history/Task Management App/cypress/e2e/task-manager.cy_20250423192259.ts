describe('Task Manager App', () => {
  const testEmail = 'godpondza11@gmail.com';
  const testPassword = 'GodPondza12';

  beforeEach(() => {
    cy.intercept('POST', '**/api/auth/login').as('login'); // ✅ ต้องมาก่อน visit ทุกครั้งที่ test login
  });

  it('Registers a new user successfully', () => {
    cy.visit('/register');
    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="••••••••"]').type(testPassword);
    cy.contains('สมัครสมาชิก').click();
    cy.url().should('include', '/');
  });

  it('Logs in with correct credentials', () => {
    cy.intercept('POST', 'http://localhost:5000/api/auth/login').as('login'); // ← วางก่อน
  
    cy.visit('/');
  
    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="••••••••"]').type(testPassword);
    cy.contains('เข้าสู่ระบบ').click();
  
    cy.wait('@login'); // ← จะไม่ error ถ้า intercept ทำงานจริง
  });
  
  

  it('Creates a new task successfully', () => {
    cy.get('input[placeholder="Title"]').type('Test Task');
    cy.get('input[placeholder="Description"]').type('This is a test description');
    cy.get('.ant-select').click();
    cy.contains('In Progress').click();
    cy.contains('Create Task').click();
    cy.contains('Test Task').should('exist');
  });

  it('Shows error when creating task without title', () => {
    cy.get('input[placeholder="Title"]').clear();
    cy.contains('Create Task').click();
    cy.contains('Title is required').should('exist');
  });

  it('Edits a task', () => {
    cy.contains('Edit').first().click();
    cy.get('input').first().clear().type('Updated Task Title');
    cy.contains('Save').click();
    cy.contains('Updated Task Title').should('exist');
  });

  it('Deletes a task', () => {
    cy.contains('Delete').first().click();
    cy.contains('Updated Task Title').should('not.exist');
  });

  it('Logs out successfully', () => {
    cy.contains('Logout').click();
    cy.url().should('include', '/');
  });
});


