  // Step 3: Ensure task is created and appears
  cy.contains(taskTitle).should('be.visible');

  // Step 4: Click Edit button of the created task
  cy.contains(taskTitle)
    .parents('.ant-card') // หรือ class/element ที่ครอบ task นั้น
    .within(() => {
      cy.contains('Edit').click();
    });


  // Step 3: Ensure task is created and appears
  cy.contains(taskTitle).should('be.visible');

  // Find the task by title, then locate its Edit button
  cy.contains(taskTitle)
    .parents('[data-testid="task-card"]') // หรือ element ที่ครอบ card task
    .find('button')
    .contains('Edit')
    .click();


// Wait for form to populate values
cy.get('input[placeholder="Title"]').should(($input) => {
  expect($input.val()).to.eq(taskTitle);
});
cy.get('input[placeholder="Description"]').should(($input) => {
  expect($input.val()).to.eq(taskDescription);
});

  // Step 6: Update values
  const updatedTitle = '✅ Edited Task';
  const updatedDescription = 'This is the updated description of the task.';
  cy.get('input[placeholder="Title"]').clear().type(updatedTitle);
  cy.get('input[placeholder="Description"]').clear().type(updatedDescription);

  // Confirm the new values are typed correctly
  cy.get('input[placeholder="Title"]').should('have.value', updatedTitle);
  cy.get('input[placeholder="Description"]').should('have.value', updatedDescription);

  // Step 7: Save the changes
  cy.contains('Save').click(); 
  cy.wait('@updateTask');

  // Step 8: Check updated values appear in task list
  cy.contains(updatedTitle).should('exist');
  cy.contains(updatedDescription).should('exist');
});










