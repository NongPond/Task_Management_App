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

    // กด Edit ตัวแรก
cy.get('button').contains('Edit').first().click();

// แก้ข้อมูลใน Editing Task
cy.contains('.ant-card-head-title', 'Editing Task')
  .closest('.ant-card')
  .within(() => {
    cy.get('input').eq(0).clear().type('Task ใหม่');
    cy.get('input').eq(1).clear().type('Description ใหม่');
    cy.get('.ant-select').click();
  });

// เลือก Completed
cy.get('.ant-select-item-option-content').contains('Completed').click();

// Save
cy.contains('.ant-card-head-title', 'Editing Task')
  .closest('.ant-card')
  .within(() => {
    cy.get('button').contains('Save').click();
  });

// เช็คผลว่าข้อความเปลี่ยน
cy.contains('.ant-card', 'Task ใหม่').should('exist');
cy.contains('.ant-card', 'Description ใหม่').should('exist');
});
  




















