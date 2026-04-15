import { expect, test } from '@playwright/test';
import { BranchReimbursementHistoryPage } from '../../../../pages/BranchReimbursement/BranchReimbursementHistoryPage';
import { NewSubmissionPage } from '../../../../pages/BranchReimbursement/NewSubmissionPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { branchNewSubmissionCostCenterAt } from '../../../../utils/branchCostCenters';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BR-001 Submit branch reimbursement and verify in History', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Submit with all valid fields and verify record in Branch Reimbursement History', async ({ page }) => {
    const newSubmissionPage = new NewSubmissionPage(page);
    const branchHistoryPage = new BranchReimbursementHistoryPage(page);

    const amount = RandomDataFaker.amount(300, 600);
    const amountCell = `$${Number(amount).toFixed(2)}`;
    const expenseCategoryValue = '63130 Office Supplies';
    const vendorName = RandomDataFaker.vendorName();
    const description = RandomDataFaker.expenseDescription();
    const supportingDocumentPath = 'testdata/Receipt.pdf';
    const supportingDocumentFileName = 'Receipt.pdf';

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const incurredDate = `${yyyy}-${mm}-${dd}`;

    await test.step('New Submission — fill all fields and submit', async () => {
      await newSubmissionPage.openNewSubmissionPage();

      await expect(newSubmissionPage.amountInput).toBeVisible();
      await expect(newSubmissionPage.expenseCategoryDropdown).toBeVisible();
      await expect(newSubmissionPage.incurredDateInput).toBeVisible();
      await expect(newSubmissionPage.costCenterDropdown).toBeVisible();
      await expect(newSubmissionPage.vendorNameInput).toBeVisible();
      await expect(newSubmissionPage.supportingDocumentsButton).toBeVisible();
      await expect(newSubmissionPage.descriptionInput).toBeVisible();

      await newSubmissionPage.enterAmount(amount);
      await expect(newSubmissionPage.amountInput).toHaveValue(amount);

      await newSubmissionPage.selectExpenseCategory(expenseCategoryValue);
      await expect(newSubmissionPage.expenseCategoryDropdown).toHaveValue(expenseCategoryValue);

      await newSubmissionPage.enterIncurredDate(incurredDate);
      await expect(newSubmissionPage.incurredDateInput).toHaveValue(incurredDate);

      await newSubmissionPage.selectBranchCostCenter(branchNewSubmissionCostCenterAt(0));

      await newSubmissionPage.enterVendorName(vendorName);
      await expect(newSubmissionPage.vendorNameInput).toHaveValue(vendorName);

      await newSubmissionPage.uploadSupportingDocument(supportingDocumentPath);
      await newSubmissionPage.expectUploadedFilePill(supportingDocumentFileName);

      await newSubmissionPage.enterDescription(description);
      await expect(newSubmissionPage.descriptionInput).toHaveValue(description);

      await newSubmissionPage.clickSubmit();
      await newSubmissionPage.expectSubmissionSuccessful();
    });

    await test.step('Branch Reimbursement History — verify columns and submitted row', async () => {
      await branchHistoryPage.openBranchHistoryPage();

      await expect(branchHistoryPage.branchExpenseIdHeader).toBeVisible();
      await expect(branchHistoryPage.vendorNameHeader).toBeVisible();
      await expect(branchHistoryPage.amountHeader).toBeVisible();
      await expect(branchHistoryPage.statusHeader).toBeVisible();

      await branchHistoryPage.searchBranchHistory(vendorName);
      const recordRow = branchHistoryPage.branchHistoryMainDataRow(vendorName, amountCell);
      await expect(recordRow).toBeVisible({ timeout: 20_000 });
      await expect(recordRow).toContainText(amountCell);
      await expect(recordRow).toContainText('Submitted');
    });
  });
});
