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
  
  it('Logs in and redirects to task page', () => {
    cy.visit('/');
    
    cy.get('input[placeholder="you@example.com"]').type('godpondza11@gmail.com');
    cy.get('input[placeholder="••••••••"]').type('GodPondza12');
    
    cy.contains('เข้าสู่ระบบ').click();
    
    cy.url().should('include', '/tasks'); // Fail ถ้า login ไม่ success หรือ email ไม่อยู่ใน localStorage
    cy.contains('Task Manager').should('exist');
  });
  
});



