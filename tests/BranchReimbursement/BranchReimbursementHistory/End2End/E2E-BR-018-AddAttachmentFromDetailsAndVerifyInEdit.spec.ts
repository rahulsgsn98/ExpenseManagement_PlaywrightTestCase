import { expect, test } from '@playwright/test';
import { BranchReimbursementHistoryPage } from '../../../../pages/BranchReimbursement/BranchReimbursementHistoryPage';
import { NewSubmissionPage } from '../../../../pages/BranchReimbursement/NewSubmissionPage';
import { branchNewSubmissionCostCenterAt } from '../../../../utils/branchCostCenters';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BR-018 Add attachment from Details and verify in Details/Edit documents', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Create new branch ( New submission)   reimbursement, add attachment in Details, verify in Details and Edit docs', async ({ page }) => {
    const newSubmissionPage = new NewSubmissionPage(page);
    const historyPage = new BranchReimbursementHistoryPage(page);

    const amount = RandomDataFaker.amount(150, 230);
    const vendorName = `BR-${RandomDataFaker.vendorName()}-${Date.now()}`.replace(/[^a-zA-Z0-9 -]/g, '');
    const description = RandomDataFaker.expenseDescription();
    const newAttachmentName = 'Receipt.png';
    let detailsDocumentsCount = 0;

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const incurredDate = `${yyyy}-${mm}-${dd}`;

    await test.step('Create Branch Reimbursement ( New submission)', async () => {
      await newSubmissionPage.openNewSubmissionPage();
      await newSubmissionPage.enterAmount(amount);
      await newSubmissionPage.selectExpenseCategory('63130 Office Supplies');
      await newSubmissionPage.enterIncurredDate(incurredDate);
      await newSubmissionPage.selectBranchCostCenter(branchNewSubmissionCostCenterAt(0));
      await newSubmissionPage.enterVendorName(vendorName);
      await newSubmissionPage.uploadSupportingDocument('testdata/Receipt.jpg');
      await newSubmissionPage.expectUploadedFilePill('Receipt.jpg');
      await newSubmissionPage.enterDescription(description);
      await newSubmissionPage.clickSubmit();
      await newSubmissionPage.expectSubmissionSuccessful();
    });

    await test.step('Open created reimbursement details from Branch History', async () => {
      await historyPage.openBranchHistoryPage();
      await historyPage.searchBranchHistory(vendorName);
      const row = page.locator('tbody tr:not(.child)', { hasText: vendorName }).first();
      await expect(row).toBeVisible({ timeout: 20_000 });
      await historyPage.openBranchHistoryDetailsForRow(row);
      await expect(page).toHaveURL(/\/ActionCenter\/CostactionCenter\?ID=/i);
    });

    await test.step('Add another attachment in Details', async () => {
      await historyPage.openAddAttachmentsModal();
      await historyPage.uploadFileInAddAttachmentsModal('testdata/Receipt.png');
      await historyPage.submitAddAttachmentsModal();
      await expect(historyPage.addAttachmentsModal).not.toBeVisible();
    });

    await test.step('Verify file exists in Details -> All Documents and capture count', async () => {
      const detailsDocumentsSection = page.locator('div').filter({ hasText: 'All Documents' }).first();
      const detailsShowEntries = detailsDocumentsSection.getByRole('combobox', { name: /Show/i }).first();
      const detailsSearch = detailsDocumentsSection.getByRole('searchbox').first();
      const detailsRows = detailsDocumentsSection.locator('tbody tr');

      await detailsShowEntries.selectOption('100');
      await detailsSearch.fill(newAttachmentName);
      await expect(detailsRows.filter({ hasText: newAttachmentName }).first()).toBeVisible();

      await detailsSearch.fill('');
      detailsDocumentsCount = await detailsRows.count();
      expect(detailsDocumentsCount).toBeGreaterThan(0);
    });

    await test.step('Open Edit and verify Details/Edit document counts are equal', async () => {
      await historyPage.openEditFromDetails();
      await expect(page).toHaveURL(/\/AllForms\/EditCostExpenseForm\//i);
      await historyPage.selectEditDocumentsShowEntries('100');
      await historyPage.searchEditDocuments('');
      const editDocumentsCount = await historyPage.editDocumentsSearchInput
        .locator('xpath=ancestor::div[contains(@class,"dataTables_wrapper")]')
        .first()
        .locator('tbody tr')
        .count();
      expect(editDocumentsCount).toBe(detailsDocumentsCount);
    });
  });
});
