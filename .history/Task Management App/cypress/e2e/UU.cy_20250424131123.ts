it('Creates a task, edits it, and saves the changes', () => {
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

  // Step 2: Create a New Task with a specific title
  const taskTitle = 'Test Task for Editing';
  cy.get('input[placeholder="Title"]').type(taskTitle);
  cy.get('input[placeholder="Description"]').type('This task will be edited later.');
  cy.get('.ant-select').click();
  cy.get('.ant-select-item-option-content').contains('Pending').click();

  cy.contains('Create Task').click();
  cy.wait('@createTask');

  // Step 3: Ensure task is created and appears in the list
  cy.contains(taskTitle).should('be.visible'); // Ensure the task appears in the list after creation

  // Step 4: Edit the created task by clicking the Edit button
  cy.contains(taskTitle).parents('.ant-card').within(() => {
    cy.contains('Edit').click(); // Click the Edit button
  });

  // Step 5: Update the task details in the Edit form
  const updatedTitle = '✅ Edited Task';
  const updatedDescription = 'This is the updated description of the task.';

  cy.get('input[placeholder="Title"]').clear().type(updatedTitle); // Update the title in the Edit form
  cy.get('input[placeholder="Description"]').clear().type(updatedDescription); // Update the description
  cy.get('.ant-select').click(); // Ensure status is still selected
  cy.get('.ant-select-item-option-content').contains('Pending').click(); // Select the status

  cy.contains('Save').click(); // Save the changes
  cy.wait('@updateTask');

  // Step 6: Verify the updated task appears in the list with the new title and description
  cy.contains(updatedTitle).should('exist'); // Ensure the updated title is displayed
  cy.contains(updatedDescription).should('exist'); // Ensure the updated description is displayed
});








