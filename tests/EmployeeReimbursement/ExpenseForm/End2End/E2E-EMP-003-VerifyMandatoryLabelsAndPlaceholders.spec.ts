import { expect, test } from '@playwright/test';
import { ExpenseFormPage } from '../../../../pages/EmployeeReimbursement/ExpenseFormPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { ensureEmployeeRoleForEnd2E } from '../../ensureEmployeeRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe.skip('E2E-EMP-003 Mandatory labels and placeholders', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
  });

  test('Verify mandatory labels, placeholders, and action buttons on Expense Form', async ({ page }) => {
    const expenseFormPage = new ExpenseFormPage(page);
    await expenseFormPage.openExpenseForm();

    // Step 1: Form title
    await expect(page.getByRole('heading', { name: /Employee Expense Reimbursement/i })).toBeVisible();

    // Step 2: Amount field
    await expect(page.getByText('Amount*', { exact: true })).toBeVisible();
    await expect(expenseFormPage.amountInput).toBeVisible();
    await expect(expenseFormPage.amountInput).toHaveAttribute('placeholder', /Enter Amount/i);

    // Step 3: Expense Category field
    await expect(page.getByText('Expense Category*', { exact: true })).toBeVisible();
    await expect(expenseFormPage.expenseCategoryDropdown).toBeVisible();
    await expect(expenseFormPage.expenseCategoryDropdown).toHaveValue('Select Expense Category');

    // Step 4: Vendor Name field
    await expect(page.getByText('Vendor Name*', { exact: true })).toBeVisible();
    await expect(expenseFormPage.vendorNameInput).toBeVisible();
    await expect(expenseFormPage.vendorNameInput).toHaveAttribute('placeholder', /Enter Vendor Name/i);

    // Step 5: Supporting Documents field
    await expect(page.getByText('Supporting Documents *', { exact: true })).toBeVisible();
    await expect(expenseFormPage.supportingDocumentsButton).toBeVisible();

    // Step 6: Expense Description field
    await expect(page.getByText('Expense Description*', { exact: true })).toBeVisible();
    await expect(expenseFormPage.expenseDescriptionInput).toBeVisible();
    await expect(expenseFormPage.expenseDescriptionInput).toHaveAttribute(
      'placeholder',
      /Enter Expense Description/i
    );

    // Step 7: Action buttons
    await expect(expenseFormPage.submitButton).toBeVisible();
    await expect(expenseFormPage.submitAndAddNewButton).toBeVisible();
  });
});
