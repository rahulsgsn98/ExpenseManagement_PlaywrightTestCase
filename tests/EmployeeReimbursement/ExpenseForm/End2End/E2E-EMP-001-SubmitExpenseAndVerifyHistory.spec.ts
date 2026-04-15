import { expect, test } from '@playwright/test';
import { ExpenseFormPage } from '../../../../pages/EmployeeReimbursement/ExpenseFormPage';
import { ExpenseHistoryPage } from '../../../../pages/EmployeeReimbursement/ExpenseHistoryPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureEmployeeRoleForEnd2E } from '../../ensureEmployeeRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-EMP-001 Submit expense and verify in History', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
  });

  test('Submit expense with valid fields and verify history record', async ({ page }) => {
    const expenseFormPage = new ExpenseFormPage(page);
    const expenseHistoryPage = new ExpenseHistoryPage(page);

    const amount = RandomDataFaker.amount(200, 400);
    const vendorName = RandomDataFaker.vendorName();
    const description = RandomDataFaker.expenseDescription();
    const supportingDocumentPath = 'testdata/Receipt.pdf';

    // Step 1: Open Expense Form and verify fields are visible.
    await expenseFormPage.openExpenseForm();
    await expect(expenseFormPage.amountInput).toBeVisible();
    await expect(expenseFormPage.expenseCategoryDropdown).toBeVisible();
    await expect(expenseFormPage.vendorNameInput).toBeVisible();
    await expect(expenseFormPage.supportingDocumentsButton).toBeVisible();
    await expect(expenseFormPage.expenseDescriptionInput).toBeVisible();

    // Steps 2-7: Fill and submit expense form.
    await expenseFormPage.enterAmount(amount);
    await expect(expenseFormPage.amountInput).toHaveValue(amount);

    await expenseFormPage.selectExpenseCategory('63020 Travel');
    await expect(expenseFormPage.expenseCategoryDropdown).toHaveValue('63020 Travel');

    await expenseFormPage.enterVendorName(vendorName);
    await expect(expenseFormPage.vendorNameInput).toHaveValue(vendorName);

    await expenseFormPage.uploadSupportingDocument(supportingDocumentPath);
    await expenseFormPage.expectUploadedFilePill('Receipt.pdf');

    await expenseFormPage.enterExpenseDescription(description);
    await expect(expenseFormPage.expenseDescriptionInput).toHaveValue(description);

    await expenseFormPage.submitExpense();
    await expenseFormPage.expectExpenseAddedSuccessfully();

    // Step 8: Open History page.
    await expenseHistoryPage.openHistoryPage();

    // Step 9: Verify required columns and submitted record values.
    await expect(expenseHistoryPage.idHeader).toBeVisible();
    await expect(expenseHistoryPage.vendorNameHeader).toBeVisible();
    await expect(expenseHistoryPage.amountHeader).toBeVisible();
    await expect(expenseHistoryPage.submittedDateHeader).toBeVisible();
    await expect(expenseHistoryPage.statusHeader).toBeVisible();
    await expect(expenseHistoryPage.lastUpdatedDateHeader).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Action:/i })).toBeVisible();

    await expenseHistoryPage.search(vendorName);
    const recordRow = page.locator('tbody tr', { hasText: vendorName }).first();
    await expect(recordRow).toBeVisible();
    await expect(recordRow).toContainText(`$${amount}`);
    await expect(recordRow).toContainText('Submitted');
  });
});
