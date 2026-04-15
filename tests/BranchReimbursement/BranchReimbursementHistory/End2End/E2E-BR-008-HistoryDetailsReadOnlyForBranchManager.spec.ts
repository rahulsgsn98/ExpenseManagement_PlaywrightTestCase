import { expect, test } from '@playwright/test';
import { TestConfig } from '../../../../test.config';
import { BranchReimbursementHistoryPage } from '../../../../pages/BranchReimbursement/BranchReimbursementHistoryPage';
import { NewSubmissionPage } from '../../../../pages/BranchReimbursement/NewSubmissionPage';
import { branchNewSubmissionCostCenterAt } from '../../../../utils/branchCostCenters';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

const testConfig = new TestConfig();

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BR-008 History Details for Branch Manager', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('New Submission then Details shows submission fields; no Internal Finance status controls', async ({
    page
  }) => {
    const newSubmissionPage = new NewSubmissionPage(page);
    const branchHistoryPage = new BranchReimbursementHistoryPage(page);

    const amount = RandomDataFaker.amount(280, 520);
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
    const incurredDate = `${yyyy}-${mm}-${dd}`;

    const m = today.getMonth() + 1;
    const d = today.getDate();
    const usSlashVariants = [...new Set([`${m}/${d}/${yyyy}`, `${mm}/${dd}/${yyyy}`])];
    const usSlashPattern = new RegExp(
      usSlashVariants.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
    );

    await test.step('New Submission — create a record for Details', async () => {
      await newSubmissionPage.openNewSubmissionPage();
      await newSubmissionPage.enterAmount(amount);
      await newSubmissionPage.selectExpenseCategory(expenseCategoryValue);
      await newSubmissionPage.enterIncurredDate(incurredDate);
      await newSubmissionPage.selectBranchCostCenter(branchNewSubmissionCostCenterAt(0));
      await newSubmissionPage.enterVendorName(vendorName);
      await newSubmissionPage.uploadSupportingDocument(supportingDocumentPath);
      await newSubmissionPage.expectUploadedFilePill(supportingDocumentFileName);
      await newSubmissionPage.enterDescription(description);
      await newSubmissionPage.clickSubmit();
      await newSubmissionPage.expectSubmissionSuccessful();
    });

    await test.step('History — open Details for the new row', async () => {
      await branchHistoryPage.openBranchHistoryPage();
      await branchHistoryPage.searchBranchHistory(vendorName);
      const recordRow = branchHistoryPage.branchHistoryMainDataRow(vendorName, amountCell);
      await expect(recordRow).toBeVisible({ timeout: 20_000 });
      const branchExpenseIdSnippet = (await recordRow.locator('td').first().innerText())
        .replace(/\s+/g, ' ')
        .trim();
      expect(branchExpenseIdSnippet.length).toBeGreaterThan(0);

      await branchHistoryPage.openBranchHistoryDetailsForRow(recordRow);

      await expect(page).toHaveURL(/\/ActionCenter\/CostactionCenter\?ID=/i);

      const body = page.locator('body');
      await expect(body).toContainText(branchExpenseIdSnippet);

      await expect(page.getByText('Cost Center ID', { exact: true }).first()).toBeVisible();
      await expect(page.getByText('Full Name', { exact: true }).first()).toBeVisible();
      await expect(body).toContainText(vendorName);

      await expect(page.getByText('Expense Category', { exact: true }).first()).toBeVisible();
      await expect(body).toContainText(expenseCategoryValue);

      await expect(page.getByText('Amount', { exact: true }).first()).toBeVisible();
      await expect(body).toContainText(amountCell);

      await expect(page.getByText('Approved Amount', { exact: true }).first()).toBeVisible();

      const accruedOrIncurred = page
        .getByText('Accrued Date', { exact: true })
        .or(page.getByText('Incurred Date', { exact: true }));
      await expect(accruedOrIncurred.first()).toBeVisible();
      await expect(body).toContainText(usSlashPattern);

      await expect(page.getByText('Submission Date', { exact: true }).first()).toBeVisible();
      await expect(body).toContainText(/\d{1,2}\/\d{1,2}\/\d{4}/);

      await expect(page.getByText('Submitted By', { exact: true }).first()).toBeVisible();
      await expect(body).toContainText(new RegExp(testConfig.e2eEmployeeDisplayNameRegexSource, 'i'));
    });

    await test.step('Details — Internal Finance / status update controls not available', async () => {
      await expect(page.getByText(/Internal Finance Team/i)).not.toBeVisible();
      await expect(branchHistoryPage.detailsStatusDropdown).not.toBeVisible();
      await expect(branchHistoryPage.detailsUpdateButton).not.toBeVisible();
    });

    await test.step('Return to History — submitted row still listed', async () => {
      await branchHistoryPage.openBranchHistoryPage();
      await expect(branchHistoryPage.historyPageHeading).toBeVisible();
      await branchHistoryPage.searchBranchHistory(vendorName);
      const recordRowAgain = branchHistoryPage.branchHistoryMainDataRow(vendorName, amountCell);
      await expect(recordRowAgain).toBeVisible({ timeout: 20_000 });
    });
  });
});
