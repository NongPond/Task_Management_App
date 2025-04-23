describe('Task Manager App', () => {
  const testEmail = 'godpondza11@gmail.com';
  const testPassword = 'GodPondza12';

  // Intercept the login API request before each test
  beforeEach(() => {
    cy.intercept('POST', '**/api/auth/login').as('login');
    cy.intercept('POST', '**/api/auth/register').as('register'); // To intercept register API call as well
  });

  it('Registers a new user successfully', () => {
    cy.visit('/register');
    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="••••••••"]').type(testPassword);
    cy.contains('สมัครสมาชิก').click();
    cy.wait('@register'); // Wait for the registration request to complete
    cy.url().should('include', '/'); // Check redirection after successful registration
  });

  it('Logs in with correct credentials', () => {
    cy.visit('/');
    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="••••••••"]').type(testPassword);
    cy.contains('เข้าสู่ระบบ').click();
  
    // Wait for login and check URL and UI for successful login
    cy.wait('@login'); 
    cy.url().should('include', '/tasks'); // Ensure redirection to tasks page
    cy.contains('📝 Task Manager').should('exist'); // Ensure the tasks page UI is loaded
  });

  it('Creates a new task successfully', () => {
    // First, log in before creating a task
    cy.login(testEmail, testPassword); // Assuming login helper exists or you can use the login process here

    cy.get('input[placeholder="Title"]').type('Test Task');
    cy.get('input[placeholder="Description"]').type('This is a test description');
    cy.get('.ant-select').click();
    cy.contains('In Progress').click();
    cy.contains('Create Task').click();
    cy.contains('Test Task').should('exist'); // Verify that the task is created
  });

  it('Shows error on wrong login', () => {
    cy.visit('/');
    cy.get('input[placeholder="you@example.com"]').type('wrong@example.com');
    cy.get('input[placeholder="••••••••"]').type('WrongPassword');
    cy.contains('เข้าสู่ระบบ').click();
    cy.contains('❌ อีเมลหรือรหัสผ่านไม่ถูกต้อง').should('exist'); // Verify error message is shown
  });

  it('Edits a task', () => {
    // Ensure user is logged in before attempting task edit
    cy.login(testEmail, testPassword);

    cy.contains('Edit').first().click();
    cy.get('input').first().clear().type('Updated Task Title');
    cy.contains('Save').click();
    cy.contains('Updated Task Title').should('exist'); // Verify the task title is updated
  });

  it('Deletes a task', () => {
    // Ensure user is logged in before attempting task deletion
    cy.login(testEmail, testPassword);

    cy.contains('Delete').first().click();
    cy.contains('Updated Task Title').should('not.exist'); // Verify task was deleted
  });

  it('Logs out successfully', () => {
    cy.login(testEmail, testPassword); // Log in before logging out
    cy.contains('Logout').click();
    cy.url().should('include', '/'); // Ensure that the user is redirected to login page
  });
});



