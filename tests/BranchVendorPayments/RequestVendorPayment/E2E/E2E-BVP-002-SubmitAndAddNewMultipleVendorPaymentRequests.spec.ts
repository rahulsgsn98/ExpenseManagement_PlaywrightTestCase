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

test.describe('E2E-BVP-002 Submit and Add New - multiple vendor payment requests', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Submit three vendor payment requests in one session and verify in History', async ({ page }) => {
    const requestVendorPaymentPage = new RequestVendorPaymentPage(page);
    const historyPage = new BranchVendorPaymentsHistoryPage(page);

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const incurredDate = `${yyyy}-${mm}-${dd}`;

    const first = {
      amount: RandomDataFaker.amount(500, 800),
      amountCell: '',
      expenseCategoryValue: '63020 Travel',
      costCenterId: branchNewSubmissionCostCenterAt(0),
      vendorName: branchVendorPaymentVendorNameAt(0),
      supportingDocumentPath: 'testdata/Receipt.pdf',
      fileName: 'Receipt.pdf',
      description: RandomDataFaker.expenseDescription()
    };
    first.amountCell = `$${Number(first.amount).toFixed(2)}`;

    const second = {
      amount: RandomDataFaker.amount(900, 1400),
      amountCell: '',
      expenseCategoryValue: '63130 Office Supplies',
      costCenterId: branchNewSubmissionCostCenterAt(1),
      vendorName: branchVendorPaymentVendorNameAt(1),
      supportingDocumentPath: 'testdata/Receipt.jpg',
      fileName: 'Receipt.jpg',
      description: RandomDataFaker.expenseDescription()
    };
    second.amountCell = `$${Number(second.amount).toFixed(2)}`;

    const third = {
      amount: RandomDataFaker.amount(250, 600),
      amountCell: '',
      expenseCategoryValue: '63010 Meals & Entertainment',
      costCenterId: branchNewSubmissionCostCenterAt(2),
      vendorName: branchVendorPaymentVendorNameAt(2),
      supportingDocumentPath: 'testdata/Receipt.png',
      fileName: 'Receipt.png',
      description: RandomDataFaker.expenseDescription()
    };
    third.amountCell = `$${Number(third.amount).toFixed(2)}`;

    await test.step('Request Vendor Payment - first request (Submit and Add New)', async () => {
      await requestVendorPaymentPage.openRequestVendorPaymentPage();
      await requestVendorPaymentPage.enterAmount(first.amount);
      await requestVendorPaymentPage.selectExpenseCategory(first.expenseCategoryValue);
      await requestVendorPaymentPage.enterIncurredDate(incurredDate);
      await requestVendorPaymentPage.selectBranchCostCenter(first.costCenterId);
      await requestVendorPaymentPage.selectBranchVendorName(first.vendorName);
      await requestVendorPaymentPage.uploadSupportingDocument(first.supportingDocumentPath);
      await requestVendorPaymentPage.expectUploadedFilePill(first.fileName);
      await requestVendorPaymentPage.enterDescription(first.description);
      await requestVendorPaymentPage.clickSubmitAndAddNew();
      await requestVendorPaymentPage.expectReadyForNewRequestVendorPaymentEntry();
    });

    await test.step('Request Vendor Payment - second request (Submit and Add New)', async () => {
      await requestVendorPaymentPage.enterAmount(second.amount);
      await requestVendorPaymentPage.selectExpenseCategory(second.expenseCategoryValue);
      await requestVendorPaymentPage.enterIncurredDate(incurredDate);
      await requestVendorPaymentPage.selectBranchCostCenter(second.costCenterId);
      await requestVendorPaymentPage.selectBranchVendorName(second.vendorName);
      await requestVendorPaymentPage.uploadSupportingDocument(second.supportingDocumentPath);
      await requestVendorPaymentPage.expectUploadedFilePill(second.fileName);
      await requestVendorPaymentPage.enterDescription(second.description);
      await requestVendorPaymentPage.clickSubmitAndAddNew();
      await requestVendorPaymentPage.expectReadyForNewRequestVendorPaymentEntry();
    });

    await test.step('Request Vendor Payment - third request (Submit)', async () => {
      await requestVendorPaymentPage.enterAmount(third.amount);
      await requestVendorPaymentPage.selectExpenseCategory(third.expenseCategoryValue);
      await requestVendorPaymentPage.enterIncurredDate(incurredDate);
      await requestVendorPaymentPage.selectBranchCostCenter(third.costCenterId);
      await requestVendorPaymentPage.selectBranchVendorName(third.vendorName);
      await requestVendorPaymentPage.uploadSupportingDocument(third.supportingDocumentPath);
      await requestVendorPaymentPage.expectUploadedFilePill(third.fileName);
      await requestVendorPaymentPage.enterDescription(third.description);
      await requestVendorPaymentPage.clickSubmit();
      await requestVendorPaymentPage.expectSubmissionSuccessful();
    });

    await test.step('Branch Vendor Payments History - verify all three requests', async () => {
      await historyPage.openBranchVendorPaymentsHistoryPage();
      await expect(historyPage.vendorNameHeader).toBeVisible();
      await expect(historyPage.amountHeader).toBeVisible();
      await expect(historyPage.statusHeader).toBeVisible();
      await expect(historyPage.lastUpdatedDateHeader).toBeVisible();
      await expect(historyPage.actionHeader).toBeVisible();

      for (const record of [first, second, third]) {
        await historyPage.waitForSubmittedVendorRowVisible(record.vendorName, record.amountCell);
      }
    });
  });
});
