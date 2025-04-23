describe('Task Manager App', () => {
  const testEmail = 'godpondza@gmail.com';
  const testPassword = 'GodPondza12';

  it('Registers a new user successfully', () => {
    cy.visit('/register');
    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="••••••••"]').type(testPassword);
    cy.contains('สมัครสมาชิก').click();
    cy.url().should('include', '/');
  });

  
});



