import { expect, test } from '@playwright/test';
import { BranchReimbursementHistoryPage } from '../../../../pages/BranchReimbursement/BranchReimbursementHistoryPage';
import { NewSubmissionPage } from '../../../../pages/BranchReimbursement/NewSubmissionPage';
import { branchNewSubmissionCostCenterAt } from '../../../../utils/branchCostCenters';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BR-007 Branch Reimbursement History columns and data', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Submit $600 Travel / Lufthansa; History shows all columns and correct row data', async ({ page }) => {
    const newSubmissionPage = new NewSubmissionPage(page);
    const branchHistoryPage = new BranchReimbursementHistoryPage(page);

    const amount = '600';
    const amountCell = '$600.00';
    const expenseCategoryValue = '63020 Travel';
    const vendorName = 'Lufthansa';
    const description = 'International conference travel';
    const supportingDocumentPath = 'testdata/Receipt.pdf';
    const supportingDocumentFileName = 'Receipt.pdf';

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const incurredDate = `${yyyy}-${mm}-${dd}`;

    await test.step('New Submission — case data ($600, Travel, Lufthansa, PDF)', async () => {
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

    await test.step('History — grid column headers (live UI: four data columns)', async () => {
      await branchHistoryPage.openBranchHistoryPage();

      const table = branchHistoryPage.branchHistoryTableWrapper;
      await expect(table.getByRole('columnheader', { name: /Branch Expense ID:/i }).first()).toBeVisible();
      await expect(table.getByRole('columnheader', { name: /Vendor Name:/i }).first()).toBeVisible();
      await expect(table.getByRole('columnheader', { name: /Amount:/i }).first()).toBeVisible();
      await expect(table.getByRole('columnheader', { name: /Status:/i }).first()).toBeVisible();
    });

    await test.step('History — new row: Branch Expense ID, vendor, amount, status; Details after expand', async () => {
      await branchHistoryPage.searchBranchHistory(vendorName);
      const recordRow = branchHistoryPage.branchHistoryMainDataRow(vendorName, amountCell);
      await expect(recordRow).toBeVisible({ timeout: 20_000 });

      const branchExpenseIdCell = (await recordRow.locator('td').first().innerText()).trim();
      expect(branchExpenseIdCell.length).toBeGreaterThan(0);
      expect(branchExpenseIdCell).toMatch(/-\s*\d+/);

      await expect(recordRow).toContainText(vendorName);
      await expect(recordRow).toContainText(amountCell);
      await expect(recordRow).toContainText('Submitted');

      await recordRow.locator('td, th').first().click();
      const detailsLink = page.getByRole('link', { name: 'Details' }).first();
      await expect(detailsLink).toBeVisible();
      await expect(detailsLink).toBeEnabled();
    });
  });
});
