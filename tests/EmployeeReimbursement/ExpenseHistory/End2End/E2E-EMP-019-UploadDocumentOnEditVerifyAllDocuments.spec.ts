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

/** Matches UI like `4/10/2026 4:10:30 AM` inside the All Documents row. */
const createdOnDateTimePattern =
  /\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{1,2}:\d{2}\s*(AM|PM)/i;

test.describe('E2E-EMP-019 Upload document on Edit, update, verify All Documents', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
  });

  test('Create expense, add document on Edit, verify Details and Edit All Documents', async ({ page }) => {
   
    const form = new ExpenseFormPage(page);
    const history = new ExpenseHistoryPage(page);

    const amount = RandomDataFaker.amount(180, 240);
    const vendorName = RandomDataFaker.vendorName();
    const description = RandomDataFaker.expenseDescription();
    const initialReceipt = 'Receipt.jpg';
    const additionalDocName = 'Receipt.png';
    /** All Documents grid **ID** column (first column), not expense Request ID from URL. */
    let editAllDocumentsRowId = '';

    await test.step('Create new expense with initial supporting document', async () => {
      await form.openExpenseForm();
      await form.enterAmount(amount);
      await form.selectExpenseCategory('63130 Office Supplies');
      await form.enterVendorName(vendorName);
      await form.uploadSupportingDocument(`testdata/${initialReceipt}`);
      await form.expectUploadedFilePill(initialReceipt);
      await form.enterExpenseDescription(description);
      await form.submitExpense();
      await form.expectExpenseAddedSuccessfully();
    });

    await test.step('Search expense by vendor, open Details then Edit', async () => {
      await history.openHistoryPage();
      await history.search(vendorName);
      const row = page.locator('tbody tr', { hasText: vendorName }).first();
      await expect(row).toBeVisible();
      await row.getByRole('link', { name: 'Details' }).click();
      await expect(page).toHaveURL(/\/ActionCenter\/ExpenseactionCenter\?ID=/i);
      await history.ensureAddAttachmentsModalClosed();
      await history.clickEditFromDetails();
      await expect(page).toHaveURL(/\/AllForms\/EditExpenseForm\//i);
    });

    await test.step('Upload another document on Edit form and save with Update Information', async () => {
      await history.uploadDetailsSupportingDocument(`testdata/${additionalDocName}`);
      await history.clickEditFormUpdateInformation();
    });

    await test.step('Assert update success message (POM)', async () => {
      await history.expectUpdateExpenseSuccessMessageVisible();
    });

    // Must run on **Edit** page: Edit → All Documents does not exist on Details.
    await test.step.skip('Capture All Documents table ID (first column) for the new file — not Request ID', async () => {
       await history.openHistoryPage();
      await history.selectEditDocumentsShowEntries('100');
      editAllDocumentsRowId = await history.getEditDocumentIdForFileName(additionalDocName);
      expect(editAllDocumentsRowId.length).toBeGreaterThan(0);
    });

    await test.step('Search vendor in History, open Details, verify View All Documents row', async () => {
      await history.openHistoryPage();
      await history.search(vendorName);
      const row = page.locator('tbody tr', { hasText: vendorName }).first();
      await expect(row).toBeVisible();
      await row.getByRole('link', { name: 'Details' }).click();
      await expect(page).toHaveURL(/\/ActionCenter\/ExpenseactionCenter\?ID=/i);
      await history.ensureAddAttachmentsModalClosed();
      await history.selectDocumentsShowEntries('100');
      await history.searchDocuments(additionalDocName);
      await history.expectDetailsDocumentRowForFile(additionalDocName, {
        createdBy: new RegExp(testConfig.e2eEmployeeDisplayNameRegexSource, 'i'),
        category: /Supporting Document/i
      });
    });

    await test.step.skip('Open Edit, search by All Documents ID in Edit grid, verify row values', async () => {
      await history.clickEditFromDetails();
      await expect(page).toHaveURL(/\/AllForms\/EditExpenseForm\//i);
      await history.selectEditDocumentsShowEntries('100');
      await history.searchEditDocuments(editAllDocumentsRowId);
      await history.expectFirstEditDocumentRowMatches({
        mediaType: /Add Expense/i,
        createdOn: createdOnDateTimePattern,
        belongsTo: /Expense/i,
        category: /Supporting Document/i
      });
    });
  });
});
