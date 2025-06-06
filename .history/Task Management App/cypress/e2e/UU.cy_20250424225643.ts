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
  cy.get('input[placeholder="Title"]').type('Task เดิม');
  cy.get('input[placeholder="Description"]').type('Description เดิม');
  cy.get('.ant-select').click();
  cy.get('.ant-select-item-option-content').contains('Pending').click();
  cy.contains('Create Task').click();
  cy.wait('@createTask');

  // Step 3: Click Edit on the newly created task
  cy.get('button').filter(':contains("Edit")').first().click();

  // กดปุ่ม Edit
cy.get('button').contains('Edit').first().click();

// รอ modal โผล่
cy.get('.ant-modal').should('exist');

cy.get('.edit-task-dialog').should('exist').within(() => {
  cy.get('input[placeholder="Title"]').clear().type('Task ใหม่');
  cy.get('input[placeholder="Description"]').clear().type('Description ใหม่');
  cy.contains('Save').click();
});



});



















