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

  // Step 2: Create a New Task with a specific title
  const taskTitle = 'Test Task for Editing';
  cy.get('input[placeholder="Title"]').type(taskTitle);
  cy.get('input[placeholder="Description"]').type('This task will be edited later.');
  cy.get('.ant-select').click();
  cy.get('.ant-select-item-option-content').contains('Pending').click();

  cy.contains('Create Task').click();
  cy.wait('@createTask');

  // Step 3: Ensure task is created and appears in the list under "Your Tasks"
  cy.contains(taskTitle).should('be.visible'); // Ensure the task appears in the list after creation

  // Step 4: Click Edit on the created task to go to "Editing Task"
  cy.contains(taskTitle) // Find the created task in "Your Tasks"
    .parents('.ant-card') // Find its parent card
    .within(() => {
      cy.contains('Edit').click(); // Click the Edit button of the task
    });

  // Step 5: In the "Editing Task" form, update the task details
  const updatedTitle = '✅ Edited Task';
  const updatedDescription = 'This is the updated description of the task.';

  // Update the title and description in the "Editing Task" form
  cy.get('input[placeholder="Title"]').clear().type(updatedTitle); // Update the title
  cy.get('input[placeholder="Description"]').clear().type(updatedDescription); // Update the description

  // Save the changes
  cy.contains('Save').click(); 
  cy.wait('@updateTask');

  // Step 6: Verify the updated task appears in the list with the new title and description
  cy.contains(updatedTitle).should('exist'); // Ensure the updated title is displayed
  cy.contains(updatedDescription).should('exist'); // Ensure the updated description is displayed
});









