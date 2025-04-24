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
    cy.get('input[placeholder="you@example.com"]').type('P111111000001@gmail.com');
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

  it('Fails login with wrong password', () => {
    cy.visit('/');
    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="••••••••"]').type(testPassword);
    cy.contains('เข้าสู่ระบบ').click();
    cy.contains('อีเมลหรือรหัสผ่านไม่ถูกต้อง').should('exist');
  });

});




