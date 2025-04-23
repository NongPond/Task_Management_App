describe('Task Manager App', () => {
  const testEmail = 'testuser@gG.com';
  const testPassword = 'TestPass123';

  it('Registers a new user successfully', () => {
    cy.visit('/register');
    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="••••••••"]').type(testPassword);
    cy.contains('สมัครสมาชิก').click();
    cy.url().should('include', '/');
  });

  it('Logs in and redirects to task page', () => {
    cy.visit('/');
  
    cy.get('input[placeholder="you@example.com"]').type('godpondza11@gmail.com');
    cy.get('input[placeholder="••••••••"]').type('GodPondza12');
    cy.contains('เข้าสู่ระบบ').click();
  
    // รอจนกระทั่งหน้าเปลี่ยนหรือ component บางอย่างโหลดแล้ว
    cy.url({ timeout: 10000 }).should('include', '/tasks'); // รอได้นานขึ้น
  
    // ตรวจสอบว่ามี element ของหน้า tasks
    cy.contains('Task Manager', { timeout: 10000 }).should('exist');
  });
  
  
  

  it('Fails login with wrong password', () => {
    cy.visit('/');
    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="••••••••"]').type('WrongPassword');
    cy.contains('เข้าสู่ระบบ').click();
    cy.contains('อีเมลหรือรหัสผ่านไม่ถูกต้อง').should('exist');
  });

  it('Creates a new task successfully', () => {
    cy.get('input[placeholder="Title"]').type('My Test Task');
    cy.get('input[placeholder="Description"]').type('Task description');
    cy.get('.ant-select').click();
    cy.contains('In Progress').click();
    cy.contains('Create Task').click();
    cy.contains('My Test Task').should('exist');
  });

  it('Shows error when creating task without title', () => {
    cy.get('input[placeholder="Title"]').clear();
    cy.contains('Create Task').click();
    cy.contains('Title is required').should('exist');
  });

  it('Edits a task', () => {
    cy.contains('Edit').first().click();
    cy.get('input').first().clear().type('Updated Task');
    cy.contains('Save').click();
    cy.contains('Updated Task').should('exist');
  });

  it('Deletes a task', () => {
    cy.contains('Delete').first().click();
    cy.contains('Updated Task').should('not.exist');
  });

  it('Logs out successfully', () => {
    cy.contains('Logout').click();
    cy.url().should('include', '/');
  });
});



