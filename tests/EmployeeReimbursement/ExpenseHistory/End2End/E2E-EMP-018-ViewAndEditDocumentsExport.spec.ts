import { expect, test } from '@playwright/test';
import { ExpenseHistoryPage } from '../../../../pages/EmployeeReimbursement/ExpenseHistoryPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { ensureEmployeeRoleForEnd2E } from '../../ensureEmployeeRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-EMP-018 View/Edit All Documents export', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureEmployeeRoleForEnd2E(page);
  });

  test('View case: export from Details -> All Documents', async ({ page }) => {
   
    const historyPage = new ExpenseHistoryPage(page);

    await historyPage.openHistoryPage();
    await historyPage.openFirstExpenseDetails();
    await historyPage.ensureAddAttachmentsModalClosed();
    await expect(historyPage.documentsSearchInput).toBeVisible();

    await historyPage.ensureAddAttachmentsModalClosed();
    await historyPage.clickDocumentsExportCopy();

    await test.step('Export Excel and assert download', async () => {
      await historyPage.ensureAddAttachmentsModalClosed();
      const [excelDownload] = await Promise.all([
        page.waitForEvent('download', { timeout: 45_000 }),
        historyPage.clickDocumentsExportExcel(),
      ]);
      expect(excelDownload.suggestedFilename()).toMatch(/\.(xlsx|xls)$/i);
      expect(await excelDownload.failure()).toBeNull();
    });

    await test.step('Export CSV and assert download', async () => {
      await historyPage.ensureAddAttachmentsModalClosed();
      const [csvDownload] = await Promise.all([
        page.waitForEvent('download', { timeout: 45_000 }),
        historyPage.clickDocumentsExportCsv(),
      ]);
      expect(csvDownload.suggestedFilename()).toMatch(/\.csv$/i);
      expect(await csvDownload.failure()).toBeNull();
    });

   /*  await test.step('Export PDF — click PDF control (app does not emit a Playwright download for PDF)', async () => {
      await historyPage.ensureAddAttachmentsModalClosed();
      await historyPage.clickDocumentsExportPdf();
      await expect(page).toHaveURL(/\/ActionCenter\/ExpenseactionCenter\?ID=/i);
      await expect(historyPage.documentsSearchInput).toBeVisible();
    });

    await expect(page).toHaveURL(/\/ActionCenter\/ExpenseactionCenter\?ID=/i);
    await expect(historyPage.documentsSearchInput).toBeVisible(); */
  });

  test('Edit case: export from Edit -> All Documents', async ({ page }) => {
 
    const historyPage = new ExpenseHistoryPage(page);

    await historyPage.openHistoryPage();
    await historyPage.openFirstExpenseDetails();
    await historyPage.ensureAddAttachmentsModalClosed();
    await historyPage.clickEditFromDetails();
    await expect(page).toHaveURL(/\/AllForms\/EditExpenseForm\//i);
    await expect(historyPage.editDocumentsSearchInput).toBeVisible();

    await historyPage.ensureAddAttachmentsModalClosed();
    await historyPage.clickEditDocumentsExportCopy();

    await test.step('Export Excel and assert download', async () => {
      await historyPage.ensureAddAttachmentsModalClosed();
      const [excelDownload] = await Promise.all([
        page.waitForEvent('download', { timeout: 45_000 }),
        historyPage.clickEditDocumentsExportExcel(),
      ]);
      expect(excelDownload.suggestedFilename()).toMatch(/\.(xlsx|xls)$/i);
      expect(await excelDownload.failure()).toBeNull();
    });
 
    await test.step('Export CSV and assert download', async () => {
      await historyPage.ensureAddAttachmentsModalClosed();
      const [csvDownload] = await Promise.all([
        page.waitForEvent('download', { timeout: 45_000 }),
        historyPage.clickEditDocumentsExportCsv(),
      ]);
      expect(csvDownload.suggestedFilename()).toMatch(/\.csv$/i);
      expect(await csvDownload.failure()).toBeNull();
    });

    await test.step.skip('Export PDF and assert download', async () => {
      await historyPage.ensureAddAttachmentsModalClosed();
 
      const [pdfResult] = await Promise.all([
        Promise.race([
          page.waitForEvent('download', { timeout: 10_000 }),
          page.context().waitForEvent('page', { timeout: 10_000 }),
        ]),
        historyPage.clickEditDocumentsExportPdf(),
      ]);
 
      if ('suggestedFilename' in pdfResult) {
        // Came back as a direct download
        expect(pdfResult.suggestedFilename()).toMatch(/\.pdf$/i);
        expect(await pdfResult.failure()).toBeNull();
      } else {
        // Came back as a new tab (PDF rendered in browser)
        const pdfPage = pdfResult;
        await pdfPage.waitForLoadState('load', { timeout: 45_000 });
        expect(pdfPage.url()).toMatch(/\.pdf($|\?)/i);
        await pdfPage.close();
      }

    await expect(page).toHaveURL(/\/AllForms\/EditExpenseForm\//i);
    await expect(historyPage.editDocumentsSearchInput).toBeVisible();
    });
  });
});
