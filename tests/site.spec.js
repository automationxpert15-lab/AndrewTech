const { test, expect } = require("@playwright/test");

test.describe("Consultant website smoke tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads the homepage and displays the main heading", async ({ page }) => {
    await expect(page).toHaveTitle(/Andrew Tech/);
    await expect(
      page.getByRole("heading", {
        name: /Software engineered for performance, reliability and growth/i
      })
    ).toBeVisible();
  });

  test("shows all six service cards", async ({ page }) => {
    await page.getByRole("link", { name: "Services" }).click();
    await expect(page.locator("#services article")).toHaveCount(6);
    await expect(page.getByRole("heading", { name: "AI Integration" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Test Automation" })).toBeVisible();
  });

  test("navigates to the contact form", async ({ page }) => {
    await page.getByRole("link", { name: "Discuss Your Project" }).click();
    await expect(page.locator("#contact")).toBeInViewport();
    await expect(page.getByLabel("Name")).toBeVisible();
  });

  test("shows validation when the form is empty", async ({ page }) => {
    await page.getByRole("button", { name: "Send Enquiry" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Please complete all required fields correctly."
    );
  });

  test("accepts valid contact form details", async ({ page }) => {
    await page.getByLabel("Name").fill("Test Client");
    await page.getByLabel("Email").fill("client@example.com");
    await page.getByLabel("Service").selectOption({ label: "AI integration" });
    await page.getByLabel("Project details").fill(
      "We need an AI-powered document summarization portal for our internal users."
    );
    await page.getByRole("button", { name: "Send Enquiry" }).click();

    await expect(page.getByRole("status")).toContainText(
      "Your enquiry has been validated successfully."
    );
  });

  test("mobile menu opens and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile-only navigation test");
    const menu = page.getByRole("button", { name: "Open navigation" });
    await menu.click();
    await expect(page.locator("#navigation")).toHaveClass(/open/);
    await page.getByRole("link", { name: "About" }).click();
    await expect(page.locator("#navigation")).not.toHaveClass(/open/);
  });
});
