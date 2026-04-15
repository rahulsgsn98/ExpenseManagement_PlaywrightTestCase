import { expect, test } from '@playwright/test';
import { ExpenseFormPage } from '../../../../pages/EmployeeReimbursement/ExpenseFormPage';
import { ExpenseHistoryPage } from '../../../../pages/EmployeeReimbursement/ExpenseHistoryPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureEmployeeRoleForEnd2E } from '../../ensureEmployeeRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-EMP-002 Submit and Add New multiple expenses', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
  });

  test('Submit three expenses in one session and verify in history', async ({ page }) => {
    const expenseFormPage = new ExpenseFormPage(page);
    const expenseHistoryPage = new ExpenseHistoryPage(page);

    const first = {
      amount: RandomDataFaker.amount(40, 70),
      expenseCategoryValue: '63010 Meals & Entertainment',
      vendorName: RandomDataFaker.vendorName(),
      supportingDocumentPath: 'testdata/Receipt.jpg',
      description: RandomDataFaker.expenseDescription()
    };

    const second = {
      amount: RandomDataFaker.amount(100, 180),
      expenseCategoryValue: '63130 Office Supplies',
      vendorName: RandomDataFaker.vendorName(),
      supportingDocumentPath: 'testdata/Receipt.png',
      description: RandomDataFaker.expenseDescription()
    };

    const third = {
      amount: RandomDataFaker.amount(250, 380),
      expenseCategoryValue: '63020 Travel',
      vendorName: RandomDataFaker.vendorName(),
      supportingDocumentPath: 'testdata/Expense Management- User and Admin guide.pdf',
      description: RandomDataFaker.expenseDescription()
    };

    await expenseFormPage.openExpenseForm();

    // First expense + Submit and Add New
    await expenseFormPage.enterAmount(first.amount);
    await expenseFormPage.selectExpenseCategory(first.expenseCategoryValue);
    await expenseFormPage.enterVendorName(first.vendorName);
    await expenseFormPage.uploadSupportingDocument(first.supportingDocumentPath);
    await expenseFormPage.expectUploadedFilePill('Receipt.jpg');
    await expenseFormPage.enterExpenseDescription(first.description);
    await expenseFormPage.submitAndAddNewExpense();
    await expenseFormPage.expectReadyForNewExpenseEntry();

    // Second expense + Submit and Add New
    await expenseFormPage.enterAmount(second.amount);
    await expenseFormPage.selectExpenseCategory(second.expenseCategoryValue);
    await expenseFormPage.enterVendorName(second.vendorName);
    await expenseFormPage.uploadSupportingDocument(second.supportingDocumentPath);
    await expenseFormPage.expectUploadedFilePill('Receipt.png');
    await expenseFormPage.enterExpenseDescription(second.description);
    await expenseFormPage.submitAndAddNewExpense();
    await expenseFormPage.expectReadyForNewExpenseEntry();

    // Third expense + Submit
    await expenseFormPage.enterAmount(third.amount);
    await expenseFormPage.selectExpenseCategory(third.expenseCategoryValue);
    await expenseFormPage.enterVendorName(third.vendorName);
    await expenseFormPage.uploadSupportingDocument(third.supportingDocumentPath);
    await expenseFormPage.expectUploadedFilePill('Expense Management- User and Admin guide.pdf');
    await expenseFormPage.enterExpenseDescription(third.description);
    await expenseFormPage.submitExpense();
    await expenseFormPage.expectExpenseAddedSuccessfully();

    // Verify all 3 records in History
    await expenseHistoryPage.openHistoryPage();

    for (const record of [first, second, third]) {
      await expenseHistoryPage.search(record.vendorName);
      // Same vendor can appear on multiple rows; .first() is DOM order, not "newest" — scope by amount too.
      const amountCell = `$${Number(record.amount).toFixed(2)}`;
      const row = page
        .locator('tbody tr')
        .filter({ hasText: record.vendorName })
        .filter({ hasText: amountCell });
      await expect(row).toBeVisible();
      await expect(row).toContainText(amountCell);
      await expect(row).toContainText('Submitted');
      await expenseHistoryPage.clearSearch();
    }
  });
});
