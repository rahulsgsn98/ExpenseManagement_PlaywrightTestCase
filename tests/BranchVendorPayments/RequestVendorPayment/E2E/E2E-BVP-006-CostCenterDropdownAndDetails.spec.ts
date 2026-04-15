import { expect, test } from '@playwright/test';
import { BranchVendorPaymentsHistoryPage } from '../../../../pages/BranchVendorPayments/BranchVendorPaymentsHistoryPage';
import { RequestVendorPaymentPage } from '../../../../pages/BranchVendorPayments/RequestVendorPaymentPage';
import {
  BRANCH_NEW_SUBMISSION_COST_CENTER_IDS,
  branchNewSubmissionCostCenterAt
} from '../../../../utils/branchCostCenters';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { branchVendorPaymentVendorNameAt } from '../../../../utils/branchVendorNames';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BVP-006 Cost Center ID dropdown and Details', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Dropdown lists configured centers; selected value saves and appears on Details', async ({ page }) => {
    const requestVendorPaymentPage = new RequestVendorPaymentPage(page);
    const historyPage = new BranchVendorPaymentsHistoryPage(page);

    const amount = RandomDataFaker.amount(300, 650);
    const amountCell = `$${Number(amount).toFixed(2)}`;
    const expenseCategoryValue = '63130 Office Supplies';
    const vendorName = branchVendorPaymentVendorNameAt(1);
    const description = RandomDataFaker.expenseDescription();
    const supportingDocumentPath = 'testdata/Receipt.jpg';
    const supportingDocumentFileName = 'Receipt.jpg';

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const incurredDate = `${yyyy}-${mm}-${dd}`;

    await test.step('Cost Center ID - verify all configured options exist in dropdown', async () => {
      await requestVendorPaymentPage.openRequestVendorPaymentPage();
      await requestVendorPaymentPage.costCenterDropdown.click();

      const domValues = (await requestVendorPaymentPage.getCostCenterOptionValues())
        .map((v) => v.trim())
        .filter((v) => v.length > 0);

      expect(domValues.length, 'At least one cost center should be configured').toBeGreaterThan(0);
      for (const id of BRANCH_NEW_SUBMISSION_COST_CENTER_IDS) {
        expect(domValues, `Dropdown should include configured center ${id}`).toContain(id);
      }
    });

    await test.step('Cost Center ID - select configured center (index 0)', async () => {
      await requestVendorPaymentPage.selectBranchCostCenter(branchNewSubmissionCostCenterAt(0));
      const selectedValue = await requestVendorPaymentPage.costCenterDropdown.inputValue();
      expect(BRANCH_NEW_SUBMISSION_COST_CENTER_IDS).toContain(
        selectedValue as (typeof BRANCH_NEW_SUBMISSION_COST_CENTER_IDS)[number]
      );
    });

    const selectedValue = await requestVendorPaymentPage.costCenterDropdown.inputValue();
    const selectedLabel =
      (await requestVendorPaymentPage.costCenterDropdown.locator('option:checked').textContent())?.trim() ?? '';

    await test.step('Request Vendor Payment - fill remaining fields and submit', async () => {
      await requestVendorPaymentPage.enterAmount(amount);
      await requestVendorPaymentPage.selectExpenseCategory(expenseCategoryValue);
      await requestVendorPaymentPage.enterIncurredDate(incurredDate);
      await requestVendorPaymentPage.selectBranchVendorName(vendorName);
      await requestVendorPaymentPage.uploadSupportingDocument(supportingDocumentPath);
      await requestVendorPaymentPage.expectUploadedFilePill(supportingDocumentFileName);
      await requestVendorPaymentPage.enterDescription(description);
      await requestVendorPaymentPage.clickSubmit();
      await requestVendorPaymentPage.expectSubmissionSuccessful();
    });

    await test.step('History Details - verify same Cost Center ID value', async () => {
      await historyPage.openBranchVendorPaymentsHistoryPage();
      await historyPage.waitForSubmittedVendorRowVisible(vendorName, amountCell);

      await historyPage.searchHistory(vendorName);
      const recordRow = historyPage.historyMainRow(vendorName, amountCell);
      await expect(recordRow).toBeVisible({ timeout: 20_000 });
      await historyPage.openHistoryDetailsForRow(recordRow);

      await expect(page.locator('body')).toContainText(selectedValue);
      if (selectedLabel.length > 0 && selectedLabel !== selectedValue) {
        await expect(page.locator('body')).toContainText(selectedLabel);
      }
    });
  });
});
