import { test } from '@playwright/test';
import { ExpenseFormPage } from '../../../../pages/EmployeeReimbursement/ExpenseFormPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureEmployeeRoleForEnd2E } from '../../ensureEmployeeRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-EMP-009 Expense Form – invalid Amount (alphabets, negative, special characters)', () => {
  const category = '63010 Meals & Entertainment';
  const supportingDocumentPath = 'testdata/Receipt.jpg';
  const uploadedFileDisplayName = 'Receipt.jpg';

  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
    const expenseFormPage = new ExpenseFormPage(page);
    await expenseFormPage.openExpenseForm();
  });

  test('Alphabetic amount: full form + Submit → file-upload technical error page', async ({ page }) => {
    const expenseFormPage = new ExpenseFormPage(page);
    await expenseFormPage.fillFormWithInvalidAmountSubmitAndExpectFileUploadTechnicalError({
      invalidAmount: 'abc',
      expenseCategoryValue: category,
      vendorName: RandomDataFaker.vendorName(),
      supportingDocumentPath,
      uploadedFileDisplayName,
      description: RandomDataFaker.expenseDescription(),
      submitAction: 'submit'
    });
  });

  test('Negative amount: full form + Submit → file-upload technical error page', async ({ page }) => {
    const expenseFormPage = new ExpenseFormPage(page);
    await expenseFormPage.fillFormWithInvalidAmountSubmitAndExpectFileUploadTechnicalError({
      invalidAmount: '-100',
      expenseCategoryValue: category,
      vendorName: RandomDataFaker.vendorName(),
      supportingDocumentPath,
      uploadedFileDisplayName,
      description: RandomDataFaker.expenseDescription(),
      submitAction: 'submit'
    });
  });

  test('Special-character amount: full form + Submit → file-upload technical error page', async ({
    page
  }) => {
    const expenseFormPage = new ExpenseFormPage(page);
    await expenseFormPage.fillFormWithInvalidAmountSubmitAndExpectFileUploadTechnicalError({
      invalidAmount: '@#$50%',
      expenseCategoryValue: category,
      vendorName: RandomDataFaker.vendorName(),
      supportingDocumentPath,
      uploadedFileDisplayName,
      description: RandomDataFaker.expenseDescription(),
      submitAction: 'submit'
    });
  });
});
