import { expect, test } from '@playwright/test';
import { ExpenseFormPage } from '../../../../pages/EmployeeReimbursement/ExpenseFormPage';
import { ExpenseHistoryPage } from '../../../../pages/EmployeeReimbursement/ExpenseHistoryPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureEmployeeRoleForEnd2E } from '../../ensureEmployeeRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-EMP-017 Add attachment from Details and verify in Details/Edit documents', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
  });

  test('Create expense, search vendor, add attachment in Details, verify in Details and Edit docs', async ({
    page
  }) => {
    const form = new ExpenseFormPage(page);
    const history = new ExpenseHistoryPage(page);

    const amount = RandomDataFaker.amount(150, 230);
    const vendorName = RandomDataFaker.vendorName();
    const description = RandomDataFaker.expenseDescription();
    const newAttachmentName = 'Receipt.png';
    let detailsDocumentsCount = 0;

    await test.step('Create expense', async () => {
      await form.openExpenseForm();
      await form.enterAmount(amount);
      await form.selectExpenseCategory('63130 Office Supplies');
      await form.enterVendorName(vendorName);
      await form.uploadSupportingDocument('testdata/Receipt.jpg');
      await form.expectUploadedFilePill('Receipt.jpg');
      await form.enterExpenseDescription(description);
      await form.submitExpense();
      await form.expectExpenseAddedSuccessfully();
    });

    await test.step('Open created expense details from history', async () => {
      await history.openHistoryPage();
      await history.search(vendorName);
      const row = page.locator('tbody tr', { hasText: vendorName }).first();
      await expect(row).toBeVisible();
      await row.getByRole('link', { name: 'Details' }).click();
      await expect(page).toHaveURL(/\/ActionCenter\/ExpenseactionCenter\?ID=/i);
    });

    await test.step('Add another attachment in Details', async () => {
      await history.openAddAttachmentsModal();
      await history.uploadDocumentInAddAttachmentsModal('testdata/Receipt.png');
      await history.submitAddAttachmentsModal();
      await history.expectAddAttachmentsModalClosed();
    });

    await test.step('Verify file name exists in Details -> All Documents and capture file count', async () => {
      await history.selectDocumentsShowEntries('100');
      await history.searchDocuments(newAttachmentName);
      await expect(page.locator('tbody tr', { hasText: newAttachmentName }).first()).toBeVisible();
      await history.searchDocuments('');
      detailsDocumentsCount = await page.locator('tbody tr').count();
      expect(detailsDocumentsCount).toBeGreaterThan(0);
    });

    await test.step('Open Edit and verify Details/Edit document counts are equal', async () => {
      await history.clickEditFromDetails();
      await expect(page).toHaveURL(/\/AllForms\/EditExpenseForm\//i);
      await history.selectEditDocumentsShowEntries('100');
      await history.searchEditDocuments('');
      const editDocumentsCount = await page.locator('tbody tr').count();
      expect(editDocumentsCount).toBe(detailsDocumentsCount);
    });
  });
});
