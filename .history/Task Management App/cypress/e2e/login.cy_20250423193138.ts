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

    cy.get('input[placeholder="you@example.com"]').type(correctEmail);
    cy.get('input[placeholder="••••••••"]').type(correctPassword);
    cy.contains('เข้าสู่ระบบ').click();

    cy.wait('@login');
    cy.url().should('include', '/tasks');
  });

  it('2. Shows error for incorrect credentials', () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 401,
    }).as('login');

    cy.get('input[placeholder="you@example.com"]').type('wrong@example.com');
    cy.get('input[placeholder="••••••••"]').type('WrongPass');
    cy.contains('เข้าสู่ระบบ').click();

    cy.wait('@login');
    cy.contains('❌ อีเมลหรือรหัสผ่านไม่ถูกต้อง').should('exist');
  });

  it('3. Shows validation errors for empty fields', () => {
    cy.contains('เข้าสู่ระบบ').click();
    cy.contains('กรุณากรอกอีเมล').should('exist');
    cy.contains('กรุณากรอกรหัสผ่าน').should('exist');
  });

  it('4. Shows error if password is too short', () => {
    cy.get('input[placeholder="you@example.com"]').type('short@example.com');
    cy.get('input[placeholder="••••••••"]').type('123');
    cy.contains('เข้าสู่ระบบ').click();
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
        }), 1000); // ช้า 1 วิ
      });
    }).as('loginDelayed');

    cy.get('input[placeholder="you@example.com"]').type(correctEmail);
    cy.get('input[placeholder="••••••••"]').type(correctPassword);
    cy.contains('เข้าสู่ระบบ').click();

    cy.contains('กำลังเข้าสู่ระบบ...').should('exist');
    cy.get('button').should('be.disabled');

    cy.wait('@loginDelayed');
    cy.url().should('include', '/tasks');
  });
});
