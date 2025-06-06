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

  // Step 4: Define updated values
  const updatedTitle = 'Task ที่แก้ไขแล้ว';
  const updatedDescription = 'Description ที่เปลี่ยนแล้ว';
  const updatedStatus = 'Completed';

  // Step 5: Ensure the "Editing Task" section is visible
  cy.contains('Editing Task').should('be.visible');

  // Step 6: Edit the Title in the "Editing Task" section
  cy.get('input[placeholder="Title"]')
    .should('be.visible')
    .clear()  // ลบข้อความเดิมทั้งหมด
    .type(updatedTitle)  // ใช้ updatedTitle
    .should('have.value', updatedTitle);  // ตรวจสอบว่า Title ถูกอัปเดตแล้ว

  // Step 7: Edit the Description
  cy.get('input[placeholder="Description"]')
    .should('be.visible')
    .clear()  // ลบข้อความเดิมทั้งหมด
    .type(updatedDescription)  // ใช้ updatedDescription
    .should('have.value', updatedDescription);  // ตรวจสอบว่า Description ถูกอัปเดตแล้ว

  // Step 8: Change the Status
  cy.get('.ant-select').click();
  cy.get('.ant-select-item-option-content').contains(updatedStatus).click(); // เปลี่ยนสถานะเป็น Completed

  // Step 9: Save the updated task
  cy.contains('Save').click();

  // Step 10: Verify that the task is updated
  cy.contains(updatedTitle).should('exist');
  cy.contains(updatedDescription).should('exist');
  cy.contains(updatedStatus).should('exist');
});















