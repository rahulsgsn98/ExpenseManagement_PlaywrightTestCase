import { expect, test } from '@playwright/test';
import { ExpenseHistoryPage } from '../../../../pages/EmployeeReimbursement/ExpenseHistoryPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { ensureEmployeeRoleForEnd2E } from '../../ensureEmployeeRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-EMP-006 History export functionality', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
  });

  test('Export downloads in available formats', async ({ page }) => {
    const historyPage = new ExpenseHistoryPage(page);

    await historyPage.openHistoryPage();
    await historyPage.expectRowsVisible();

    const assertDownload = async (trigger: () => Promise<void>, extensionRegex: RegExp) => {
      const [download] = await Promise.all([page.waitForEvent('download'), trigger()]);
      const fileName = download.suggestedFilename();
      expect(fileName.length).toBeGreaterThan(0);
      expect(fileName).toMatch(extensionRegex);
      expect(await download.failure()).toBeNull();
    };

    // CSV export
    await assertDownload(() => historyPage.clickExportCsv(), /\.csv$/i);

    // Excel export
    await assertDownload(() => historyPage.clickExportExcel(), /\.(xlsx|xls)$/i);

    // PDF export
  //  await assertDownload(() => historyPage.clickExportPdf(), /\.pdf$/i);
  // copy 
   await historyPage.clickExportCopy();

  });
});
