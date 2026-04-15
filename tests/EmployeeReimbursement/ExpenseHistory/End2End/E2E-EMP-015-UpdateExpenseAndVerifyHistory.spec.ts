import { expect, test } from '@playwright/test';
import { ExpenseFormPage } from '../../../../pages/EmployeeReimbursement/ExpenseFormPage';
import { ExpenseHistoryPage } from '../../../../pages/EmployeeReimbursement/ExpenseHistoryPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureEmployeeRoleForEnd2E } from '../../ensureEmployeeRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-EMP-015 Update expense and verify in History', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
  });

  test('Create new expense, update it from History details, verify updated values', async ({ page }) => {
    const expenseFormPage = new ExpenseFormPage(page);
    const historyPage = new ExpenseHistoryPage(page);

    const originalAmount = RandomDataFaker.amount(120, 170);
    const originalVendor = RandomDataFaker.vendorName();
    const originalDescription = RandomDataFaker.expenseDescription();

    const updatedAmount = RandomDataFaker.amount(220, 290);
    const updatedVendor = `${RandomDataFaker.vendorName()} Updated`;
    const updatedDescription = `${RandomDataFaker.expenseDescription()} updated`;

    // Create new expense.
    await expenseFormPage.openExpenseForm();
    await expenseFormPage.enterAmount(originalAmount);
    await expenseFormPage.selectExpenseCategory('63010 Meals & Entertainment');
    await expenseFormPage.enterVendorName(originalVendor);
    await expenseFormPage.uploadSupportingDocument('testdata/Receipt.jpg');
    await expenseFormPage.expectUploadedFilePill('Receipt.jpg');
    await expenseFormPage.enterExpenseDescription(originalDescription);
    await expenseFormPage.submitExpense();
    await expenseFormPage.expectExpenseAddedSuccessfully();

    // Locate the created record and open details.
    await historyPage.openHistoryPage();
    await historyPage.search(originalVendor);
    const createdRow = page.locator('tbody tr', { hasText: originalVendor }).first();
    await expect(createdRow).toBeVisible();
    await createdRow.getByRole('link', { name: 'Details' }).click();
    await expect(page).toHaveURL(/\/ActionCenter\/ExpenseactionCenter\?ID=/i);

    // Open edit screen and update values.
    await historyPage.clickEditFromDetails();
    await expect(page).toHaveURL(/\/AllForms\/EditExpenseForm\//i);
    const amountInput = page.getByRole('textbox', { name: 'Amount*' });
    const vendorInput = page.getByRole('textbox', { name: 'Vendor Name*' });
    const descriptionInput = page.locator('textarea').first();
    const updateInfoButton = page.getByRole('button', { name: /Update Information/i });

    await amountInput.fill(updatedAmount);
    await vendorInput.fill(updatedVendor);
    await descriptionInput.fill(updatedDescription);
    await updateInfoButton.click();

    // Verify success message
    await historyPage.expectUpdateExpenseSuccessMessageVisible();

    // Verify updated record in History.

    await historyPage.openHistoryPage();
    await historyPage.search(updatedVendor);
    const updatedRow = page.locator('tbody tr', { hasText: updatedVendor }).first();
    await expect(updatedRow).toBeVisible();
    await expect(updatedRow).toContainText(`$${updatedAmount}`);
  });
});
