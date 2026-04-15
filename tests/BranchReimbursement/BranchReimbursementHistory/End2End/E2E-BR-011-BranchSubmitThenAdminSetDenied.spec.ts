import { expect, test } from '@playwright/test';
import { BranchReimbursementHistoryPage } from '../../../../pages/BranchReimbursement/BranchReimbursementHistoryPage';
import { NewSubmissionPage } from '../../../../pages/BranchReimbursement/NewSubmissionPage';
import { RoleBasedPage } from '../../../../pages/RoleBasedPage';
import { branchNewSubmissionCostCenterAt } from '../../../../utils/branchCostCenters';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

const TARGET_STATUS = 'Denied' as const;

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BR-011 Branch submit then Admin sets Denied', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Branch Manager submits, Super Admin sets Denied, Branch History shows Denied', async ({ page }) => {
    const newSubmissionPage = new NewSubmissionPage(page);
    const branchHistoryPage = new BranchReimbursementHistoryPage(page);
    const roleBasedPage = new RoleBasedPage(page);

    const amount = RandomDataFaker.amount(260, 460);
    const amountCell = `$${Number(amount).toFixed(2)}`;
    const expenseCategoryValue = '63020 Travel';
    const vendorName = RandomDataFaker.vendorName();
    const description = RandomDataFaker.expenseDescription();

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const incurredDate = `${yyyy}-${mm}-${dd}`;
    let branchExpenseId = '';

    await test.step('Branch Manager — submit Branch Reimbursement', async () => {
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

    await test.step('Branch Manager — capture submitted record id', async () => {
      await branchHistoryPage.openBranchHistoryPage();
      await branchHistoryPage.searchBranchHistory(vendorName);
      const beforeRow = branchHistoryPage.branchHistoryMainDataRow(vendorName, amountCell);
      await expect(beforeRow).toBeVisible({ timeout: 20_000 });
      await expect(beforeRow).toContainText('Submitted');
      branchExpenseId = (await beforeRow.locator('td').first().innerText()).trim();
      expect(branchExpenseId.length).toBeGreaterThan(0);
    });

    await test.step(`Super Admin — set status to ${TARGET_STATUS}`, async () => {
      await roleBasedPage.ensureActiveRole('Super Admin');
      await branchHistoryPage.openBranchHistoryPage();
      await branchHistoryPage.searchBranchHistory(branchExpenseId);
      const adminRow = page.locator('tbody tr:not(.child)', { hasText: branchExpenseId }).first();
      await expect(adminRow).toBeVisible({ timeout: 20_000 });
      await branchHistoryPage.openBranchHistoryDetailsForRow(adminRow);
      await branchHistoryPage.selectDetailsStatus(TARGET_STATUS);
      await branchHistoryPage.uploadDetailsSupportingDocument('testdata/Receipt.png');
      await branchHistoryPage.fillRemarksToSubmitter(`${TARGET_STATUS} by automation for ${branchExpenseId}`);
      await branchHistoryPage.fillComment(`Updating ${branchExpenseId} to ${TARGET_STATUS} from Internal Finance Team`);
      await branchHistoryPage.clickUpdate();
    });

    await test.step(`Branch Manager — verify ${TARGET_STATUS} in History`, async () => {
      await roleBasedPage.ensureActiveRole('Branch Manager');
      await expect
        .poll(
          async () => {
            await branchHistoryPage.openBranchHistoryPage();
            await branchHistoryPage.searchBranchHistory(branchExpenseId);
            const afterRow = page.locator('tbody tr:not(.child)', { hasText: branchExpenseId }).first();
            await expect(afterRow).toBeVisible({ timeout: 20_000 });
            return (await afterRow.innerText()).replace(/\s+/g, ' ');
          },
          { timeout: 45_000, intervals: [1000, 2000, 3000, 5000] }
        )
        .toContain(TARGET_STATUS);
    });
  });
});
