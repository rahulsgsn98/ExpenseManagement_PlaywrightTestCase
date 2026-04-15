import { expect, test } from '@playwright/test';
import { BranchVendorPaymentsHistoryPage } from '../../../../pages/BranchVendorPayments/BranchVendorPaymentsHistoryPage';
import { RequestVendorPaymentPage } from '../../../../pages/BranchVendorPayments/RequestVendorPaymentPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { branchNewSubmissionCostCenterAt } from '../../../../utils/branchCostCenters';
import {
  BRANCH_VENDOR_PAYMENT_VENDOR_NAMES,
  branchVendorPaymentVendorNameAt
} from '../../../../utils/branchVendorNames';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BVP-005 Vendor Name dropdown and history persistence', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Vendor dropdown lists configured vendors, allows reselection, and saves final selection', async ({ page }) => {
    const requestVendorPaymentPage = new RequestVendorPaymentPage(page);
    const historyPage = new BranchVendorPaymentsHistoryPage(page);

    const amount = RandomDataFaker.amount(550, 900);
    const amountCell = `$${Number(amount).toFixed(2)}`;
    const description = RandomDataFaker.expenseDescription();
    const expenseCategoryValue = '63130 Office Supplies';
    const firstVendor = branchVendorPaymentVendorNameAt(0);
    const finalVendor = branchVendorPaymentVendorNameAt(2);
    const secondVendor = branchVendorPaymentVendorNameAt(1);

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const incurredDate = `${yyyy}-${mm}-${dd}`;

    await test.step('Vendor Name dropdown - verify configured options and DH Elite presence', async () => {
      await requestVendorPaymentPage.openRequestVendorPaymentPage();
      await requestVendorPaymentPage.vendorNameDropdown.click();

      const domValues = (await requestVendorPaymentPage.getVendorOptionValues())
        .map((v) => v.trim())
        .filter((v) => v.length > 0);

      expect(domValues.length, 'At least one vendor should be configured').toBeGreaterThan(0);
      expect(domValues).toContain('DH Elite Processing');
      for (const vendor of BRANCH_VENDOR_PAYMENT_VENDOR_NAMES) {
        expect(domValues, `Dropdown should include configured vendor ${vendor}`).toContain(vendor);
      }
    });

    await test.step('Vendor Name dropdown - select one vendor, then reselect a different vendor', async () => {
      await requestVendorPaymentPage.selectVendorName(firstVendor);
      await expect(requestVendorPaymentPage.vendorNameDropdown).toHaveValue(firstVendor);

      await requestVendorPaymentPage.selectVendorName(secondVendor);
      await expect(requestVendorPaymentPage.vendorNameDropdown).toHaveValue(secondVendor);
    });

    await test.step('Request Vendor Payment - fill remaining required fields and submit', async () => {
      await requestVendorPaymentPage.enterAmount(amount);
      await requestVendorPaymentPage.selectExpenseCategory(expenseCategoryValue);
      await requestVendorPaymentPage.enterIncurredDate(incurredDate);
      await requestVendorPaymentPage.selectBranchCostCenter(branchNewSubmissionCostCenterAt(0));
      await requestVendorPaymentPage.uploadSupportingDocument('testdata/Receipt.pdf');
      await requestVendorPaymentPage.expectUploadedFilePill('Receipt.pdf');
      await requestVendorPaymentPage.enterDescription(description);
      await requestVendorPaymentPage.clickSubmit();
      await requestVendorPaymentPage.expectSubmissionSuccessful();
    });

    await test.step('History - verify the submitted row uses the final selected vendor', async () => {
      await historyPage.openBranchVendorPaymentsHistoryPage();

      await expect(historyPage.vendorNameHeader).toBeVisible();
      await expect(historyPage.amountHeader).toBeVisible();
      await expect(historyPage.statusHeader).toBeVisible();
      await expect(historyPage.lastUpdatedDateHeader).toBeVisible();
      await expect(historyPage.actionHeader).toBeVisible();

      await historyPage.waitForSubmittedVendorRowVisible(secondVendor, amountCell);
    });
  });
});
