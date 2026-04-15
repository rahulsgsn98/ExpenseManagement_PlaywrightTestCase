import { expect, test } from '@playwright/test';
import { BranchReimbursementHistoryPage } from '../../../../pages/BranchReimbursement/BranchReimbursementHistoryPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BR-015 Branch History export functionality', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Export downloads in available formats', async ({ page }) => {
    const historyPage = new BranchReimbursementHistoryPage(page);

    await historyPage.openBranchHistoryPage();
    await expect(historyPage.branchHistoryTableWrapper.locator('tbody tr:not(.child)').first()).toBeVisible();

    const assertDownload = async (trigger: () => Promise<void>, extensionRegex: RegExp) => {
      const [download] = await Promise.all([page.waitForEvent('download'), trigger()]);
      const fileName = download.suggestedFilename();
      expect(fileName.length).toBeGreaterThan(0);
      expect(fileName).toMatch(extensionRegex);
      expect(await download.failure()).toBeNull();
    };

    await assertDownload(() => historyPage.historyExportCsvButton.click(), /\.csv$/i);
    await assertDownload(() => historyPage.historyExportExcelButton.click(), /\.(xlsx|xls)$/i);

    // Keep parity with EMP-006: Copy export click only.
    await historyPage.historyExportCopyButton.click();
  });
});
