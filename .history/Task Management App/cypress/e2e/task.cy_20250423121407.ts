describe('Task Management App', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load homepage', () => {
    cy.contains('Task Management App')
  })
})
