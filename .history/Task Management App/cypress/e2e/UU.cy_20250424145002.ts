// ค่าที่จะใช้แก้ไขในขั้นตอน Edit
const updatedTitle = 'Task ที่แก้ไขแล้ว';
const updatedDescription = 'Description ที่เปลี่ยนแล้ว';
const updatedStatus = 'Completed';

// สร้าง Task ใหม่ (ใช้ taskTitle และ taskDescription เดิม)
const taskTitle = 'Task เดิม';
const taskDescription = 'Description เดิม';

// Step 1: Login
cy.get('input[placeholder="you@example.com"]').type('11111100000@gmail.com');
cy.get('input[placeholder="••••••••"]').type('Pondza123456789');
cy.get('button').contains('เข้าสู่ระบบ').click();
cy.wait('@loginRequest');
cy.url().should('include', '/tasks');

// Step 2: Create a New Task with taskTitle and taskDescription (ค่าดั้งเดิม)
cy.get('input[placeholder="Title"]').type(taskTitle);
cy.get('input[placeholder="Description"]').type(taskDescription);
cy.get('.ant-select').click();
cy.get('.ant-select-item-option-content').contains('Pending').click();
cy.contains('Create Task').click();
cy.wait('@createTask');

// Step 3: Ensure the task is created and appears
cy.contains(taskTitle).should('be.visible');

// Step 4: Click Edit button of the created task
cy.get('button').contains('Edit').first().click();

// Step 5: Wait for the "Editing Task" section to load
cy.contains('Editing Task').should('be.visible');

// Step 6: Update task details using updatedTitle, updatedDescription, and updatedStatus
cy.get('input[placeholder="Title"]')
  .click()
  .type('{selectall}{backspace}')  // ลบข้อความเดิมทั้งหมด
  .type(updatedTitle)  // ใช้ updatedTitle แทน taskTitle
  .should('have.value', updatedTitle);  // ตรวจสอบว่า value ถูกอัพเดท

cy.get('input[placeholder="Description"]')
  .click()
  .type('{selectall}{backspace}')  // ลบข้อความเดิมทั้งหมด
  .type(updatedDescription)  // ใช้ updatedDescription แทน taskDescription
  .should('have.value', updatedDescription);  // ตรวจสอบว่า value ถูกอัพเดท

cy.get('.ant-select').click();
cy.get('.ant-select-item-option-content').contains(updatedStatus).click();  // เปลี่ยน status เป็น Completed

// Step 7: Save the updated task
cy.contains('Save').click();

// Step 8: Verify the updated task appears in the task list
cy.contains(updatedTitle).should('exist');
cy.contains(updatedDescription).should('exist');
cy.contains(updatedStatus).should('exist');












