describe('Task Manager App', () => {
  const testEmail = 'godpondza11@gmail.com';
  const testPassword = 'GodPondza12';

  it('Registers a new user successfully', () => {
    cy.visit('/register');
    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="••••••••"]').type(testPassword);
    cy.contains('สมัครสมาชิก').click();
    
    // ตรวจสอบว่ามีการ redirect ไปยังหน้า login หรือหน้าอื่น
    cy.url().should('include', '/'); // หรือหน้าใหม่ที่คาดหวัง
  });
  
  

  it('Logs in with correct credentials', () => {
    cy.visit('/');
  
    // intercept url ให้ตรงกับที่ระบบยิงจริงๆ
    cy.intercept('POST', '**/api/auth/login').as('login');
  
    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="••••••••"]').type(testPassword);
    cy.contains('เข้าสู่ระบบ').click();
  
    cy.wait('@login'); // รอ login เสร็จก่อน
    cy.url().should('include', '/tasks'); // รอ redirect
    cy.contains('📝 Task Manager').should('exist'); // หรือข้อความที่มีในหน้า dashboard
  });
  
  

  it('Creates a new task successfully', () => {
    cy.get('input[placeholder="Title"]').type('Test Task');
    cy.get('input[placeholder="Description"]').type('This is a test description');
    cy.get('.ant-select').click();
    cy.contains('In Progress').click();
    cy.contains('Create Task').click();
    cy.contains('Test Task').should('exist');
  });

  it('Shows error when creating task without title', () => {
    cy.get('input[placeholder="Title"]').clear();
    cy.contains('Create Task').click();
    cy.contains('Title is required').should('exist');
  });

  it('Edits a task', () => {
    cy.contains('Edit').first().click();
    cy.get('input').first().clear().type('Updated Task Title');
    cy.contains('Save').click();
    cy.contains('Updated Task Title').should('exist');
  });

  it('Deletes a task', () => {
    cy.contains('Delete').first().click();
    cy.contains('Updated Task Title').should('not.exist');
  });

  it('Logs out successfully', () => {
    cy.contains('Logout').click();
    cy.url().should('include', '/');
  });
});

