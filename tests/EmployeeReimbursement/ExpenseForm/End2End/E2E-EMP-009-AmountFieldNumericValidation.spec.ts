import { expect, test } from '@playwright/test';
import { ExpenseFormPage } from '../../../../pages/EmployeeReimbursement/ExpenseFormPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { ensureEmployeeRoleForEnd2E } from '../../ensureEmployeeRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-EMP-009 Expense Form – Amount accepts numeric input only', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
    const expenseFormPage = new ExpenseFormPage(page);
    await page.keyboard.press('Escape');
    await page.goto('/AllForms/ExpenseForm', { waitUntil: 'domcontentloaded' });
    await expect(expenseFormPage.amountInput).toBeVisible();
  });

  test('Numeric amount is accepted', async ({ page }) => {
    const expenseFormPage = new ExpenseFormPage(page);
    await expenseFormPage.amountInput.click();
    await expenseFormPage.amountInput.clear();
    await expenseFormPage.amountInput.pressSequentially('123.45');
    await expect(expenseFormPage.amountInput).toHaveValue('123.45');
  });

  test('Alphabetic input is rejected', async ({ page }) => {
    const expenseFormPage = new ExpenseFormPage(page);
    await expenseFormPage.amountInput.click();
    await expenseFormPage.amountInput.clear();
    await expenseFormPage.amountInput.pressSequentially('abc');
    await expect(expenseFormPage.amountInput).toHaveValue('');
  });

  test('Negative sign is not accepted as part of amount', async ({ page }) => {
    const expenseFormPage = new ExpenseFormPage(page);
    await expenseFormPage.amountInput.click();
    await expenseFormPage.amountInput.clear();
    await expenseFormPage.amountInput.pressSequentially('-100');
    const value = await expenseFormPage.amountInput.inputValue();
    expect(value).not.toContain('-');
    expect(value).toMatch(/^\d*\.?\d*$/);
  });

  test('Special characters are rejected (only numeric characters persist)', async ({ page }) => {
    const expenseFormPage = new ExpenseFormPage(page);
    await expenseFormPage.amountInput.click();
    await expenseFormPage.amountInput.clear();
    await expenseFormPage.amountInput.pressSequentially('@#$50%');
    const value = await expenseFormPage.amountInput.inputValue();
    expect(value).toMatch(/^\d*\.?\d*$/);
    expect(value).not.toContain('@');
    expect(value).not.toContain('#');
    expect(value).not.toContain('$');
    expect(value).not.toContain('%');
  });
});
