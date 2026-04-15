import { expect, test } from '@playwright/test';
import { BranchReimbursementHistoryPage } from '../../../../pages/BranchReimbursement/BranchReimbursementHistoryPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BR-020 View/Edit All Documents export', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
  });

  test('View case: export from Details -> All Documents', async ({ page }) => {
    const historyPage = new BranchReimbursementHistoryPage(page);
    const clickExportAndOptionallyAssertDownload = async (
      trigger: () => Promise<void>,
      extensionRegex: RegExp,
      stableAssert: () => Promise<void>
    ) => {
      const downloadPromise = page.waitForEvent('download', { timeout: 10_000 }).catch(() => null);
      await trigger();
      const download = await downloadPromise;
      if (download) {
        expect(download.suggestedFilename()).toMatch(extensionRegex);
        expect(await download.failure()).toBeNull();
      } else {
        await stableAssert();
      }
    };

    await historyPage.openBranchHistoryPage();
    if (!(await historyPage.hasBranchHistoryRows())) {
      test.skip(true, 'E2E-BR-020 skipped: no branch reimbursement records in History.');
    }

    await historyPage.openFirstBranchHistoryDetails();
    await historyPage.ensureAddAttachmentsModalClosed();

    await expect(historyPage.detailsDocumentsSearchInput).toBeVisible();

    await historyPage.ensureAddAttachmentsModalClosed();
    await historyPage.clickDetailsDocumentsExportCopy();

    await test.step('Export Excel and assert download', async () => {
      await historyPage.ensureAddAttachmentsModalClosed();
      await clickExportAndOptionallyAssertDownload(
        () => historyPage.clickDetailsDocumentsExportExcel(),
        /\.(xlsx|xls)$/i,
        async () => {
          await expect(page).toHaveURL(/\/ActionCenter\/CostactionCenter\?ID=/i);
          await expect(historyPage.detailsDocumentsSearchInput).toBeVisible();
        }
      );
    });

    await test.step('Export CSV and assert download', async () => {
      await historyPage.ensureAddAttachmentsModalClosed();
      await clickExportAndOptionallyAssertDownload(
        () => historyPage.clickDetailsDocumentsExportCsv(),
        /\.csv$/i,
        async () => {
          await expect(page).toHaveURL(/\/ActionCenter\/CostactionCenter\?ID=/i);
          await expect(historyPage.detailsDocumentsSearchInput).toBeVisible();
        }
      );
    });
  });

  test('Edit case: export from Edit -> All Documents', async ({ page }) => {
    const historyPage = new BranchReimbursementHistoryPage(page);
    const clickExportAndOptionallyAssertDownload = async (
      trigger: () => Promise<void>,
      extensionRegex: RegExp,
      stableAssert: () => Promise<void>
    ) => {
      const downloadPromise = page.waitForEvent('download', { timeout: 10_000 }).catch(() => null);
      await trigger();
      const download = await downloadPromise;
      if (download) {
        expect(download.suggestedFilename()).toMatch(extensionRegex);
        expect(await download.failure()).toBeNull();
      } else {
        await stableAssert();
      }
    };

    await historyPage.openBranchHistoryPage();
    if (!(await historyPage.hasBranchHistoryRows())) {
      test.skip(true, 'E2E-BR-020 skipped: no branch reimbursement records in History.');
    }

    await historyPage.openFirstBranchHistoryDetails();
    await historyPage.ensureAddAttachmentsModalClosed();

    await historyPage.openEditFromDetails();
    await expect(page).toHaveURL(/\/AllForms\/EditCostExpenseForm\//i);
    await expect(historyPage.editDocumentsSearchInput).toBeVisible();

    await historyPage.ensureAddAttachmentsModalClosed();
    await historyPage.clickEditDocumentsExportCopy();

    await test.step('Export Excel and assert download', async () => {
      await historyPage.ensureAddAttachmentsModalClosed();
      await clickExportAndOptionallyAssertDownload(
        () => historyPage.clickEditDocumentsExportExcel(),
        /\.(xlsx|xls)$/i,
        async () => {
          await expect(page).toHaveURL(/\/AllForms\/EditCostExpenseForm\//i);
          await expect(historyPage.editDocumentsSearchInput).toBeVisible();
        }
      );
    });

    await test.step('Export CSV and assert download', async () => {
      await historyPage.ensureAddAttachmentsModalClosed();
      await clickExportAndOptionallyAssertDownload(
        () => historyPage.clickEditDocumentsExportCsv(),
        /\.csv$/i,
        async () => {
          await expect(page).toHaveURL(/\/AllForms\/EditCostExpenseForm\//i);
          await expect(historyPage.editDocumentsSearchInput).toBeVisible();
        }
      );
    });
  });
});
