context("Basic", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should be on the home page", () => {
    cy.url().should("eq", "http://localhost:5050/");
  });

  it("should be able to naviagate to the interactive map", () => {
    cy.get('.menu-item[href="/interactive-map"]')
      .click()
      .url()
      .should("eq", "http://localhost:5050/interactive-map");
  });
});
