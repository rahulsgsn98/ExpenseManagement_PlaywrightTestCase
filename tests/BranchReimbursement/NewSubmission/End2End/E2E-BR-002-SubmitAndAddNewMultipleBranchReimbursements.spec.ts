import { expect, test } from '@playwright/test';
import { BranchReimbursementHistoryPage } from '../../../../pages/BranchReimbursement/BranchReimbursementHistoryPage';
import { NewSubmissionPage } from '../../../../pages/BranchReimbursement/NewSubmissionPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { BRANCH_NEW_SUBMISSION_COST_CENTER_IDS } from '../../../../utils/branchCostCenters';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BR-002 Submit and Add New — multiple branch reimbursements', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Submit three branch reimbursements in one session and verify in History', async ({ page }) => {
    const newSubmissionPage = new NewSubmissionPage(page);
    const branchHistoryPage = new BranchReimbursementHistoryPage(page);

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const incurredDate = `${yyyy}-${mm}-${dd}`;

    const first = {
      amount: RandomDataFaker.amount(180, 280),
      expenseCategoryValue: '63020 Travel',
      costCenterId: BRANCH_NEW_SUBMISSION_COST_CENTER_IDS[0],
      vendorName: RandomDataFaker.vendorName(),
      supportingDocumentPath: 'testdata/Receipt.pdf',
      fileName: 'Receipt.pdf',
      description: RandomDataFaker.expenseDescription()
    };

    const second = {
      amount: RandomDataFaker.amount(280, 450),
      expenseCategoryValue: '63010 Meals & Entertainment',
      costCenterId: BRANCH_NEW_SUBMISSION_COST_CENTER_IDS[1],
      vendorName: RandomDataFaker.vendorName(),
      supportingDocumentPath: 'testdata/Receipt.jpg',
      fileName: 'Receipt.jpg',
      description: RandomDataFaker.expenseDescription()
    };

    const third = {
      amount: RandomDataFaker.amount(80, 200),
      expenseCategoryValue: '63130 Office Supplies',
      costCenterId: BRANCH_NEW_SUBMISSION_COST_CENTER_IDS[2],
      vendorName: RandomDataFaker.vendorName(),
      supportingDocumentPath: 'testdata/Receipt.png',
      fileName: 'Receipt.png',
      description: RandomDataFaker.expenseDescription()
    };

    await test.step('New Submission — open form and enter first reimbursement (Submit and Add New)', async () => {
      await newSubmissionPage.openNewSubmissionPage();
      await newSubmissionPage.enterAmount(first.amount);
      await newSubmissionPage.selectExpenseCategory(first.expenseCategoryValue);
      await newSubmissionPage.enterIncurredDate(incurredDate);
      await newSubmissionPage.selectBranchCostCenter(first.costCenterId);
      await newSubmissionPage.enterVendorName(first.vendorName);
      await newSubmissionPage.uploadSupportingDocument(first.supportingDocumentPath);
      await newSubmissionPage.expectUploadedFilePill(first.fileName);
      await newSubmissionPage.enterDescription(first.description);
      await newSubmissionPage.clickSubmitAndAddNew();
      await newSubmissionPage.expectReadyForNewSubmissionEntry();
    });

    await test.step('New Submission — second reimbursement (Submit and Add New)', async () => {
      await newSubmissionPage.enterAmount(second.amount);
      await newSubmissionPage.selectExpenseCategory(second.expenseCategoryValue);
      await newSubmissionPage.enterIncurredDate(incurredDate);
      await newSubmissionPage.selectBranchCostCenter(second.costCenterId);
      await newSubmissionPage.enterVendorName(second.vendorName);
      await newSubmissionPage.uploadSupportingDocument(second.supportingDocumentPath);
      await newSubmissionPage.expectUploadedFilePill(second.fileName);
      await newSubmissionPage.enterDescription(second.description);
      await newSubmissionPage.clickSubmitAndAddNew();
      await newSubmissionPage.expectReadyForNewSubmissionEntry();
    });

    await test.step('New Submission — third reimbursement (Submit)', async () => {
      await newSubmissionPage.enterAmount(third.amount);
      await newSubmissionPage.selectExpenseCategory(third.expenseCategoryValue);
      await newSubmissionPage.enterIncurredDate(incurredDate);
      await newSubmissionPage.selectBranchCostCenter(third.costCenterId);
      await newSubmissionPage.enterVendorName(third.vendorName);
      await newSubmissionPage.uploadSupportingDocument(third.supportingDocumentPath);
      await newSubmissionPage.expectUploadedFilePill(third.fileName);
      await newSubmissionPage.enterDescription(third.description);
      await newSubmissionPage.clickSubmit();
      await newSubmissionPage.expectSubmissionSuccessful();
    });

    await test.step('Branch Reimbursement History — verify all three records', async () => {
      await branchHistoryPage.openBranchHistoryPage();
      await expect(branchHistoryPage.branchExpenseIdHeader).toBeVisible();
      await expect(branchHistoryPage.vendorNameHeader).toBeVisible();
      await expect(branchHistoryPage.amountHeader).toBeVisible();
      await expect(branchHistoryPage.statusHeader).toBeVisible();

      for (const record of [first, second, third]) {
        const amountCell = `$${Number(record.amount).toFixed(2)}`;
        await branchHistoryPage.searchBranchHistory(record.vendorName);
        const row = branchHistoryPage.branchHistoryMainDataRow(record.vendorName, amountCell);
        await expect(row).toBeVisible({ timeout: 20_000 });
        await expect(row).toContainText(amountCell);
        await expect(row).toContainText('Submitted');
        await branchHistoryPage.historySearchInput.clear();
      }
    });
  });
});
