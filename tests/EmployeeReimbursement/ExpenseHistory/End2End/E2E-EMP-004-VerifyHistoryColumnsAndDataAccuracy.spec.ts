import { expect, test } from '@playwright/test';
import { ExpenseFormPage } from '../../../../pages/EmployeeReimbursement/ExpenseFormPage';
import { ExpenseHistoryPage } from '../../../../pages/EmployeeReimbursement/ExpenseHistoryPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureEmployeeRoleForEnd2E } from '../../ensureEmployeeRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-EMP-004 Verify History columns and data accuracy', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
  });

  test('Submit expense and verify all history columns/data', async ({ page }) => {
    const expenseFormPage = new ExpenseFormPage(page);
    const historyPage = new ExpenseHistoryPage(page);

    const amount = '175.00';
    const vendorName = RandomDataFaker.vendorName();
    const description = RandomDataFaker.expenseDescription();
    const filePath = 'testdata/Receipt.pdf';

    // Submit one new expense first.
    await expenseFormPage.openExpenseForm();
    await expenseFormPage.enterAmount(amount);
    await expenseFormPage.selectExpenseCategory('63010 Meals & Entertainment');
    await expenseFormPage.enterVendorName(vendorName);
    await expenseFormPage.uploadSupportingDocument(filePath);
    await expenseFormPage.expectUploadedFilePill('Receipt.pdf');
    await expenseFormPage.enterExpenseDescription(description);
    await expenseFormPage.submitExpense();
    await expenseFormPage.expectExpenseAddedSuccessfully();

    // Open history and verify all required columns.
    await historyPage.openHistoryPage();
    await expect(historyPage.idHeader).toBeVisible();
    await expect(historyPage.vendorNameHeader).toBeVisible();
    await expect(historyPage.amountHeader).toBeVisible();
    await expect(historyPage.submittedDateHeader).toBeVisible();
    await expect(historyPage.statusHeader).toBeVisible();
    await expect(historyPage.lastUpdatedDateHeader).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Action:/i })).toBeVisible();

    // Locate the newly submitted record and validate values.
    await historyPage.search(vendorName);
    const recordRow = page.locator('tbody tr', { hasText: vendorName }).first();
    await expect(recordRow).toBeVisible();
    await expect(recordRow).toContainText(`$${amount}`);
    await expect(recordRow).toContainText('Submitted');
    await expect(recordRow.getByRole('link', { name: 'Details' })).toBeVisible();

    // Validate ID is present (non-empty numeric/alphanumeric text).
    const idCellText = (await recordRow.locator('td').first().innerText()).trim();
    expect(idCellText.length).toBeGreaterThan(0);
  });
});
