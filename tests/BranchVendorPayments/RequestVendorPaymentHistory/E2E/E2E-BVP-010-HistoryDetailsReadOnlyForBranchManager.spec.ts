import { expect, test } from '@playwright/test';
import { TestConfig } from '../../../../test.config';
import { BranchVendorPaymentsHistoryPage } from '../../../../pages/BranchVendorPayments/BranchVendorPaymentsHistoryPage';
import { RequestVendorPaymentPage } from '../../../../pages/BranchVendorPayments/RequestVendorPaymentPage';
import { branchNewSubmissionCostCenterAt } from '../../../../utils/branchCostCenters';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { branchVendorPaymentVendorNameAt } from '../../../../utils/branchVendorNames';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

const testConfig = new TestConfig();

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BVP-010 History Details for Branch Manager', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('History Details opens correct view and remains read-only for Branch Manager', async ({ page }) => {
    const requestVendorPaymentPage = new RequestVendorPaymentPage(page);
    const historyPage = new BranchVendorPaymentsHistoryPage(page);

    const amount = RandomDataFaker.amount(450, 850);
    const amountCell = `$${Number(amount).toFixed(2)}`;
    const expenseCategoryValue = '63020 Travel';
    const vendorName = branchVendorPaymentVendorNameAt(2);
    const description = RandomDataFaker.expenseDescription();
    const supportingDocumentPath = 'testdata/Receipt.pdf';
    const supportingDocumentFileName = 'Receipt.pdf';

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

    await test.step('Submit a vendor payment so the target row exists in History', async () => {
      await requestVendorPaymentPage.openRequestVendorPaymentPage();
      await requestVendorPaymentPage.enterAmount(amount);
      await requestVendorPaymentPage.selectExpenseCategory(expenseCategoryValue);
      await requestVendorPaymentPage.enterIncurredDate(incurredDate);
      await requestVendorPaymentPage.selectBranchCostCenter(branchNewSubmissionCostCenterAt(0));
      await requestVendorPaymentPage.selectBranchVendorName(vendorName);
      await requestVendorPaymentPage.uploadSupportingDocument(supportingDocumentPath);
      await requestVendorPaymentPage.expectUploadedFilePill(supportingDocumentFileName);
      await requestVendorPaymentPage.enterDescription(description);
      await requestVendorPaymentPage.clickSubmit();
      await requestVendorPaymentPage.expectSubmissionSuccessful();
    });

    await test.step('History - open Details from the matching submitted row', async () => {
      await historyPage.openBranchVendorPaymentsHistoryPage();
      await historyPage.waitForSubmittedVendorRowVisible(vendorName, amountCell);

      await historyPage.searchHistory(vendorName);
      const recordRow = historyPage.historyMainRow(vendorName, amountCell);
      await expect(recordRow).toBeVisible({ timeout: 20_000 });
      await historyPage.expectHistoryDetailsLinkVisibleForRow(recordRow);
      await historyPage.openHistoryDetailsForRow(recordRow);
      await expect(page).toHaveURL(/\/AllForms\/VendorExpenseDetails\?ID=/i);
    });

    await test.step('Details - verify key fields and values are visible', async () => {
      await historyPage.expectVendorExpenseDetailsKeyFieldsVisible();
      await historyPage.expectDetailsBodyContains(vendorName);
      await historyPage.expectDetailsBodyContains(expenseCategoryValue);
      await historyPage.expectDetailsBodyContains(amountCell);
      await historyPage.expectDetailsBodyContains(usSlashPattern);
      await historyPage.expectDetailsBodyContains(new RegExp(testConfig.e2eEmployeeDisplayNameRegexSource, 'i'));
    });

    await test.step('Details - Internal Finance controls are not visible for Branch Manager', async () => {
      await historyPage.expectDetailsReadOnlyForBranchManager();
    });

    await test.step.skip('Navigate back to History and verify row is still present', async () => {
      await historyPage.openBranchVendorPaymentsHistoryPage();
      await expect(historyPage.historyPageHeading).toBeVisible();
      await historyPage.waitForSubmittedVendorRowVisible(vendorName, amountCell);
    });
  });
});
