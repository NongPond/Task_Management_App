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

  // 2. กดปุ่ม Edit ของ task ตัวแรก (เช็คว่า Edit ปรากฏ)
  cy.contains('Edit').first().click();

  // 3. รอให้ฟอร์มแก้ไขแสดงขึ้นมา (ตรวจสอบว่า title เป็น 'Editing Task')
  cy.contains('Editing Task').should('be.visible');

  // 4. แก้ไขข้อมูลในฟอร์ม
  cy.get('input').eq(0).clear().type('Task ใหม่');  // แก้ไข title
  cy.get('textarea').clear().type('Description ใหม่');  // แก้ไข description
  cy.get('.ant-select').click();  // คลิกเลือกสถานะ


  // 5. กด Save เพื่อบันทึกการแก้ไข
  cy.contains('Save').click();

  // 6. เช็คว่า task ได้รับการอัพเดท
  cy.contains('Task ใหม่').should('exist');  // ตรวจสอบว่า title แก้ไขเป็น Task ใหม่
  cy.contains('Description ใหม่').should('exist');  // ตรวจสอบว่า description แก้ไขเป็น Description ใหม่
  cy.contains('Completed').should('exist');  // ตรวจสอบว่า status แก้ไขเป็น Completed
});
  




















