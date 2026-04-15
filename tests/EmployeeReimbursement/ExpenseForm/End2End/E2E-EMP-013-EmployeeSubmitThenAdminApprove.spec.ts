import { expect, test } from '@playwright/test';
import { ExpenseFormPage } from '../../../../pages/EmployeeReimbursement/ExpenseFormPage';
import { ExpenseHistoryPage } from '../../../../pages/EmployeeReimbursement/ExpenseHistoryPage';
import { RoleBasedPage } from '../../../../pages/RoleBasedPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { RandomDataFaker } from '../../../../utils/radomdatafaker';
import { ensureEmployeeRoleForEnd2E } from '../../ensureEmployeeRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-EMP-013 Full flow: Employee submits then Super Admin approves', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
  });

  test('Submit expense as Employee, approve as Super Admin, verify Approved in Employee History', async ({ page }) => {
    const expenseFormPage = new ExpenseFormPage(page);
    const expenseHistoryPage = new ExpenseHistoryPage(page);
    const roleBasedPage = new RoleBasedPage(page);

    const amount = RandomDataFaker.amount(180, 260);
    const vendorName = RandomDataFaker.vendorName();
    const description = RandomDataFaker.expenseDescription();

    // Step 1-3: Employee submits expense and confirms Submitted status in own History.
    await expenseFormPage.openExpenseForm();
    await expenseFormPage.enterAmount(amount);
    await expenseFormPage.selectExpenseCategory('63020 Travel');
    await expenseFormPage.enterVendorName(vendorName);
    await expenseFormPage.uploadSupportingDocument('testdata/Receipt.jpg');
    await expenseFormPage.expectUploadedFilePill('Receipt.jpg');
    await expenseFormPage.enterExpenseDescription(description);
    await expenseFormPage.submitExpense();
    await expenseFormPage.expectExpenseAddedSuccessfully();

    await expenseHistoryPage.openHistoryPage();
    await expenseHistoryPage.search(vendorName);
    const employeeRowBeforeApproval = page.locator('tbody tr', { hasText: vendorName }).first();
    await expect(employeeRowBeforeApproval).toBeVisible();
    await expect(employeeRowBeforeApproval).toContainText('Submitted');
    const expenseId = (await employeeRowBeforeApproval.locator('td').first().innerText()).trim();
    expect(expenseId.length).toBeGreaterThan(0);

    // Step 4-5: Switch to Super Admin, go Employee Reimbursement -> History, open the record and approve.
    await roleBasedPage.ensureActiveRole('Super Admin');
    await expenseHistoryPage.openHistoryPage();
    await expenseHistoryPage.search(vendorName);
    const adminRow = page.locator('tbody tr', { hasText: vendorName }).first();
    await expect(adminRow).toBeVisible();
    await expenseHistoryPage.openFirstExpenseDetails();
    await expenseHistoryPage.selectStatus('Approved');
    await expenseHistoryPage.uploadDetailsSupportingDocument('testdata/Receipt.png');
    await expenseHistoryPage.fillRemarksToSubmitter(`Approved by automation for ${vendorName}`);
    await expenseHistoryPage.fillComment(`Approving ${expenseId} from Internal Finance Team`);
  //  await expenseHistoryPage.clickAddComments();
    await expenseHistoryPage.clickUpdate();

    // Step 6: Switch back to Employee and verify status becomes Approved in History.
    await roleBasedPage.ensureActiveRole('Employees');
    await expect
      .poll(
        async () => {
          await expenseHistoryPage.openHistoryPage();
          await expenseHistoryPage.search(expenseId);
          const employeeRowAfterApproval = page.locator('tbody tr', { hasText: expenseId }).first();
          await expect(employeeRowAfterApproval).toBeVisible();
          return (await employeeRowAfterApproval.innerText()).replace(/\s+/g, ' ');
        },
        { timeout: 30000, intervals: [1000, 2000, 3000, 5000] }
      )
      .toContain('Approved');
  });
});
