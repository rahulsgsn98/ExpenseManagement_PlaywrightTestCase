import { test } from '@playwright/test';
import { ExpenseFormPage } from '../../../../pages/EmployeeReimbursement/ExpenseFormPage';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { ensureEmployeeRoleForEnd2E } from '../../ensureEmployeeRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('Employee Reimbursement - Expense Form', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
  });

  test('Create expense form and submit successfully with Submit Button', async ({ page }) => {
    const expenseFormPage = new ExpenseFormPage(page);

  
    await expenseFormPage.openExpenseForm();

    await expenseFormPage.submitExpenseForm({
      amount: RandomDataFaker.amount(),
      expenseCategoryValue: '63010 Meals & Entertainment',
      vendorName: RandomDataFaker.vendorName(),
      supportingDocumentPath: 'testdata/Expense Management- User and Admin guide.pdf',
      description: RandomDataFaker.expenseDescription()
    });

    await expenseFormPage.expectExpenseAddedSuccessfully();
  });

  test('Create expense form and submit with Submit and Add New Button successfully', async ({ page }) => {
    const expenseFormPage = new ExpenseFormPage(page);

    await expenseFormPage.openExpenseForm();

    await expenseFormPage.submitExpenseFormAndAddNew({
      amount: RandomDataFaker.amount(),
      expenseCategoryValue: '63010 Meals & Entertainment',
      vendorName: RandomDataFaker.vendorName(),
      supportingDocumentPath: 'testdata/Expense Management- User and Admin guide.pdf',
      description: RandomDataFaker.expenseDescription()
    });

    await expenseFormPage.expectReadyForNewExpenseEntry();
  });
});
