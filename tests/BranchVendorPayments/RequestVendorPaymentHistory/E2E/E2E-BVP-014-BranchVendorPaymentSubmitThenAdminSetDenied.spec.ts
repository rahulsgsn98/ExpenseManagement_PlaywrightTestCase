import { expect, test } from '@playwright/test';
import { BranchVendorPaymentsHistoryPage } from '../../../../pages/BranchVendorPayments/BranchVendorPaymentsHistoryPage';
import { RequestVendorPaymentPage } from '../../../../pages/BranchVendorPayments/RequestVendorPaymentPage';
import { RoleBasedPage } from '../../../../pages/RoleBasedPage';
import { branchNewSubmissionCostCenterAt } from '../../../../utils/branchCostCenters';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { branchVendorPaymentVendorNameAt } from '../../../../utils/branchVendorNames';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

const TARGET_STATUS = 'Denied' as const;

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BVP-014 Branch Vendor Payment submit then Admin sets Denied', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Branch Manager submits, Super Admin sets Denied, Branch History shows Denied', async ({ page }) => {
    const requestVendorPaymentPage = new RequestVendorPaymentPage(page);
    const branchVendorHistoryPage = new BranchVendorPaymentsHistoryPage(page);
    const roleBasedPage = new RoleBasedPage(page);

    const amount = RandomDataFaker.amount(2500, 2599);
    const amountCell = `$${Number(amount).toFixed(2)}`;
    const expenseCategoryValue = '63020 Travel';
    const vendorName = branchVendorPaymentVendorNameAt(2);
    const description = RandomDataFaker.expenseDescription();

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const incurredDate = `${yyyy}-${mm}-${dd}`;
    await test.step('Branch Manager — submit Vendor Payment request', async () => {
      await requestVendorPaymentPage.openRequestVendorPaymentPage();
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

    let detailsId = '';

    await test.step('Branch Manager — verify submitted row is visible and capture details id', async () => {
      await branchVendorHistoryPage.openBranchVendorPaymentsHistoryPage();
      await branchVendorHistoryPage.waitForSubmittedVendorRowVisible(vendorName, amountCell);
      await branchVendorHistoryPage.searchHistory(vendorName);
      const beforeRow = branchVendorHistoryPage.historyMainRow(vendorName, amountCell);
      await expect(beforeRow).toBeVisible({ timeout: 20_000 });
      await expect(beforeRow).toContainText('Submitted');
      detailsId = await branchVendorHistoryPage.getDetailsIdFromRow(beforeRow);
      expect(detailsId.length).toBeGreaterThan(0);
    });

    await test.step(`Super Admin — set status to ${TARGET_STATUS}`, async () => {
      await roleBasedPage.ensureActiveRole('Super Admin');
      await branchVendorHistoryPage.waitForHistoryRowByDetailsIdVisible(detailsId, vendorName);
      const adminRow = branchVendorHistoryPage.historyRowByDetailsId(detailsId);
      await expect(adminRow).toBeVisible({ timeout: 20_000 });
      await expect(adminRow).toContainText('Submitted');
      await branchVendorHistoryPage.openHistoryDetailsForRow(adminRow);
      await branchVendorHistoryPage.selectDetailsStatus(TARGET_STATUS);
      await branchVendorHistoryPage.uploadDetailsSupportingDocument('testdata/Receipt.png');
      await branchVendorHistoryPage.fillRemarksToSubmitter(
        `${TARGET_STATUS} by automation for Details ID ${detailsId}`
      );
      await branchVendorHistoryPage.fillComment(
        `Updating details ID ${detailsId} to ${TARGET_STATUS} from Internal Finance Team`
      );
      await branchVendorHistoryPage.clickUpdate();
     
    });

    await test.step(`Branch Manager — verify ${TARGET_STATUS} in History`, async () => {
      await roleBasedPage.ensureActiveRole('Branch Manager');
      await branchVendorHistoryPage.waitForHistoryStatusByDetailsId(detailsId, TARGET_STATUS, vendorName);
      const afterRow = branchVendorHistoryPage.historyRowByDetailsId(detailsId);
      await expect(afterRow).toBeVisible({ timeout: 20_000 });
      await expect(afterRow).toContainText(TARGET_STATUS);
    });
  });
});
