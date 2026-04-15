import { expect, test } from '@playwright/test';
import { BranchVendorPaymentsHistoryPage } from '../../../../pages/BranchVendorPayments/BranchVendorPaymentsHistoryPage';
import { RequestVendorPaymentPage } from '../../../../pages/BranchVendorPayments/RequestVendorPaymentPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { branchNewSubmissionCostCenterAt } from '../../../../utils/branchCostCenters';
import { branchVendorPaymentVendorNameAt } from '../../../../utils/branchVendorNames';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BVP-001 Submit vendor payment request and verify in History', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Submit vendor payment with valid fields and verify record in History', async ({ page }) => {
   

    const requestVendorPaymentPage = new RequestVendorPaymentPage(page);
    const historyPage = new BranchVendorPaymentsHistoryPage(page);

    const amount = RandomDataFaker.amount(700, 950);
    const amountCell = `$${Number(amount).toFixed(2)}`;
    const expenseCategoryValue = '63130 Office Supplies';
    const vendorName = branchVendorPaymentVendorNameAt(2);
    const description = RandomDataFaker.expenseDescription();

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const incurredDate = `${yyyy}-${mm}-${dd}`;

    await test.step('Request Vendor Payment - fill all required fields and submit', async () => {
      await requestVendorPaymentPage.openRequestVendorPaymentPage();

      await expect(requestVendorPaymentPage.amountInput).toBeVisible();
      await expect(requestVendorPaymentPage.expenseCategoryDropdown).toBeVisible();
      await expect(requestVendorPaymentPage.incurredDateInput).toBeVisible();
      await expect(requestVendorPaymentPage.costCenterDropdown).toBeVisible();
      await expect(requestVendorPaymentPage.vendorNameDropdown).toBeVisible();
      await expect(requestVendorPaymentPage.supportingDocumentsButton).toBeVisible();
      await expect(requestVendorPaymentPage.descriptionInput).toBeVisible();

      await requestVendorPaymentPage.enterAmount(amount);
      await requestVendorPaymentPage.selectExpenseCategory(expenseCategoryValue);
      await requestVendorPaymentPage.enterIncurredDate(incurredDate);
      await requestVendorPaymentPage.selectBranchCostCenter(branchNewSubmissionCostCenterAt(0));
      await requestVendorPaymentPage.selectBranchVendorName(vendorName);
      await requestVendorPaymentPage.uploadSupportingDocument('testdata/Receipt.pdf');
      await requestVendorPaymentPage.expectUploadedFilePill('Receipt.pdf');
      await requestVendorPaymentPage.enterDescription(description);
      await requestVendorPaymentPage.clickSubmit();
      await requestVendorPaymentPage.expectSubmissionSuccessful();
    });

    await test.step('History - verify columns and submitted row values', async () => {
      await historyPage.openBranchVendorPaymentsHistoryPage();

      await expect(historyPage.vendorNameHeader).toBeVisible();
      await expect(historyPage.amountHeader).toBeVisible();
      await expect(historyPage.statusHeader).toBeVisible();
      await expect(historyPage.lastUpdatedDateHeader).toBeVisible();
      await expect(historyPage.actionHeader).toBeVisible();

      await historyPage.waitForSubmittedVendorRowVisible(vendorName, amountCell);
    });
  });
});
