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

test.describe('E2E-BR-017 Update branch expense and verify in History', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Create new branch reimbursement, update it from History details, verify updated values', async ({ page }) => {
    const newSubmissionPage = new NewSubmissionPage(page);
    const historyPage = new BranchReimbursementHistoryPage(page);

    const originalAmount = RandomDataFaker.amount(120, 170);
    const uniqueTag = Date.now();
    const originalVendor = `BR-${RandomDataFaker.vendorName()}-${uniqueTag}`.replace(/[^a-zA-Z0-9 -]/g, '');
    const originalDescription = `Original branch expense ${uniqueTag}`;

    const updatedAmount = RandomDataFaker.amount(220, 290);
    const updatedVendor = `BR-${RandomDataFaker.vendorName()}-Updated-${uniqueTag}`.replace(/[^a-zA-Z0-9 -]/g, '');
    const updatedDescription = `Updated branch expense ${uniqueTag}`;
    const updatedNotes = RandomDataFaker.notes('Initial Insert');

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const incurredDate = `${yyyy}-${mm}-${dd}`;

    await test.step('Create a new Branch Reimbursement', async () => {
      await newSubmissionPage.openNewSubmissionPage();
      await newSubmissionPage.enterAmount(originalAmount);
      await newSubmissionPage.selectExpenseCategory('63010 Meals & Entertainment');
      await newSubmissionPage.enterIncurredDate(incurredDate);
      await newSubmissionPage.selectBranchCostCenter(branchNewSubmissionCostCenterAt(0));
      await newSubmissionPage.enterVendorName(originalVendor);
      await newSubmissionPage.uploadSupportingDocument('testdata/Receipt.jpg');
      await newSubmissionPage.expectUploadedFilePill('Receipt.jpg');
      await newSubmissionPage.enterDescription(originalDescription);
      await newSubmissionPage.clickSubmit();
      await newSubmissionPage.expectSubmissionSuccessful();
    });

    await test.step('Open created record details from Branch History', async () => {
      await historyPage.openBranchHistoryPage();
      await historyPage.searchBranchHistory(originalVendor);
      const createdRow = page.locator('tbody tr:not(.child)', { hasText: originalVendor }).first();
      await expect(createdRow).toBeVisible({ timeout: 20_000 });
      await historyPage.openBranchHistoryDetailsForRow(createdRow);
      await expect(page).toHaveURL(/\/ActionCenter\/CostactionCenter\?ID=/i);
    });

    await test.step('Open Edit and update record values', async () => {
      await historyPage.openEditFromDetails();
      await historyPage.editAmountInput.fill(updatedAmount);
      await historyPage.editVendorNameInput.fill(updatedVendor);
      await historyPage.editDescriptionInput.fill(updatedDescription);
      await historyPage.editSupportingDocumentsInput.setInputFiles('testdata/Receipt.png');
      await historyPage.notesInput.fill(updatedNotes);
      await historyPage.clickUpdateInformation();
      await historyPage.expectUpdateBranchExpenseSuccessMessageVisible();
    });

    await test.step('Verify record is accessible in Branch History after update action', async () => {
      await historyPage.openBranchHistoryPage();
      await historyPage.searchBranchHistory(updatedVendor);
      const row = page.locator('tbody tr:not(.child)', { hasText: updatedVendor }).first();
      await expect(row).toContainText(updatedAmount);

      await expect(row).toBeVisible({ timeout: 20_000 });
    });
  });
});
