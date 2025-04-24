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

 // กดปุ่ม Edit ตัวแรก
 cy.contains('Edit').first().click();

 // รอ modal โผล่ก่อน
 cy.contains('Editing Task', { timeout: 5000 }).should('be.visible');
 
 // เปลี่ยน Title (ช่อง input)
 cy.get('input').clear().type('Task ใหม่');
 
 // เปลี่ยน Description (ช่อง textarea)
 cy.get('textarea').clear().type('Description ใหม่');
 
 // เปลี่ยน Status
 cy.get('.ant-select').click();
 cy.get('.ant-select-item-option-content').contains('Completed').click();
 
 // Save
 cy.contains('Save').click();
 
 // เช็คว่าข้อความใหม่แสดงผล
 cy.contains('Task ใหม่').should('exist');
 cy.contains('Description ใหม่').should('exist');
 cy.contains('Completed').should('exist');
 


});



















