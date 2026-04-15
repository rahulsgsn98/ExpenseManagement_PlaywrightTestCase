import { expect, test } from '@playwright/test';
import { ExpenseHistoryPage } from '../../../../pages/EmployeeReimbursement/ExpenseHistoryPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { ensureEmployeeRoleForEnd2E } from '../../ensureEmployeeRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-EMP-007 History Show entries and pagination', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
  });

  test('Show control changes page size; pagination when multiple pages exist', async ({ page }) => {
    const historyPage = new ExpenseHistoryPage(page);

    await historyPage.openHistoryPage();

    const dataRows = page.locator('tbody tr').filter({ has: page.getByRole('link', { name: 'Details' }) });
    if ((await dataRows.count()) === 0) {
      test.skip(true, 'E2E-EMP-007 skipped: no expense records in History.');
    }

    await expect(historyPage.showEntriesDropdown).toBeVisible();
    await expect(historyPage.showEntriesDropdown).toHaveValue('10');

    await historyPage.selectShowEntries('25');
    await expect(historyPage.showEntriesDropdown).toHaveValue('25');

    const visibleAfter25 = await dataRows.count();
    expect(visibleAfter25).toBeGreaterThan(0);
    expect(visibleAfter25).toBeLessThanOrEqual(25);

    const nextIsDisabled = async () => {
      const cls = (await historyPage.nextPageLink.locator('..').getAttribute('class')) ?? '';
      return cls.includes('disabled');
    };

    if (!(await nextIsDisabled())) {
      const statusBeforeNext = await historyPage.pagingStatus.innerText();
      await historyPage.goToNextPage();
      await expect(historyPage.pagingStatus).not.toHaveText(statusBeforeNext);

      await historyPage.goToPreviousPage();
      await expect(historyPage.pagingStatus).toHaveText(statusBeforeNext);

      let safety = 0;
      while (!(await nextIsDisabled()) && safety < 100) {
        await historyPage.goToNextPage();
        safety++;
      }
      expect(await nextIsDisabled()).toBe(true);
    }
  });
});
