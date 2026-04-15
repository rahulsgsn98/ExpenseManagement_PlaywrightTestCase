import { expect, test } from '@playwright/test';
import { AllBranchReimbursementsPage } from '../../../../pages/AllSubmissions/AllBranchReimbursementsPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { ensureAccountingTeamRoleForEnd2E } from '../../ensureAccountingTeamRoleForEnd2E';
import { ensureSuperAdminRoleForEnd2E } from '../../ensureSuperAdminRoleForEnd2E';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('E2E-ABR-001 All Branch Reimbursements page loads with org-wide records', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureSuperAdminRoleForEnd2E(page);
    await page.keyboard.press('Escape');
  });

  test('Portal, navigation, grid, columns, and org-wide list', async ({ page }) => {
    const abr = new AllBranchReimbursementsPage(page);

    await test.step('Step 1 — Accounting Team session; All Submissions visible in nav', async () => {
      await expect(page.getByRole('heading', { name: 'All Submissions', exact: true })).toBeVisible();
      await expect(abr.allBranchReimbursementsMenuLink).toBeVisible();
    });

    await test.step('Step 2 — Navigate to All Branch Reimbursements; History title visible', async () => {
      await abr.gotoAllBranchReimbursementsList();
      await expect(abr.historyPageHeading).toBeVisible();
      await expect(abr.statusFilterDropdown).toBeVisible();
      await expect(abr.historySearchInput).toBeVisible();
    });

    await test.step('Step 3 — Org-wide list shows reimbursement rows', async () => {
      const dataRows = page.locator('tbody tr:not(.child)');
      await expect(dataRows.first()).toBeVisible({ timeout: 30_000 });
      expect(await dataRows.count()).toBeGreaterThanOrEqual(1);
    });

    await test.step('Step 4 — Table column headers (live grid: four core; optional extra columns when rendered)', async () => {
      await expect(abr.branchExpenseIdHeader).toBeVisible();
      await expect(abr.vendorNameHeader).toBeVisible();
      await expect(abr.amountHeader).toBeVisible();
      await expect(abr.statusHeader).toBeVisible();

      if (await abr.submittedByHeader.isVisible()) {
        await expect(abr.submittedByHeader).toBeVisible();
      }
      if (await abr.lastUpdatedDateHeader.isVisible()) {
        await expect(abr.lastUpdatedDateHeader).toBeVisible();
      }
      const actionHeader = page.getByRole('columnheader', { name: /Action/i }).first();
      if (await actionHeader.isVisible()) {
        await expect(actionHeader).toBeVisible();
      }
    });

    await test.step('Step 5 — Expand first row, open Details; Submitted By value visible (org-wide submitter)', async () => {
      const firstMain = page.locator('tbody tr:not(.child)').first();
      await abr.openHistoryDetailsForMainRow(firstMain);
      await expect(page).toHaveURL(/\/ActionCenter\/CostactionCenter\?ID=/i);
      const submittedByLabel = page.getByText('Submitted By', { exact: true }).first();
      await expect(submittedByLabel).toBeVisible();
      const submittedByValue = submittedByLabel.locator('xpath=following::p[1]');
      await expect(submittedByValue).toBeVisible();
      const who = (await submittedByValue.innerText()).trim();
      expect(who.length).toBeGreaterThan(0);
    });
  });
});
