import { test } from '@playwright/test';
import { ExpenseFormPage } from '../../../../pages/EmployeeReimbursement/ExpenseFormPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureEmployeeRoleForEnd2E } from '../../ensureEmployeeRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-EMP-010 Expense Form – Supporting Documents accepts PDF, JPG, PNG', () => {
  const category = '63010 Meals & Entertainment';

  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
    const expenseFormPage = new ExpenseFormPage(page);
    await expenseFormPage.openExpenseForm();
  });

  test('With other fields filled, PDF then JPG then PNG each show the file pill', async ({ page }) => {
    const expenseFormPage = new ExpenseFormPage(page);

    await expenseFormPage.enterAmount(RandomDataFaker.amount(50, 250));
    await expenseFormPage.selectExpenseCategory(category);
    await expenseFormPage.enterVendorName(RandomDataFaker.vendorName());
    await expenseFormPage.enterExpenseDescription(RandomDataFaker.expenseDescription());

    await expenseFormPage.uploadSupportingDocument('testdata/Receipt.pdf');
    await expenseFormPage.expectUploadedFilePill('Receipt.pdf');

    await expenseFormPage.removeUploadedSupportingDocument();
    await expenseFormPage.uploadSupportingDocument('testdata/Receipt.jpg');
    await expenseFormPage.expectUploadedFilePill('Receipt.jpg');

    await expenseFormPage.removeUploadedSupportingDocument();
    await expenseFormPage.uploadSupportingDocument('testdata/Receipt.png');
    await expenseFormPage.expectUploadedFilePill('Receipt.png');
  });

  test('Multiple files selected together upload, all pills visible, Submit succeeds', async ({ page }) => {
    const expenseFormPage = new ExpenseFormPage(page);

    await expenseFormPage.enterAmount(RandomDataFaker.amount(50, 250));
    await expenseFormPage.selectExpenseCategory(category);
    await expenseFormPage.enterVendorName(RandomDataFaker.vendorName());
    await expenseFormPage.uploadSupportingDocuments([
      'testdata/Receipt.pdf',
      'testdata/Receipt.jpg',
      'testdata/Receipt.png'
    ]);
    await expenseFormPage.expectUploadedFilePills(['Receipt.pdf', 'Receipt.jpg', 'Receipt.png']);
    await expenseFormPage.enterExpenseDescription(RandomDataFaker.expenseDescription());
    await expenseFormPage.submitExpense();
    await expenseFormPage.expectExpenseAddedSuccessfully();
  });
});
