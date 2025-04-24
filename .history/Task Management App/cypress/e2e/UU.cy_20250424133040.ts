it('Creates a task, clicks Edit, and updates it in the "Editing Task" section', () => {
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

  // Step 2: Create a New Task
  const taskTitle = 'Test Task for Editing';
  const taskDescription = 'This task will be edited later.';
  cy.get('input[placeholder="Title"]').type(taskTitle);
  cy.get('input[placeholder="Description"]').type(taskDescription);
  cy.get('.ant-select').click();
  cy.get('.ant-select-item-option-content').contains('Pending').click();
  cy.contains('Create Task').click();
  cy.wait('@createTask');

  // Step 3: Ensure task is created and appears
  cy.contains(taskTitle).should('be.visible');

// Find the task by title, then locate its Edit button
cy.contains(taskTitle)
  .parents('[data-testid="task-card"]') // หรือ element ที่ครอบ card task
  .find('button')
  .contains('Edit')
  .click();


// Wait for form to populate values
cy.get('input[placeholder="Title"]').should(($input) => {
  expect($input.val()).to.eq(taskTitle);
});
cy.get('input[placeholder="Description"]').should(($input) => {
  expect($input.val()).to.eq(taskDescription);
});

  // Step 6: Update values
  const updatedTitle = '✅ Edited Task';
  const updatedDescription = 'This is the updated description of the task.';
  cy.get('input[placeholder="Title"]').clear().type(updatedTitle);
  cy.get('input[placeholder="Description"]').clear().type(updatedDescription);

  // Confirm the new values are typed correctly
  cy.get('input[placeholder="Title"]').should('have.value', updatedTitle);
  cy.get('input[placeholder="Description"]').should('have.value', updatedDescription);

  // Step 7: Save the changes
  cy.contains('Save').click(); 
  cy.wait('@updateTask');

  // Step 8: Check updated values appear in task list
  cy.contains(updatedTitle).should('exist');
  cy.contains(updatedDescription).should('exist');
});










