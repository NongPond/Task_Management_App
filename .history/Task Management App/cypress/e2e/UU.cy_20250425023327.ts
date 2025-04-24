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
  cy.get('.ant-select-item-option-content').contains('Completed').click();
  cy.contains('Create Task').click();
  cy.wait('@createTask');

    // กดปุ่ม Edit
    cy.contains('Edit').first().click();

    // scope เข้าไปใน Card ที่ title เป็น "Editing Task"
    cy.contains('.ant-card-head-title', 'Editing Task')
      .closest('.ant-card')
      .within(() => {
        // แก้ Title (input ตัวแรก)
        cy.get('input').eq(0)
          .clear()
          .type('Task ใหม่');
  
        // แก้ Description (input ตัวที่สอง)
        cy.get('input').eq(1)
          .clear()
          .type('Description ใหม่');
  
          // 3. เปิด Select ด้วย selector แล้วพิมพ์ชื่อ + Enter
        cy.get('.ant-select-selector')
        .click({ force: true })  // บังคับให้คลิก
        .get('.ant-select-selection-search-input')
        .type('Pending{enter}', { force: true });  // บังคับให้พิมพ์ได้


          cy.contains('button', 'Save').click();
        });
        cy.contains('.ant-card', 'Task ใหม่').should('exist');
cy.contains('.ant-card', 'Description ใหม่').should('exist');
cy.contains('.ant-card', 'Pending').should('exist');
});
  




















