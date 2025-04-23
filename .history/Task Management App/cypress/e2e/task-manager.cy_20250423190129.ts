/// <reference types="cypress" />

describe('Task Manager App', () => {
  const testEmail = 'godpondza11@gmail.com';
  const testPassword = 'GodPondza12';

  it('Registers a new user successfully', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register').as('register');
    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="••••••••"]').type(testPassword);
    cy.contains('สมัครสมาชิก').click();

    cy.wait('@register');
    cy.get('.ant-message-notice-content', { timeout: 10000 })
      .should('contain', 'สมัครสมาชิกสำเร็จ');

    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('Logs in with correct credentials', () => {
    cy.visit('/');

    cy.intercept('POST', '/api/auth/login').as('login');
    cy.get('input[placeholder="you@example.com"]').type(testEmail);
    cy.get('input[placeholder="••••••••"]').type(testPassword);
    cy.contains('เข้าสู่ระบบ').click();

    cy.wait('@login');
    cy.url().should('include', '/tasks');

    cy.contains('📝 Task Manager').should('be.visible');
  });

  it('Creates a new task successfully', () => {
    cy.get('input[placeholder="Title"]').type('Test Task');
    cy.get('input[placeholder="Description"]')
      .type('This is a test description');
    cy.get('.ant-select').click();
    cy.contains('In Progress').click();
    cy.contains('Create Task').click();

    cy.contains('Test Task').should('exist');
  });

  it('Shows error when creating task without title', () => {
    cy.get('input[placeholder="Title"]').clear();
    cy.contains('Create Task').click();

    cy.get('.ant-form-item-explain-error')
      .should('contain', 'Title is required');
  });

  it('Edits a task', () => {
    cy.contains('Edit').first().click();
    cy.get('input[placeholder="Title"]').clear().type('Updated Task Title');
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


