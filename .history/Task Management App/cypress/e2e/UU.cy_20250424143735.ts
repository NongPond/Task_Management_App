it('สร้าง task แล้ว edit เพื่อเปลี่ยนข้อความใน Editing Task ได้สำเร็จ', () => {
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
  const taskTitle = 'Task เดิม';
  const taskDescription = 'Description เดิม';
  cy.get('input[placeholder="Title"]').type(taskTitle);
  cy.get('input[placeholder="Description"]').type(taskDescription);
  cy.get('.ant-select').click();
  cy.get('.ant-select-item-option-content').contains('Pending').click();
  cy.contains('Create Task').click();
  cy.wait('@createTask');

  // Step 3: Click Edit
  cy.get('button')
    .filter(':contains("Edit")') // ปุ่มที่มีคำว่า Edit
    .first()
    .click();

    const updatedTitle = 'Task ที่แก้ไขแล้ว';
    const updatedDescription = 'Description ที่เปลี่ยนแล้ว';
    const updatedStatus = 'Completed';
    
    cy.contains('Editing Task')
  .parent()
  .within(() => {
    cy.get('input[placeholder="Title"]').clear().type('Updated Title');
    cy.get('input[placeholder="Description"]').clear().type('Updated Description');
    cy.get('.ant-select').click();
    cy.get('.ant-select-item-option-content').contains('Completed').click();
    cy.contains('Save').click();
  });

    

});











