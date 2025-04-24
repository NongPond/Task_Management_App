it('สร้าง task แล้ว edit เปลี่ยน Title, Status และ Description ได้สำเร็จ', () => {
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

  // Step 2: Create a task
  const originalTitle = 'Task เดิม';
  const originalDescription = 'Description เดิม';
  cy.get('input[placeholder="Title"]').type(originalTitle);
  cy.get('input[placeholder="Description"]').type(originalDescription);
  cy.get('.ant-select').click();
  cy.get('.ant-select-item-option-content').contains('Pending').click();
  cy.contains('Create Task').click();
  cy.wait('@createTask');

  // Step 3: Click Edit on the newly created task
  cy.contains(originalTitle).parents('[data-testid="task-card"]').within(() => {
    cy.get('button').filter(':contains("Edit")').first().click();
  });

  // Step 4: Update the task in the edit modal/form
  const updatedTitle = 'Task ที่แก้ไขแล้ว';
  const updatedDescription = 'Description ที่เปลี่ยนแล้ว';
  const updatedStatus = 'Completed';

  cy.get('input[placeholder="Title"]')
    .clear()
    .type(updatedTitle)
    .should('have.value', updatedTitle);

  cy.get('input[placeholder="Description"]')
    .clear()
    .type(updatedDescription)
    .should('have.value', updatedDescription);

  cy.get('.ant-select').click();
  cy.get('.ant-select-item-option-content').contains(updatedStatus).click();

  // Step 5: Save the updated task
  cy.contains('Save').click();
  cy.wait('@updateTask');

  // Step 6: Verify the updated task appears correctly
  cy.contains(updatedTitle).should('exist');
  cy.contains(updatedDescription).should('exist');
  cy.contains(updatedStatus).should('exist');
});



















