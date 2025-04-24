it('Creates and edits a task', () => {
  cy.visit('/');
  cy.intercept('POST', '**/login').as('loginRequest');
  cy.intercept('POST', '**/tasks').as('createTask');
  cy.intercept('PUT', '**/tasks/**').as('updateTask');

  // Step 1: Login
  cy.get('input[placeholder="you@example.com"]').type('11111100000@gmail.com');
  cy.get('input[placeholder="••••••••"]').type('Pondza123456789');
  cy.get('button').contains('เข้าสู่ระบบ').click();
  cy.wait('@loginRequest');
  cy.url().should('include', '/tasks');

  // Step 2: Create Task
  const taskTitle = 'Test Task for Editing';
  cy.get('input[placeholder="Title"]').type(taskTitle);
  cy.get('input[placeholder="Description"]').type('This task will be edited.');
  cy.get('.ant-select').click();
  cy.get('.ant-select-item-option-content').contains('Pending').click();

  cy.contains('Create Task').click();
  cy.wait('@createTask');

  // Step 3: Edit the created task
  cy.contains(taskTitle).parents('.ant-card').within(() => {
    cy.contains('Edit').click();
  });

  const updatedTitle = '✅ Task Edited';
  cy.get('input').first().clear().type(updatedTitle);
  cy.contains('Save').click();
  cy.wait('@updateTask');

  // Step 4: Verify updated title is shown
  cy.contains(updatedTitle).should('exist');
});

