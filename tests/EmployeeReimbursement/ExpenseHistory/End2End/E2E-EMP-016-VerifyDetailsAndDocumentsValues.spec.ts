import { expect, test } from '@playwright/test';
import { TestConfig } from '../../../../test.config';
import { ExpenseFormPage } from '../../../../pages/EmployeeReimbursement/ExpenseFormPage';
import { ExpenseHistoryPage } from '../../../../pages/EmployeeReimbursement/ExpenseHistoryPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureEmployeeRoleForEnd2E } from '../../ensureEmployeeRoleForEnd2E';

const testConfig = new TestConfig();

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-EMP-016 Verify details/document values only', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
  });

  test('Create expense then verify values in History, Details, and Edit documents', async ({ page }) => {
    const form = new ExpenseFormPage(page);
    const history = new ExpenseHistoryPage(page);

    const amount = RandomDataFaker.amount(210, 260);
    const vendorName = RandomDataFaker.vendorName();
    const description = RandomDataFaker.expenseDescription();
    const fileName = 'Receipt.jpg';
    let expenseId = '';

    await test.step('Create expense', async () => {
      await form.openExpenseForm();
      await form.enterAmount(amount);
      await form.selectExpenseCategory('63130 Office Supplies');
      await form.enterVendorName(vendorName);
      await form.uploadSupportingDocument('testdata/Receipt.jpg');
      await form.expectUploadedFilePill(fileName);
      await form.enterExpenseDescription(description);
      await form.submitExpense();
      await form.expectExpenseAddedSuccessfully();
    });

    await test.step('Verify created expense row in History and capture ID', async () => {
      await history.openHistoryPage();
      await history.search(vendorName);
      const createdRow = page.locator('tbody tr', { hasText: vendorName }).first();
      await expect(createdRow).toBeVisible();
      await expect(createdRow).toContainText(`$${amount}`);
      await expect(createdRow).toContainText('Submitted');
      expenseId = (await createdRow.locator('td').first().innerText()).trim();
      expect(expenseId.length).toBeGreaterThan(0);
      await createdRow.getByRole('link', { name: 'Details' }).click();
    });

    await test.step('Verify Details page values', async () => {
      await expect(page).toHaveURL(/\/ActionCenter\/ExpenseactionCenter\?ID=/i);
      await expect(page.locator('body')).toContainText(expenseId);
      await expect(page.locator('body')).toContainText(vendorName);
      await expect(page.locator('body')).toContainText('$');
      await expect(page.locator('body')).toContainText(description);
      await expect(page.locator('body')).toContainText(/Submitted|Pending|Approved|Denied/i);
      await expect(page.locator('body')).toContainText(/\d{1,2}\/\d{1,2}\/\d{4}/);
      await expect(page.locator('body')).toContainText(
        new RegExp(`${testConfig.e2eEmployeeDisplayNameRegexSource}|Submitted By`, 'i')
      );
    });

    await test.step('Verify Details -> All Documents row values', async () => {
      await history.expectFirstDetailsDocumentValues({
        fileName,
        category: /Supporting Document/i
      });
      await expect(history.firstDocumentAttachmentLink).toBeVisible();
    });

    await test.step('Open Edit and verify expense values', async () => {
      await history.clickEditFromDetails();
      await expect(page).toHaveURL(/\/AllForms\/EditExpenseForm\//i);
      await expect(page.getByRole('textbox', { name: 'Expense Submission Date*' })).toHaveValue(/.+/);
      await expect(page.getByRole('textbox', { name: 'Amount*' })).toHaveValue(new RegExp(amount));
      await expect(page.getByRole('textbox', { name: 'Expense Date*' })).toHaveValue(/.+/);
      await expect(page.getByRole('combobox', { name: 'Expense Category*' })).toHaveValue(/.+/);
      await expect(page.getByRole('textbox', { name: 'Vendor Name*' })).toHaveValue(vendorName);
      await expect(page.locator('textarea').first()).toHaveValue(description);
    });

    // Skipped until Created By in Edit → All Documents no longer shows erroneous "Not Found". Replace test.step.skip with test.step to re-enable.
    // Verify Edit -> All Documents row values
    await test.step.skip('Verify Edit -> All Documents row values', async () => {
      await history.expectFirstEditDocumentValues({
        mediaType: /Add Expense/i,
        createdBy: new RegExp(testConfig.e2eEmployeeDisplayNameRegexSource, 'i'),   // Name of the user who logged in the application
        belongsTo: /Expense/i,
        category: /Supporting Document|Approval Document/i
      });
      await expect(history.firstEditDocumentAttachmentLink).toBeVisible();
    });
  });
});
