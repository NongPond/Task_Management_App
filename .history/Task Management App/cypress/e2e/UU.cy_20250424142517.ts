it('Creates a task, clicks Edit, and updates it in the "Editing Task" section', () => {
  cy.visit('/');

  // Intercept login and task API requests
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
  const taskTitle = 'Test Task for Editing'; // You can change this to any title you want to test
  const taskDescription = 'This task will be edited later.'; // You can change this to any description you want
  cy.get('input[placeholder="Title"]').type(taskTitle);
  cy.get('input[placeholder="Description"]').type(taskDescription);
  cy.get('.ant-select').click();
  cy.get('.ant-select-item-option-content').contains('Pending').click();
  cy.contains('Create Task').click();
  cy.wait('@createTask');

  // Step 3: Ensure task is created and appears
  cy.contains(taskTitle).should('be.visible');

  // Step 4: Click Edit button of the created task
  cy.get('button')
    .filter(':contains("Edit")') // ปุ่มที่มีคำว่า Edit
    .first()
    .click();

  // Step 5: Wait for the "Editing Task" section to load
  cy.contains('Editing Task').should('be.visible');

  // Step 6: Define the new values for editing
  const updatedTitle = 'Updated Task Title'; // You can change this value to test
  const updatedDescription = 'This task was modified via test.'; // You can change this value to test
  const updatedStatus = 'Completed'; // You can change the status to another value

  // Step 7: Update task details in the "Editing Task" section
  cy.contains('Editing Task')
  .parent()
  .within(() => {
    // Optional edits
    if (updatedTitle) cy.get('input[placeholder="Title"]').clear().type(updatedTitle);
    if (updatedDescription) cy.get('input[placeholder="Description"]').clear().type(updatedDescription);
    if (updatedStatus) {
      cy.get('.ant-select').click();
      cy.get('.ant-select-item-option-content').contains(updatedStatus).click();
    }

    cy.contains('Save').click();
});

});










