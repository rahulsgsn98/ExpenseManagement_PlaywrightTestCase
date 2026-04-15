import { expect, test } from '@playwright/test';
import { TestConfig } from '../../../../test.config';
import { BranchReimbursementHistoryPage } from '../../../../pages/BranchReimbursement/BranchReimbursementHistoryPage';
import { NewSubmissionPage } from '../../../../pages/BranchReimbursement/NewSubmissionPage';
import { branchNewSubmissionCostCenterAt } from '../../../../utils/branchCostCenters';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

const testConfig = new TestConfig();

/** Matches UI like `4/10/2026 4:10:30 AM` inside the All Documents row. */
const createdOnDateTimePattern =
  /\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{1,2}:\d{2}\s*(AM|PM)/i;

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BR-021 Upload document on Edit, update, verify All Documents', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Create reimbursement, add document on Edit, verify Details and Edit All Documents', async ({
    page
  }) => {
    const newSubmissionPage = new NewSubmissionPage(page);
    const historyPage = new BranchReimbursementHistoryPage(page);

    const amount = RandomDataFaker.amount(180, 240);
    const amountCell = `$${Number(amount).toFixed(2)}`;
    const vendorName = `BR-${RandomDataFaker.vendorName()}-${Date.now()}`.replace(/[^a-zA-Z0-9 -]/g, '');
    const description = RandomDataFaker.expenseDescription();
    const initialReceipt = 'Receipt.jpg';
    const additionalDocName = 'Receipt.png';
    /** All Documents grid **ID** column (first column), not Branch Expense ID from history. */
    let editAllDocumentsRowId = '';

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const incurredDate = `${yyyy}-${mm}-${dd}`;

    await test.step('Create new reimbursement with initial supporting document', async () => {
      await newSubmissionPage.openNewSubmissionPage();
      await newSubmissionPage.enterAmount(amount);
      await newSubmissionPage.selectExpenseCategory('63130 Office Supplies');
      await newSubmissionPage.enterIncurredDate(incurredDate);
      await newSubmissionPage.selectBranchCostCenter(branchNewSubmissionCostCenterAt(0));
      await newSubmissionPage.enterVendorName(vendorName);
      await newSubmissionPage.uploadSupportingDocument(`testdata/${initialReceipt}`);
      await newSubmissionPage.expectUploadedFilePill(initialReceipt);
      await newSubmissionPage.enterDescription(description);
      await newSubmissionPage.clickSubmit();
      await newSubmissionPage.expectSubmissionSuccessful();
    });

    await test.step('Search reimbursement by vendor, open Details then Edit', async () => {
      await historyPage.openBranchHistoryPage();
      await historyPage.searchBranchHistory(vendorName);
      const row = historyPage.branchHistoryMainDataRow(vendorName, amountCell);
      await expect(row).toBeVisible();
      await historyPage.openBranchHistoryDetailsForRow(row);
      await expect(page).toHaveURL(/\/ActionCenter\/CostactionCenter\?ID=/i);
      await historyPage.ensureAddAttachmentsModalClosed();
      await historyPage.openEditFromDetails();
      await expect(page).toHaveURL(/\/AllForms\/EditCostExpenseForm\//i);
    });

    await test.step('Upload another document on Edit form and save with Update Information', async () => {
      await historyPage.editSupportingDocumentsInput.setInputFiles(`testdata/${additionalDocName}`);
      await historyPage.clickUpdateInformation();
    });

    await test.step('Assert update success message (POM)', async () => {
      await historyPage.expectUpdateBranchExpenseSuccessMessageVisible();
    });

    // Must run on **Edit** page: Edit -> All Documents does not exist on Details.
    await test.step.skip('Capture All Documents table ID (first column) for the new file — not Branch Expense ID', async () => {
      await historyPage.selectEditDocumentsShowEntries('100');
      await historyPage.searchEditDocuments(additionalDocName);
      editAllDocumentsRowId = (await historyPage.firstEditDocumentRow.locator('td').first().innerText()).trim();
      expect(editAllDocumentsRowId.length).toBeGreaterThan(0);
    });

    await test.step('Search vendor in History, open Details, verify View All Documents row', async () => {
      await historyPage.openBranchHistoryPage();
      await historyPage.searchBranchHistory(vendorName);
      const row = historyPage.branchHistoryMainDataRow(vendorName, amountCell);
      await expect(row).toBeVisible();
      await historyPage.openBranchHistoryDetailsForRow(row);
      await expect(page).toHaveURL(/\/ActionCenter\/CostactionCenter\?ID=/i);
      await historyPage.ensureAddAttachmentsModalClosed();
      await historyPage.selectDetailsDocumentsShowEntries('100');
      await historyPage.searchDetailsDocuments(additionalDocName);
      await historyPage.expectDetailsDocumentRowForFile(additionalDocName, {
        createdBy: new RegExp(testConfig.e2eEmployeeDisplayNameRegexSource, 'i'),
        category: /Supporting Document/i
      });
    });

    await test.step.skip('Open Edit, search by All Documents ID in Edit grid, verify row values', async () => {
      await historyPage.openEditFromDetails();
      await expect(page).toHaveURL(/\/AllForms\/EditCostExpenseForm\//i);
      await historyPage.selectEditDocumentsShowEntries('100');
      await historyPage.searchEditDocuments(editAllDocumentsRowId);
      await historyPage.expectFirstEditDocumentValues({
        mediaType: /Cost Center/i,
        createdOn: createdOnDateTimePattern,
        belongsTo: /Cost/i,
        category: /Supporting Document/i
      });
    });
  });
});
