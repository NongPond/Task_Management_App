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
  const taskTitle = 'Test Task for Editing'; // Title for the new task
  cy.get('input[placeholder="Title"]').type(taskTitle); // Enter task title
  cy.get('input[placeholder="Description"]').type('This task will be edited later.'); // Enter task description
  cy.get('.ant-select').click();
  cy.get('.ant-select-item-option-content').contains('Pending').click(); // Set task status to "Pending"

  cy.contains('Create Task').click(); // Click create task button
  cy.wait('@createTask'); // Wait for the create task API request to complete

  // Step 3: Ensure task is created and appears in the list under "Your Tasks"
  cy.contains(taskTitle).should('be.visible'); // Check if the task is listed

  // Step 4: Click Edit on the created task to go into "Editing Task"
  cy.contains('Edit').first().click(); // Click the Edit button for the task

  // Step 5: In the "Editing Task" form, update the task details
  const updatedTitle = '✅ Edited Task'; // New title for the task
  const updatedDescription = 'This is the updated description of the task.'; // New description

  // Update the title and description in the "Editing Task" form
  cy.get('input[placeholder="Title"]').should('have.value', updatedTitle);
cy.get('input[placeholder="Description"]').should('have.value', updatedDescription);

  // Step 6: Save the changes
  cy.contains('Save').click(); 
  cy.wait('@updateTask'); // Wait for the update task API request to complete

  // Step 7: Verify the updated task appears in the list with the new title and description
  cy.contains(updatedTitle).should('exist'); // Ensure the updated title is displayed in the task list
  cy.contains(updatedDescription).should('exist'); // Ensure the updated description is displayed in the task list
});









