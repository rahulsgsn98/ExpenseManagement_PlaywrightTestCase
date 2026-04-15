import { expect, test } from '@playwright/test';
import { ExpenseFormPage } from '../../../../pages/EmployeeReimbursement/ExpenseFormPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { ensureEmployeeRoleForEnd2E } from '../../ensureEmployeeRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-EMP-012 Expense Form – Expense Category dropdown lists all available options', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
    const expenseFormPage = new ExpenseFormPage(page);
    await expenseFormPage.openExpenseForm();
  });

  test('Categories visible; Travel and Meals; each option selectable without leaving form', async ({ page }) => {
    const expenseFormPage = new ExpenseFormPage(page);

    await expenseFormPage.openExpenseCategoryDropdown();
    const allLabels = await expenseFormPage.getExpenseCategoryOptionLabels();
    const selectable = await expenseFormPage.getSelectableExpenseCategoryLabels();

    expect(selectable.length).toBeGreaterThan(0);
    expect(allLabels.some((l) => /Travel/i.test(l))).toBe(true);
    expect(allLabels.some((l) => /Meals/i.test(l))).toBe(true);

    await expenseFormPage.selectExpenseCategory('63020 Travel');
    await expect.poll(async () => expenseFormPage.getSelectedExpenseCategoryLabel()).toMatch(/Travel/i);

    await expenseFormPage.selectExpenseCategory('63010 Meals & Entertainment');
    await expect.poll(async () => expenseFormPage.getSelectedExpenseCategoryLabel()).toMatch(/Meals/i);

    for (const label of selectable) {
      await expenseFormPage.selectExpenseCategory(label);
      const selected = (await expenseFormPage.getSelectedExpenseCategoryLabel()).trim();
      expect(selected).toBe(label.trim());
    }

    await expect(page).toHaveURL(/\/AllForms\/ExpenseForm/i);
  });
});
