import { expect, test } from '@playwright/test';
import { BranchReimbursementHistoryPage } from '../../../../pages/BranchReimbursement/BranchReimbursementHistoryPage';
import { NewSubmissionPage } from '../../../../pages/BranchReimbursement/NewSubmissionPage';
import { branchNewSubmissionCostCenterAt } from '../../../../utils/branchCostCenters';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';
import { TestConfig } from '../../../../test.config';

const testConfig = new TestConfig();

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BR-019 Verify details/document values only', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Create reimbursement then verify values in History, Details, and Edit documents', async ({ page }) => {
    const newSubmissionPage = new NewSubmissionPage(page);
    const historyPage = new BranchReimbursementHistoryPage(page);

    const amount = RandomDataFaker.amount(210, 260);
    const amountCell = `$${Number(amount).toFixed(2)}`;
    const vendorName = `BR-${RandomDataFaker.vendorName()}-${Date.now()}`.replace(/[^a-zA-Z0-9 -]/g, '');
    const description = RandomDataFaker.expenseDescription();
    const fileName = 'Receipt.jpg';
    let branchExpenseId = '';

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const incurredDate = `${yyyy}-${mm}-${dd}`;

    await test.step('Create Branch Reimbursement', async () => {
      await newSubmissionPage.openNewSubmissionPage();
      await newSubmissionPage.enterAmount(amount);
      await newSubmissionPage.selectExpenseCategory('63130 Office Supplies');
      await newSubmissionPage.enterIncurredDate(incurredDate);
      await newSubmissionPage.selectBranchCostCenter(branchNewSubmissionCostCenterAt(0));
      await newSubmissionPage.enterVendorName(vendorName);
      await newSubmissionPage.uploadSupportingDocument('testdata/Receipt.jpg');
      await newSubmissionPage.expectUploadedFilePill(fileName);
      await newSubmissionPage.enterDescription(description);
      await newSubmissionPage.clickSubmit();
      await newSubmissionPage.expectSubmissionSuccessful();
    });

    await test.step('Verify created row in Branch History and capture ID', async () => {
      await historyPage.openBranchHistoryPage();
      await historyPage.searchBranchHistory(vendorName);
      const createdRow = page.locator('tbody tr:not(.child)', { hasText: vendorName }).first();
      await expect(createdRow).toBeVisible({ timeout: 20_000 });
      await expect(createdRow).toContainText(amountCell);
      await expect(createdRow).toContainText('Submitted');
      branchExpenseId = (await createdRow.locator('td').first().innerText()).trim();
      expect(branchExpenseId.length).toBeGreaterThan(0);
      await historyPage.openBranchHistoryDetailsForRow(createdRow);
    });

    await test.step('Verify Details page values', async () => {
      await expect(page).toHaveURL(/\/ActionCenter\/CostactionCenter\?ID=/i);
      await expect(page.locator('body')).toContainText(branchExpenseId);
      await expect(page.locator('body')).toContainText(vendorName);
      await expect(page.locator('body')).toContainText('$');
      await expect(page.locator('body')).toContainText(/Submitted|Pending|Approved|Denied|Paid/i);
      await expect(page.locator('body')).toContainText(/\d{1,2}\/\d{1,2}\/\d{4}/);
      await expect(page.locator('body')).toContainText(/Submitted By/i);
    });

    await test.step('Verify Details -> All Documents row values', async () => {
      const detailsDocumentsSection = page.locator('div').filter({ hasText: 'All Documents' }).first();
      const detailsRows = detailsDocumentsSection.locator('tbody tr');
      await expect(detailsRows.first()).toBeVisible();
      await expect(detailsRows.first()).toContainText(fileName);
      await expect(detailsRows.first()).toContainText(/Supporting Document/i);
    });

    await test.step('Open Edit and verify Branch Reimbursement values', async () => {
      await historyPage.openEditFromDetails();
      await expect(page).toHaveURL(/\/AllForms\/EditCostExpenseForm\//i);
      await expect(historyPage.submissionDateInput).toHaveValue(/.+/);
      await expect(historyPage.editAmountInput).toHaveValue(new RegExp(amount));
      await expect(historyPage.expenseDateInput).toHaveValue(/.+/);
      await expect(historyPage.expenseCategoryDropdown).toHaveValue(/.+/);
      await expect(historyPage.editVendorNameInput).toHaveValue(vendorName);
      await expect(historyPage.editDescriptionInput).toHaveValue(description);
    });

    await test.step('Verify Edit -> All Documents row values', async () => {
      await historyPage.selectEditDocumentsShowEntries('100');
      await historyPage.searchEditDocuments('');
      await historyPage.expectFirstEditDocumentValues({
        mediaType: /Cost Center/i,
        createdOn: /\d{1,2}\/\d{1,2}\/\d{4}/,
        createdBy: new RegExp(testConfig.e2eEmployeeDisplayNameRegexSource, 'i'),
        belongsTo: /Cost/i,
        category: /Supporting Document|Approval Document/i
      });
      await expect(historyPage.editFirstAttachmentLink).toBeVisible();
    });
  });
});
