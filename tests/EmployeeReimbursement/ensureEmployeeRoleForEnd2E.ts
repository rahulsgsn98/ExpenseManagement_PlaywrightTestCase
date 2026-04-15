import { Page, test } from '@playwright/test';
import { RoleBasedPage } from '../../pages/RoleBasedPage';

const EMPLOYEE_ROLE = 'Employees' as const;

/**
 * Employee Reimbursement E2E must run under the Employees role.
 * Skips the test when that role is not available for the signed-in user.
 */
export async function ensureEmployeeRoleForEnd2E(page: Page): Promise<void> {
  const rolePage = new RoleBasedPage(page);
  await rolePage.openDashboard();
  await rolePage.openProfileMenu();
  const labels = (await rolePage.rolesDropdown.locator('option').allTextContents()).map((t) => t.trim());
  if (!labels.includes(EMPLOYEE_ROLE)) {
    test.skip(
      true,
      `Employee Reimbursement E2E skipped: "${EMPLOYEE_ROLE}" role not available for this user (options: ${labels.join(', ')}).`
    );
    return;
  }
  await rolePage.ensureActiveRole(EMPLOYEE_ROLE, { profileMenuAlreadyOpen: true });
}
