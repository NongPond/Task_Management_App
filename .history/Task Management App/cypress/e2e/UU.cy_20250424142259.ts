it('Creates a task, clicks Edit, and updates it in the "Editing Task" section', () => {
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

  // Step 2: Create a New Task
  const taskTitle = 'Test Task for Editing';
  const taskDescription = 'This task will be edited later.';
  cy.get('input[placeholder="Title"]').type(taskTitle);
  cy.get('input[placeholder="Description"]').type(taskDescription);
  cy.get('.ant-select').click();
  cy.get('.ant-select-item-option-content').contains('Pending').click();
  cy.contains('Create Task').click();
  cy.wait('@createTask');

  // Step 3: Confirm it was created
  cy.contains(taskTitle).should('be.visible');

  // Step 4: Click Edit
  cy.contains(taskTitle)
    .parent() // ไปที่ container ของ task นั้น
    .within(() => {
      cy.get('button').contains('Edit').click();
    });

  // Step 5: รอให้ form แสดงค่าที่ถูกต้องก่อนค่อยแก้
  cy.contains('Editing Task')
    .parent()
    .within(() => {
      cy.get('input[placeholder="Title"]')
        .should('have.value', taskTitle) // ✅ รอจนค่าถูก set
        .clear()
        .type('Updated Task Title');

      cy.get('input[placeholder="Description"]')
        .should('have.value', taskDescription)
        .clear()
        .type('Edited description.');

      // ถ้าต้องเปลี่ยนสถานะด้วย
      cy.get('.ant-select').click();
      cy.get('.ant-select-item-option-content').contains('Completed').click();

      cy.contains('Save').click();
    });

  cy.wait('@updateTask');

  // Step 6: เช็คค่าที่เปลี่ยนแล้ว
  cy.contains('Updated Task Title').should('exist');
  cy.contains('Edited description.').should('exist');
});










