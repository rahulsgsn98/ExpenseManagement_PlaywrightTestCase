import { test } from '@playwright/test';
import { NewSubmissionPage } from '../../../../pages/BranchReimbursement/NewSubmissionPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { branchNewSubmissionCostCenterAt } from '../../../../utils/branchCostCenters';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BR-003 New Submission - Supporting Documents accepts PDF, JPG, PNG', () => {
  const category = '63020 Travel';

  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
    const newSubmissionPage = new NewSubmissionPage(page);
    await newSubmissionPage.openNewSubmissionPage();
  });

  test('With other fields filled, PDF then JPG then PNG each show the file pill', async ({ page }) => {
    const newSubmissionPage = new NewSubmissionPage(page);
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const incurredDate = `${yyyy}-${mm}-${dd}`;

    await newSubmissionPage.enterAmount(RandomDataFaker.amount(50, 250));
    await newSubmissionPage.selectExpenseCategory(category);
    await newSubmissionPage.enterIncurredDate(incurredDate);
    await newSubmissionPage.selectBranchCostCenter(branchNewSubmissionCostCenterAt(0));
    await newSubmissionPage.enterVendorName(RandomDataFaker.vendorName());
    await newSubmissionPage.enterDescription(RandomDataFaker.expenseDescription());

    await newSubmissionPage.uploadSupportingDocument('testdata/Receipt.pdf');
    await newSubmissionPage.expectUploadedFilePill('Receipt.pdf');

    await newSubmissionPage.removeUploadedSupportingDocument();
    await newSubmissionPage.uploadSupportingDocument('testdata/Receipt.jpg');
    await newSubmissionPage.expectUploadedFilePill('Receipt.jpg');

    await newSubmissionPage.removeUploadedSupportingDocument();
    await newSubmissionPage.uploadSupportingDocument('testdata/Receipt.png');
    await newSubmissionPage.expectUploadedFilePill('Receipt.png');
  });

  test('Multiple files selected together upload, all pills visible, Submit succeeds', async ({ page }) => {
    const newSubmissionPage = new NewSubmissionPage(page);
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const incurredDate = `${yyyy}-${mm}-${dd}`;

    await newSubmissionPage.enterAmount(RandomDataFaker.amount(50, 250));
    await newSubmissionPage.selectExpenseCategory(category);
    await newSubmissionPage.enterIncurredDate(incurredDate);
    await newSubmissionPage.selectBranchCostCenter(branchNewSubmissionCostCenterAt(0));
    await newSubmissionPage.enterVendorName(RandomDataFaker.vendorName());
    await newSubmissionPage.uploadSupportingDocuments([
      'testdata/Receipt.pdf',
      'testdata/Receipt.jpg',
      'testdata/Receipt.png'
    ]);
    await newSubmissionPage.expectUploadedFilePills(['Receipt.pdf', 'Receipt.jpg', 'Receipt.png']);
    await newSubmissionPage.enterDescription(RandomDataFaker.expenseDescription());
    await newSubmissionPage.clickSubmit();
    await newSubmissionPage.expectSubmissionSuccessful();
  });
});
