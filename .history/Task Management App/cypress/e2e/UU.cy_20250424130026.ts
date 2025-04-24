it('Edits a task', () => {
  cy.visit('/');
  
  cy.intercept('POST', '**/login').as('loginRequest');

  cy.get('input[placeholder="you@example.com"]').type('11111100000@gmail.com');
  cy.get('input[placeholder="••••••••"]').type('Pondza123456789');
  cy.get('button').contains('เข้าสู่ระบบ').click();

  cy.wait('@loginRequest');
  cy.url().should('include', '/tasks');

  // Ensure tasks are loaded before editing
   // Intercept update
cy.intercept('PUT', '**/tasks/**').as('updateTask');

// Edit task
cy.contains('Edit').first().click();
cy.get('input[placeholder="Title"]').clear().type('Updated Task');

cy.contains('Save').click();
cy.wait('@updateTask');

// Debug
cy.wait(500); // รอให้ UI refresh
cy.contains('Updated Task').should('exist'); // หรือใช้ get().should('contain.text', ...)
});
