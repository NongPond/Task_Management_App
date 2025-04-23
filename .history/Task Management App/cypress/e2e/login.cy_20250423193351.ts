describe('Login Page', () => {
  const correctEmail = 'testuser@example.com';
  const correctPassword = 'Test1234';

  beforeEach(() => {
    cy.visit('/');
  });

  it('1. Logs in successfully with correct credentials', () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-token',
        email: correctEmail,
      },
    }).as('login');

    cy.get('[data-cy="login-email"]').type(correctEmail);
    cy.get('[data-cy="login-password"]').type(correctPassword);
    cy.get('[data-cy="login-button"]').click();

    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/tasks');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.eq('fake-token');
    });
  });

  it('2. Shows error for incorrect credentials', () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 401,
    }).as('login');

    cy.get('[data-cy="login-email"]').type('wrong@example.com');
    cy.get('[data-cy="login-password"]').type('WrongPass');
    cy.get('[data-cy="login-button"]').click();

    cy.wait('@login');
    cy.contains('❌ อีเมลหรือรหัสผ่านไม่ถูกต้อง').should('exist');
  });

  it('3. Shows validation errors for empty fields', () => {
    cy.get('[data-cy="login-button"]').click();
    cy.contains('กรุณากรอกอีเมล').should('exist');
    cy.contains('กรุณากรอกรหัสผ่าน').should('exist');
  });

  it('4. Shows error if password is too short', () => {
    cy.get('[data-cy="login-email"]').type('short@example.com');
    cy.get('[data-cy="login-password"]').type('123');
    cy.get('[data-cy="login-button"]').click();
    cy.contains('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร').should('exist');
  });

  it('5. Shows loading indicator and disables button', () => {
    cy.intercept('POST', '**/api/auth/login', (req) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({
          statusCode: 200,
          body: {
            token: 'fake-token',
            email: correctEmail,
          },
        }), 1000);
      });
    }).as('loginDelayed');

    cy.get('[data-cy="login-email"]').type(correctEmail);
    cy.get('[data-cy="login-password"]').type(correctPassword);
    cy.get('[data-cy="login-button"]').click();

    cy.contains('กำลังเข้าสู่ระบบ...').should('exist');
    cy.get('[data-cy="login-button"]').should('be.disabled');

    cy.wait('@loginDelayed');
    cy.url().should('include', '/tasks');
  });
});
