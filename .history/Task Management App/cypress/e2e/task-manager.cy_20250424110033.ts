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
    // Log in if necessary
    cy.visit('/');
    cy.intercept('POST', '**/login').as('loginRequest');

    cy.get('input[placeholder="you@example.com"]').type('111111000001@gmail.com');
    cy.get('input[placeholder="••••••••"]').type('Pondza123456789');
    cy.get('button').contains('เข้าสู่ระบบ').click();

  
    // After login, visit the /tasks page
    cy.visit('/tasks');
    cy.url().should('include', '/tasks');
  
    // Ensure the page has loaded by checking for a specific element
    cy.get('input[placeholder="Title"]').should('be.visible');
  
    // Fill out the form to create a new task
    cy.get('input[placeholder="Title"]').type('My Test Task');
    cy.get('input[placeholder="Description"]').type('Task description');
  
    // Select the status of the task
    cy.get('.ant-select').click();
    cy.contains('In Progress').click();
  
    // Click the "Create Task" button
    cy.contains('Create Task').click();
  
    // Wait for the task to be added and visible on the page
    cy.contains('My Test Task', { timeout: 10000 }).should('exist');
  });

  it('Shows error when creating task without title', () => {

    cy.visit('/');
    cy.intercept('POST', '**/login').as('loginRequest');

    cy.get('input[placeholder="you@example.com"]').type('111111000001@gmail.com');
    cy.get('input[placeholder="••••••••"]').type('Pondza123456789');
    cy.get('button').contains('เข้าสู่ระบบ').click();
    
    cy.contains('Create Task').click();
    cy.contains('Title is required').should('exist');
  });

  it('Edits a task', () => {
    
    cy.contains('Edit').first().click();
    cy.get('input').first().clear().type('Updated Task');
    cy.contains('Save').click();
    cy.contains('Updated Task').should('exist');
  });

});




