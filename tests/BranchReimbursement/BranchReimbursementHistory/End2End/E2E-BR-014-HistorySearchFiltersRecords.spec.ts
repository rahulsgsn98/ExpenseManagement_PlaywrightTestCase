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

test.describe('E2E-BR-014 Branch History search filters records', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Search filters, clears, and empty-state behavior', async ({ page }) => {
    const newSubmissionPage = new NewSubmissionPage(page);
    const branchHistoryPage = new BranchReimbursementHistoryPage(page);

    const amount = RandomDataFaker.amount(120, 320);
    const expenseCategoryValue = '63020 Travel';
    const vendorName = `Search-${RandomDataFaker.vendorName()}-${Date.now()}`;
    const description = RandomDataFaker.expenseDescription();
    const noMatchKeyword = `NO_MATCH_BR_${Date.now()}`;

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const incurredDate = `${yyyy}-${mm}-${dd}`;

    await test.step('Create a Branch Reimbursement record for search validation', async () => {
      await newSubmissionPage.openNewSubmissionPage();
      await newSubmissionPage.enterAmount(amount);
      await newSubmissionPage.selectExpenseCategory(expenseCategoryValue);
      await newSubmissionPage.enterIncurredDate(incurredDate);
      await newSubmissionPage.selectBranchCostCenter(branchNewSubmissionCostCenterAt(0));
      await newSubmissionPage.enterVendorName(vendorName);
      await newSubmissionPage.uploadSupportingDocument('testdata/Receipt.jpg');
      await newSubmissionPage.expectUploadedFilePill('Receipt.jpg');
      await newSubmissionPage.enterDescription(description);
      await newSubmissionPage.clickSubmit();
      await newSubmissionPage.expectSubmissionSuccessful();
    });

    await test.step('Search filters by vendor keyword', async () => {
      await branchHistoryPage.openBranchHistoryPage();
      await branchHistoryPage.searchBranchHistory(vendorName);
      const filteredRow = page.locator('tbody tr:not(.child)', { hasText: vendorName }).first();
      await expect(filteredRow).toBeVisible({ timeout: 20_000 });
    });

    await test.step('Clear search and verify rows are visible again', async () => {
      await branchHistoryPage.searchBranchHistory('');
      await expect(branchHistoryPage.branchHistoryTableWrapper.locator('tbody tr:not(.child)').first()).toBeVisible();
    });

    await test.step('Search non-existent keyword and verify empty state', async () => {
      await branchHistoryPage.searchBranchHistory(noMatchKeyword);
      await expect(branchHistoryPage.branchHistoryTableWrapper.getByText('No matching records found')).toBeVisible();
    });

    await test.step('Clear search again and verify rows restored', async () => {
      await branchHistoryPage.searchBranchHistory('');
      await expect(branchHistoryPage.branchHistoryTableWrapper.locator('tbody tr:not(.child)').first()).toBeVisible();
    });
  });
});
