import { expect, test } from '@playwright/test';
import { BranchVendorPaymentsHistoryPage } from '../../../../pages/BranchVendorPayments/BranchVendorPaymentsHistoryPage';
import { RequestVendorPaymentPage } from '../../../../pages/BranchVendorPayments/RequestVendorPaymentPage';
import { branchNewSubmissionCostCenterAt } from '../../../../utils/branchCostCenters';
import { branchVendorPaymentVendorNameAt } from '../../../../utils/branchVendorNames';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BVP-016 History page – search filters vendor payment records', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Search filters, clears, and empty-state behavior', async ({ page }) => {
  

    const requestVendorPaymentPage = new RequestVendorPaymentPage(page);
    const historyPage = new BranchVendorPaymentsHistoryPage(page);

    const expenseCategoryValue = '63020 Travel';
    const searchVendorKeyword = 'DH Elite';
    const noMatchKeyword = 'XYZABC999';

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const incurredDate = `${yyyy}-${mm}-${dd}`;

    const vendorNames = [
      branchVendorPaymentVendorNameAt(0),
      branchVendorPaymentVendorNameAt(1),
      branchVendorPaymentVendorNameAt(2)
    ] as const;

    const amounts = vendorNames.map((_, i) => RandomDataFaker.amount(4100 + i * 100, 4199 + i * 100));
    const amountCells = amounts.map((a) => `$${Number(a).toFixed(2)}`);
    const targetVendor = vendorNames[2]!;
    const targetAmountCell = amountCells[2]!;

    await test.step('Submit three vendor payments with distinct configured vendor names', async () => {
      for (let i = 0; i < vendorNames.length; i++) {
        const vendorName = vendorNames[i]!;
        const amount = amounts[i]!;
        const description = RandomDataFaker.expenseDescription();

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
      }
    });

    await test.step('Wait for newest rows to appear in History (unique amounts per vendor)', async () => {
      for (let i = 0; i < vendorNames.length; i++) {
        await historyPage.waitForHistoryMainRowVisible(vendorNames[i]!, amountCells[i]!);
      }
    });

    await test.step('Open History — all submitted records visible', async () => {
      await historyPage.openBranchVendorPaymentsHistoryPage();
      await historyPage.expectHistoryRowsVisible();
    });

    await test.step('Search by known vendor keyword — table filters to matching vendor only', async () => {
      await historyPage.searchHistory(searchVendorKeyword);
      await historyPage.waitForHistoryMainRowVisible(targetVendor, targetAmountCell, searchVendorKeyword);
      const filteredRow = historyPage.historyMainRow(targetVendor, targetAmountCell);
      await expect(filteredRow).toBeVisible();
      await expect(page.getByRole('gridcell', { name: vendorNames[0]!, exact: true })).toHaveCount(0);
      await expect(page.getByRole('gridcell', { name: vendorNames[1]!, exact: true })).toHaveCount(0);
    });

    await test.step('Clear search — all records restored', async () => {
      await historyPage.searchHistory('');
      await historyPage.expectHistoryRowsVisible();
    });

    await test.step('Search non-existent vendor — empty table message', async () => {
      await historyPage.searchHistory(noMatchKeyword);
      await historyPage.expectHistorySearchEmptyStateVisible();
    });

    await test.step('Clear search again — rows return', async () => {
      await historyPage.searchHistory('');
      await historyPage.expectHistoryRowsVisible();
    });
  });
});
