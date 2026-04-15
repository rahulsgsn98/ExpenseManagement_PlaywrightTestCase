import { Page, test } from '@playwright/test';
import { RoleBasedPage } from '../../pages/RoleBasedPage';

const BRANCH_MANAGER_ROLE = 'Branch Manager' as const;

/**
 * Branch Vendor Payments E2E must run under the Branch Manager role.
 * Skips the test when that role is not available for the signed-in user.
 */
export async function ensureBranchManagerRoleForEnd2E(page: Page): Promise<void> {
  const rolePage = new RoleBasedPage(page);
  await rolePage.openDashboard();
  await rolePage.openProfileMenu();
  const labels = (await rolePage.rolesDropdown.locator('option').allTextContents()).map((t) => t.trim());
  if (!labels.includes(BRANCH_MANAGER_ROLE)) {
    test.skip(
      true,
      `Branch Vendor Payments E2E skipped: "${BRANCH_MANAGER_ROLE}" role not available for this user (options: ${labels.join(', ')}).`
    );
    return;
  }
  await rolePage.ensureActiveRole(BRANCH_MANAGER_ROLE, { profileMenuAlreadyOpen: true });
}
