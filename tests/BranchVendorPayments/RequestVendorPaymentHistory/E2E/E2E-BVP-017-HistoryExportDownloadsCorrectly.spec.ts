import { expect, test } from '@playwright/test';
import { BranchVendorPaymentsHistoryPage } from '../../../../pages/BranchVendorPayments/BranchVendorPaymentsHistoryPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BVP-017 Branch Vendor Payments History export functionality', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('Export downloads in available formats', async ({ page }) => {
    const historyPage = new BranchVendorPaymentsHistoryPage(page);

    const assertDownload = async (trigger: () => Promise<void>, extensionRegex: RegExp) => {
      const [download] = await Promise.all([page.waitForEvent('download'), trigger()]);
      const fileName = download.suggestedFilename();
      expect(fileName.length).toBeGreaterThan(0);
      expect(fileName).toMatch(extensionRegex);
      expect(await download.failure()).toBeNull();
    };

    await test.step('Open Branch Vendor Payments → History; table has records', async () => {
      await historyPage.openBranchVendorPaymentsHistoryPage();
      await expect(historyPage.historyRows.first()).toBeVisible();
    });

    await test.step('Export options (Copy / Excel / CSV / PDF) visible near table', async () => {
      await expect(historyPage.historyExportCopyButton).toBeVisible();
      await expect(historyPage.historyExportExcelButton).toBeVisible();
      await expect(historyPage.historyExportCsvButton).toBeVisible();
    //  await expect(historyPage.historyExportPdfButton).toBeVisible();
    });

    await test.step('CSV export — file downloads', async () => {
      await assertDownload(() => historyPage.historyExportCsvButton.click(), /\.csv$/i);
    });

    await test.step('Excel export — file downloads', async () => {
      await assertDownload(() => historyPage.historyExportExcelButton.click(), /\.(xlsx|xls)$/i);
    });

    await test.step('Copy export — click only (parity with BR-015 / EMP-006)', async () => {
      await historyPage.historyExportCopyButton.click();
    });
  });
});
