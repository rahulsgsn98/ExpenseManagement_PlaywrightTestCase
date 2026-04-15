import { test } from '@playwright/test';
import { ExpenseFormPage } from '../../../../pages/EmployeeReimbursement/ExpenseFormPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { ensureEmployeeRoleForEnd2E } from '../../ensureEmployeeRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('Employee Reimbursement - Expense Form Amount Validation', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
  });

  test('Shows error when amount is greater than 3000', async ({ page }) => {
    const expenseFormPage = new ExpenseFormPage(page);

    await expenseFormPage.openExpenseForm();

    await expenseFormPage.enterAmount('3001');
    await expenseFormPage.expectAmountExceedsLimitError();
  });
});
