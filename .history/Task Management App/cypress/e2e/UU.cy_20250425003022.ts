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

 // กดปุ่ม Edit ของ task ตัวแรก
cy.contains('Edit').first().click();

// รอ modal โผล่ก่อนแล้วจัดการข้างใน
cy.get('[role="dialog"]').should('exist').within(() => {
  // เปลี่ยน Title
  cy.get('input[placeholder="Title"]')
    .clear()
    .type('Task ใหม่');

  // เปลี่ยน Description
  cy.get('input[placeholder="Description"]')
    .clear()
    .type('Description ใหม่');

  // เปลี่ยน Status
  cy.get('.ant-select').click(); // เปิด dropdown
  cy.get('.ant-select-item-option-content')
    .contains('Completed')
    .click(); // เลือก Completed

  // กด Save
  cy.contains('Save').click();


// เช็คว่าข้อมูลใหม่ขึ้นเรียบร้อย
cy.contains('Task ใหม่').should('exist');
cy.contains('Description ใหม่').should('exist');
cy.contains('Completed').should('exist');


});



















