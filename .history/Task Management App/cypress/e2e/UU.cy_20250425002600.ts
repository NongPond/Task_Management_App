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

  // กดปุ่ม Edit
cy.contains('Edit').first().click();

// รอ modal โผล่ (ใช้ role="dialog" เพราะ generic และชัวร์)
cy.get('[role="dialog"]').should('exist').within(() => {
  // แก้ Title
  cy.get('input[placeholder="Title"]')
    .clear()
    .type('Task ใหม่');

  // แก้ Description
  cy.get('input[placeholder="Description"]')
    .clear()
    .type('Description ใหม่');

  // เปลี่ยน status
  cy.get('.ant-select').click();
  cy.get('.ant-select-item-option-content').contains('Completed').click();

  // กด save
  cy.contains('Save').click();
});

});



















