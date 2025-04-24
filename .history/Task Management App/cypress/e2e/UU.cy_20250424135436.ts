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

  // Step 4: Find the exact task and click its Edit button
  cy.contains(taskTitle)
    .parentsUntil('.ant-list-item') // adjust this selector if needed
    .parent()
    .within(() => {
      cy.get('button').contains('Edit').click();
    });

  // Step 5: Update the task inside "Editing Task"
  const updatedTitle = '📝 Updated Task Title';
  const updatedDescription = 'This task was modified via test.';

  cy.contains('Editing Task')
    .parent()
    .within(() => {
      cy.get('input[placeholder="Title"]').clear().type(updatedTitle);
      cy.get('input[placeholder="Description"]').clear().type(updatedDescription);
      cy.contains('Save').click();
    });

  cy.wait('@updateTask');

  // Step 6: Check if updated task appears
  cy.contains(updatedTitle).should('exist');
  cy.contains(updatedDescription).should('exist');
});











