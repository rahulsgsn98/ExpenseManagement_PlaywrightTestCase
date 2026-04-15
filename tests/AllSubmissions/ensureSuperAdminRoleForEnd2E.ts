import { Page, test } from '@playwright/test';
import { RoleBasedPage } from '../../pages/RoleBasedPage';

const ROLE = 'Super Admin' as const;

export async function ensureSuperAdminRoleForEnd2E(page: Page): Promise<void> {
  const rolePage = new RoleBasedPage(page);
  await rolePage.openDashboard();
  await rolePage.openProfileMenu();
  const labels = (await rolePage.rolesDropdown.locator('option').allTextContents()).map((t) => t.trim());
  if (!labels.includes(ROLE)) {
    test.skip(true, `All Submissions E2E skipped: "${ROLE}" not available (options: ${labels.join(', ')}).`);
    return;
  }
  await rolePage.ensureActiveRole(ROLE, { profileMenuAlreadyOpen: true });
}
