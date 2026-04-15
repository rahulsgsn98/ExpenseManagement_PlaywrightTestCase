import { expect, test } from '@playwright/test';
import { BranchReimbursementHistoryPage } from '../../../../pages/BranchReimbursement/BranchReimbursementHistoryPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BR-016 Branch History Show entries and pagination', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Show control changes page size; pagination when multiple pages exist', async ({ page }) => {
    const historyPage = new BranchReimbursementHistoryPage(page);

    await historyPage.openBranchHistoryPage();

    const table = historyPage.branchHistoryTableWrapper;
    const dataRows = table.locator('tbody tr:not(.child)');
    if ((await dataRows.count()) === 0) {
      test.skip(true, 'E2E-BR-016 skipped: no branch reimbursement records in History.');
    }

    await expect(historyPage.historyShowEntriesDropdown).toBeVisible();
    await expect(historyPage.historyShowEntriesDropdown).toHaveValue('10');

    await historyPage.selectHistoryShowEntries('25');
    await expect(historyPage.historyShowEntriesDropdown).toHaveValue('25');

    const visibleAfter25 = await dataRows.count();
    expect(visibleAfter25).toBeGreaterThan(0);
    expect(visibleAfter25).toBeLessThanOrEqual(25);

    const nextPageLink = table.getByRole('link', { name: 'Next' }).first();
    const previousPageLink = table.getByRole('link', { name: 'Prev' }).first();
    const pagingStatus = table.getByRole('status').first();
    const clickPageLink = async (link: ReturnType<typeof table.getByRole>) => {
      await link.evaluate((el) => (el as HTMLAnchorElement).click());
    };
    const nextIsDisabled = async () => {
      const cls = (await nextPageLink.locator('..').getAttribute('class')) ?? '';
      return cls.includes('disabled');
    };

    if (!(await nextIsDisabled())) {
      const statusBeforeNext = await pagingStatus.innerText();
      await clickPageLink(nextPageLink);
      await expect(pagingStatus).not.toHaveText(statusBeforeNext);

      await clickPageLink(previousPageLink);
      await expect(pagingStatus).toHaveText(statusBeforeNext);

      let safety = 0;
      while (!(await nextIsDisabled()) && safety < 100) {
        await clickPageLink(nextPageLink);
        safety++;
      }
      expect(await nextIsDisabled()).toBe(true);
    }
  });
});
