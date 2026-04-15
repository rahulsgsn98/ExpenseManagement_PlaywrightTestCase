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

test.describe('E2E-BR-005 Incurred Date saved and shown on Details', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Incurred Date accepts today, clear, re-enter today; Details shows same incurred date', async ({ page }) => {
    const newSubmissionPage = new NewSubmissionPage(page);
    const branchHistoryPage = new BranchReimbursementHistoryPage(page);

    const amount = RandomDataFaker.amount(220, 380);
    const amountCell = `$${Number(amount).toFixed(2)}`;
    const expenseCategoryValue = '63020 Travel';
    const vendorName = RandomDataFaker.vendorName();
    const description = RandomDataFaker.expenseDescription();
    const supportingDocumentPath = 'testdata/Receipt.jpg';
    const supportingDocumentFileName = 'Receipt.jpg';

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const todayIso = `${yyyy}-${mm}-${dd}`;

    const m = today.getMonth() + 1;
    const d = today.getDate();
    const usSlashVariants = [...new Set([`${m}/${d}/${yyyy}`, `${mm}/${dd}/${yyyy}`])];
    const usSlashPattern = new RegExp(
      usSlashVariants.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
    );

    await test.step('Incurred Date — focus field, set today, clear, re-enter today', async () => {
      await newSubmissionPage.openNewSubmissionPage();
      await newSubmissionPage.incurredDateInput.click();
      await newSubmissionPage.enterIncurredDate(todayIso);
      await expect(newSubmissionPage.incurredDateInput).toHaveValue(todayIso);

      await newSubmissionPage.incurredDateInput.clear();
      await newSubmissionPage.enterIncurredDate(todayIso);
      await expect(newSubmissionPage.incurredDateInput).toHaveValue(todayIso);
    });

    await test.step('New Submission — fill remaining fields and submit', async () => {
      await newSubmissionPage.enterAmount(amount);
      await newSubmissionPage.selectExpenseCategory(expenseCategoryValue);
      await newSubmissionPage.selectBranchCostCenter(branchNewSubmissionCostCenterAt(0));
      await newSubmissionPage.enterVendorName(vendorName);
      await newSubmissionPage.uploadSupportingDocument(supportingDocumentPath);
      await newSubmissionPage.expectUploadedFilePill(supportingDocumentFileName);
      await newSubmissionPage.enterDescription(description);
      await newSubmissionPage.clickSubmit();
      await newSubmissionPage.expectSubmissionSuccessful();
    });

    await test.step('History — open Details and verify Incurred Date', async () => {
      await branchHistoryPage.openBranchHistoryPage();
      await branchHistoryPage.searchBranchHistory(vendorName);
      const recordRow = branchHistoryPage.branchHistoryMainDataRow(vendorName, amountCell);
      await expect(recordRow).toBeVisible({ timeout: 20_000 });
      await branchHistoryPage.openBranchHistoryDetailsForRow(recordRow);

      //check if the incurred date is visible
      await expect(page.getByText('Incurred Date', { exact: true }).first()).toBeVisible();
      await expect(page.locator('body')).toContainText(usSlashPattern);
    });
  });
});
