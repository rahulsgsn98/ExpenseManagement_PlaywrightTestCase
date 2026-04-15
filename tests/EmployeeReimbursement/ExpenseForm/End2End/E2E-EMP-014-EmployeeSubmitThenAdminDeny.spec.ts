import { expect, test } from '@playwright/test';
import { ExpenseFormPage } from '../../../../pages/EmployeeReimbursement/ExpenseFormPage';
import { ExpenseHistoryPage } from '../../../../pages/EmployeeReimbursement/ExpenseHistoryPage';
import { RoleBasedPage } from '../../../../pages/RoleBasedPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { ensureEmployeeRoleForEnd2E } from '../../ensureEmployeeRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-EMP-014 Full flow: Employee submits then Super Admin denies', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
  });

  test('Submit as Employee, deny as Super Admin, verify Denied + remarks in Employee details', async ({ page }) => {
    const expenseFormPage = new ExpenseFormPage(page);
    const expenseHistoryPage = new ExpenseHistoryPage(page);
    const roleBasedPage = new RoleBasedPage(page);

    const amount = '500';
    const vendorName = `Staples-${Date.now()}`;
    const description = 'Office chairs';
    const adminRemark = 'Exceeds budget limit for this quarter';

    // Step 1: Employee submit and verify Submitted in History.
    await expenseFormPage.openExpenseForm();
    await expenseFormPage.enterAmount(amount);
    await expenseFormPage.selectExpenseCategory('63130 Office Supplies');
    await expenseFormPage.enterVendorName(vendorName);
    await expenseFormPage.uploadSupportingDocument('testdata/Receipt.png');
    await expenseFormPage.expectUploadedFilePill('Receipt.png');
    await expenseFormPage.enterExpenseDescription(description);
    await expenseFormPage.submitExpense();
    await expenseFormPage.expectExpenseAddedSuccessfully();

    await expenseHistoryPage.openHistoryPage();
    await expenseHistoryPage.search(vendorName);
    const employeeRowBeforeDeny = page.locator('tbody tr', { hasText: vendorName }).first();
    await expect(employeeRowBeforeDeny).toBeVisible();
    await expect(employeeRowBeforeDeny).toContainText('Submitted');
    const expenseId = (await employeeRowBeforeDeny.locator('td').first().innerText()).trim();
    expect(expenseId.length).toBeGreaterThan(0);

    // Step 2-3: Super Admin opens same record details and sets Denied with remarks.
    await roleBasedPage.ensureActiveRole('Super Admin');
    await expenseHistoryPage.openHistoryPage();
    await expenseHistoryPage.search(expenseId);
    const adminRow = page.locator('tbody tr', { hasText: expenseId }).first();
    await expect(adminRow).toBeVisible();
    await adminRow.getByRole('link', { name: 'Details' }).click();
    await expect(page).toHaveURL(/\/ActionCenter\/ExpenseactionCenter\?ID=/i);
    await expenseHistoryPage.selectStatus('Denied');
    await expenseHistoryPage.uploadDetailsSupportingDocument('testdata/Receipt.png');
    await expenseHistoryPage.fillRemarksToSubmitter(adminRemark);
   
    await expenseHistoryPage.clickUpdate();

    // Step 4: Switch back to Employee and verify Denied appears in History.
    await roleBasedPage.ensureActiveRole('Employees');
    await expect
      .poll(
        async () => {
          await expenseHistoryPage.openHistoryPage();
          await expenseHistoryPage.search(expenseId);
          const employeeRowAfterDeny = page.locator('tbody tr', { hasText: expenseId }).first();
          await expect(employeeRowAfterDeny).toBeVisible();
          return (await employeeRowAfterDeny.innerText()).replace(/\s+/g, ' ');
        },
        { timeout: 30000, intervals: [1000, 2000, 3000, 5000] }
      )
      .toContain('Denied');

    // Step 5: Open denied record details and verify admin remark/reason is visible.
    const deniedRow = page.locator('tbody tr', { hasText: expenseId }).first();
    await deniedRow.getByRole('link', { name: 'Details' }).click();
    await expect(page).toHaveURL(/\/ActionCenter\/ExpenseactionCenter\?ID=/i);
    await expect(page.locator('body')).toContainText(adminRemark);
  });
});
