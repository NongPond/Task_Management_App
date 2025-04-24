  
  // Step 3: Ensure task is created and appears
  cy.contains(taskTitle).should('be.visible');

  // Step 4: Click Edit button of the created task
  cy.contains(taskTitle)
    .parents('.ant-card') // หรือ class/element ที่ครอบ task นั้น
    .within(() => {
      cy.contains('Edit').click();
    });











