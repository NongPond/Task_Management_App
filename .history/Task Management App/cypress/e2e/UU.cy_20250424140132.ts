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

  // Step 4: Click Edit button of the created task
  cy.get('button')
    .filter(':contains("Edit")') // ปุ่มที่มีคำว่า Edit
    .first()
    .click();

  // Step 5: Wait for the Editing Task section to load
  cy.contains('Editing Task').should('be.visible'); // Ensure Editing Task is displayed

  // Step 6: Update task details in the "Editing Task" section
  const updatedTitle = '📝 Updated Task Title';
  const updatedDescription = 'This task was modified via test.';

  cy.get('input[placeholder="Title"]').should('be.visible').clear().type(updatedTitle); // Wait for input and clear it
  cy.get('input[placeholder="Description"]').should('be.visible').clear().type(updatedDescription);

  // Save changes
  cy.contains('Save').click();
  cy.wait('@updateTask');

  // Step 7: Verify the updated task appears in the task list
  cy.contains(updatedTitle).should('exist');
  cy.contains(updatedDescription).should('exist');
});












