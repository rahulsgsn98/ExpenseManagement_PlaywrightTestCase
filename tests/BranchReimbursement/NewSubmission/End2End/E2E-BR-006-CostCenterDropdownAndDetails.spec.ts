import { expect, test } from '@playwright/test';
import { BranchReimbursementHistoryPage } from '../../../../pages/BranchReimbursement/BranchReimbursementHistoryPage';
import { NewSubmissionPage } from '../../../../pages/BranchReimbursement/NewSubmissionPage';
import {
  BRANCH_NEW_SUBMISSION_COST_CENTER_IDS,
  branchNewSubmissionCostCenterAt
} from '../../../../utils/branchCostCenters';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BR-006 Cost Center ID dropdown and Details', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Dropdown lists configured centers; first selection saves and appears on Details', async ({ page }) => {
    const newSubmissionPage = new NewSubmissionPage(page);
    const branchHistoryPage = new BranchReimbursementHistoryPage(page);

    const amount = RandomDataFaker.amount(240, 420);
    const amountCell = `$${Number(amount).toFixed(2)}`;
    const expenseCategoryValue = '63130 Office Supplies';
    const vendorName = RandomDataFaker.vendorName();
    const description = RandomDataFaker.expenseDescription();
    const supportingDocumentPath = 'testdata/Receipt.jpg';
    const supportingDocumentFileName = 'Receipt.jpg';

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const incurredDate = `${yyyy}-${mm}-${dd}`;

    await test.step('Cost Center ID — open form, verify all configured options exist', async () => {
      await newSubmissionPage.openNewSubmissionPage();
      await newSubmissionPage.costCenterDropdown.click();

      const domValues = (await newSubmissionPage.getCostCenterOptionValues())
        .map((v) => v.trim())
        .filter((v) => v.length > 0);

      expect(domValues.length, 'At least one cost center should be configured').toBeGreaterThan(0);

      for (const id of BRANCH_NEW_SUBMISSION_COST_CENTER_IDS) {
        expect(domValues, `Dropdown should include configured center ${id}`).toContain(id);
      }
    });

    await test.step('Cost Center ID — select first configured center (index 0)', async () => {
      await newSubmissionPage.selectBranchCostCenter(branchNewSubmissionCostCenterAt(0));
      const selectedValue = await newSubmissionPage.costCenterDropdown.inputValue();
      expect(BRANCH_NEW_SUBMISSION_COST_CENTER_IDS).toContain(selectedValue as (typeof BRANCH_NEW_SUBMISSION_COST_CENTER_IDS)[number]);
    });

    const selectedValue = await newSubmissionPage.costCenterDropdown.inputValue();
    const selectedLabel =
      (await newSubmissionPage.costCenterDropdown.locator('option:checked').textContent())?.trim() ?? '';

    await test.step('New Submission — fill remaining fields and submit', async () => {
      await newSubmissionPage.enterAmount(amount);
      await newSubmissionPage.selectExpenseCategory(expenseCategoryValue);
      await newSubmissionPage.enterIncurredDate(incurredDate);
      await newSubmissionPage.enterVendorName(vendorName);
      await newSubmissionPage.uploadSupportingDocument(supportingDocumentPath);
      await newSubmissionPage.expectUploadedFilePill(supportingDocumentFileName);
      await newSubmissionPage.enterDescription(description);
      await newSubmissionPage.clickSubmit();
      await newSubmissionPage.expectSubmissionSuccessful();
    });

    await test.step('History — Details shows same Cost Center ID', async () => {
      await branchHistoryPage.openBranchHistoryPage();
      await branchHistoryPage.searchBranchHistory(vendorName);
      const recordRow = branchHistoryPage.branchHistoryMainDataRow(vendorName, amountCell);
      await expect(recordRow).toBeVisible({ timeout: 20_000 });
      await branchHistoryPage.openBranchHistoryDetailsForRow(recordRow);

      await expect(page.getByText('Cost Center ID', { exact: true }).first()).toBeVisible();
      await expect(page.locator('body')).toContainText(selectedValue);
      if (selectedLabel.length > 0 && selectedLabel !== selectedValue) {
        await expect(page.locator('body')).toContainText(selectedLabel);
      }
    });
  });
});
