import { test, expect } from "@playwright/test";
import {TestConfig} from "../test.config";
import { handleContinueLogin } from "../utils/sessionGuard";
import { Pagegoto } from "../utils/Pagegoto";

const testConfig = new TestConfig();





test("expense welcome heading", async ({ page }) => {
  await Pagegoto(page);
 
  const welcomeHeading = page.getByRole("heading", { name: "Welcome to the Employee Expense Portal!" });
  await expect(welcomeHeading).toBeVisible();
});
