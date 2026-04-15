import { expect, test } from '@playwright/test';
import { TestConfig } from '../../../../test.config';
import { ExpenseHistoryPage } from '../../../../pages/EmployeeReimbursement/ExpenseHistoryPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { ensureEmployeeRoleForEnd2E } from '../../ensureEmployeeRoleForEnd2E';

const testConfig = new TestConfig();

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-EMP-005 History search filters records', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
  });

  test('Search filters, clears, and empty-state behavior', async ({ page }) => {
    const historyPage = new ExpenseHistoryPage(page);

    await historyPage.openHistoryPage();
    await historyPage.expectRowsVisible();

    // Search with known-like vendor keyword (configured in test.config.ts).
    await historyPage.search(testConfig.e2eHistorySearchMatchKeyword);
    const filteredRows = page.locator('tbody tr');
    await expect(filteredRows.first()).toBeVisible();

    // Clear search and confirm rows are restored.
    await historyPage.clearSearch();
    await historyPage.expectRowsVisible();

    // Search non-existent keyword and verify empty state (configured in test.config.ts).
    await historyPage.search(testConfig.e2eHistorySearchNoMatchKeyword);
    await expect(page.getByText('No matching records found')).toBeVisible();

    // Clear again and verify rows restored.
    await historyPage.clearSearch();
    await historyPage.expectRowsVisible();
  });
});
