import { expect, Locator, Page } from '@playwright/test';
// import { ensureSidebarLinkVisible } from '../../utils/ensureSidebarLinkVisible';

export class ExpenseHistoryPage {
  readonly page: Page;


  readonly historyMenuLink: Locator;
  readonly pageHeading: Locator;
  readonly searchInput: Locator;
  readonly showEntriesDropdown: Locator;
  readonly exportCopyButton: Locator;
  readonly exportCsvButton: Locator;
  readonly exportExcelButton: Locator;
  readonly exportPdfButton: Locator;
  readonly idHeader: Locator;
  readonly vendorNameHeader: Locator;
  readonly amountHeader: Locator;
  readonly submittedDateHeader: Locator;
  readonly statusHeader: Locator;
  readonly lastUpdatedDateHeader: Locator;
  readonly nextPageLink: Locator;
  readonly previousPageLink: Locator;
  readonly pagingStatus: Locator;
  readonly firstRowIdCell: Locator;
  readonly rowDetailsLink: Locator;
  readonly tableRows: Locator;
  readonly detailsPageRoot: Locator;
  readonly editButton: Locator;
  readonly addAttachmentsButton: Locator;
  readonly addAttachmentsModal: Locator;
  readonly addAttachmentsBackdrop: Locator;
  readonly closeAddAttachmentsModalLink: Locator;
  readonly addDocumentsUploadButton: Locator;
  readonly addDocumentsFileInput: Locator;
  readonly addAttachmentsSubmitButton: Locator;
  readonly detailsIdValue: Locator;
  readonly detailsVendorNameValue: Locator;
  readonly detailsAmountValue: Locator;
  readonly detailsRemarksValue: Locator;
  readonly statusDropdown: Locator;
  readonly detailsSupportingDocumentsButton: Locator;
  readonly remarksToSubmitterInput: Locator;
  readonly updateButton: Locator;
  readonly commentsInput: Locator;
  readonly addCommentsButton: Locator;
  readonly allCommentsSection: Locator;
  readonly documentsSearchInput: Locator;
  readonly documentsShowEntriesDropdown: Locator;
  readonly documentsFileNameHeader: Locator;
  readonly documentsMediaTypeHeader: Locator;
  readonly documentsAttachmentHeader: Locator;
  readonly documentsCreatedByHeader: Locator;
  readonly documentsCategoryHeader: Locator;
  readonly documentsNextPageLink: Locator;
  readonly documentsPreviousPageLink: Locator;
  readonly documentsPageOneLink: Locator;
  readonly documentsPagingStatus: Locator;
  readonly documentsExportCopyButton: Locator;
  readonly documentsExportExcelButton: Locator;
  readonly documentsExportCsvButton: Locator;
  readonly documentsExportPdfButton: Locator;
  readonly firstDocumentAttachmentLink: Locator;
  readonly firstDocumentRow: Locator;
  readonly detailsDocumentsWrapper: Locator;

  // update expensesuccessmessage locator 
  readonly updateExpenseSuccessMessage: Locator;

  /** Employee edit expense form — saves field/file changes (not the admin-only Update button). */
  readonly editFormUpdateInformationButton: Locator;

  // Edit page - All Documents section
  readonly editDocumentsWrapper: Locator;
  readonly editDocumentsSearchInput: Locator;
  readonly editDocumentsShowEntriesDropdown: Locator;
  readonly editDocumentsIdHeader: Locator;
  readonly editDocumentsMediaTypeHeader: Locator;
  readonly editDocumentsAttachmentHeader: Locator;
  readonly editDocumentsRequestIdHeader: Locator;
  readonly editDocumentsCreatedOnHeader: Locator;
  readonly editDocumentsCreatedByHeader: Locator;
  readonly editDocumentsBelongsToHeader: Locator;
  readonly editDocumentsCategoryHeader: Locator;
  readonly editDocumentsActionHeader: Locator;
  readonly editDocumentsExportCopyButton: Locator;
  readonly editDocumentsExportExcelButton: Locator;
  readonly editDocumentsExportCsvButton: Locator;
  readonly editDocumentsExportPdfButton: Locator;
  readonly editDocumentsNextPageLink: Locator;
  readonly editDocumentsPreviousPageLink: Locator;
  readonly editDocumentsPageOneLink: Locator;
  readonly editDocumentsPagingStatus: Locator;
  readonly firstEditDocumentRow: Locator;
  readonly firstEditDocumentAttachmentLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.historyMenuLink = page.getByRole('link', { name: ' History' }).first();
    this.pageHeading = page.getByRole('heading', { name: /History/i });
    this.searchInput = page.getByRole('searchbox');
    this.showEntriesDropdown = page.getByRole('combobox', { name: /Show/i });

    // History toolbar export buttons render as icon-only controls.
    // Order observed in UI: Copy, Excel, CSV, PDF.
    this.exportCopyButton = page.locator('button').nth(0);
    this.exportExcelButton = page.locator('button').nth(1);
    this.exportCsvButton = page.locator('button').nth(2);
    this.exportPdfButton = page.locator('button').nth(3);

    this.idHeader = page.getByRole('columnheader', { name: /ID:/i });
    this.vendorNameHeader = page.getByRole('columnheader', { name: /Vendor Name:/i });
    this.amountHeader = page.getByRole('columnheader', { name: /Amount:/i });
    this.submittedDateHeader = page.getByRole('columnheader', { name: /Submitted Date:/i });
    this.statusHeader = page.getByRole('columnheader', { name: /Status:/i });
    this.lastUpdatedDateHeader = page.getByRole('columnheader', { name: /Last Updated Date:/i });

    this.nextPageLink = page.getByRole('link', { name: 'Next' });
    this.previousPageLink = page.getByRole('link', { name: 'Prev' });
    this.pagingStatus = page.getByRole('status');

    this.firstRowIdCell = page.locator('tbody tr').first().locator('td').first();
    this.rowDetailsLink = page.getByRole('link', { name: 'Details' }).first();
    this.tableRows = page.locator('tbody tr');
    this.detailsPageRoot = page.locator('body');
    this.editButton = page.getByRole('link', { name: /Edit/i });
    this.addAttachmentsButton = page.getByRole('button', { name: /Add Attachments/i });
    this.addAttachmentsModal = page.locator('div.modal-content');
    this.addAttachmentsBackdrop = page.locator('div.modal-backdrop.show');
    this.closeAddAttachmentsModalLink = page.getByRole('link', { name: 'Close' });
    this.addDocumentsUploadButton = page.getByRole('button', { name: 'Add Documents*' });
    this.addDocumentsFileInput = page.locator('input[type="file"]').first();
    this.addAttachmentsSubmitButton = page.getByRole('button', { name: 'Submit', exact: true });

    this.detailsIdValue = page.locator('p').filter({ hasText: /Ansari-/i }).first();
    this.detailsVendorNameValue = page.locator('p').nth(1);
    this.detailsAmountValue = page.locator('p').filter({ hasText: /\$/ }).first();
    this.detailsRemarksValue = page.locator('p').filter({ hasText: /dfs|remark/i }).first();

    this.statusDropdown = page.getByRole('combobox', { name: /Status \*/i });
    this.detailsSupportingDocumentsButton = page.locator('span:has-text("Supporting Documents")').first();
    this.remarksToSubmitterInput = page.getByRole('textbox', { name: 'Add Remark' });
    this.updateButton = page.getByRole('button', { name: 'Update' });

    this.commentsInput = page.locator('#comment');
    this.addCommentsButton = page.getByRole('button', { name: /Add Comments/i });
    this.allCommentsSection = page.getByText('All Comments');

    // Details → All Documents: scope to this table's wrapper (not any ancestor containing "All Documents",
    // which also matches unrelated buttons and breaks nth() export targets).
    this.detailsDocumentsWrapper = page
      .locator('div.dataTables_wrapper')
      .filter({ has: page.getByRole('columnheader', { name: /File Name:/i }) })
      .first();
    const detailsDocumentsWrapper = this.detailsDocumentsWrapper;
    this.documentsSearchInput = detailsDocumentsWrapper.getByRole('searchbox');
    this.documentsShowEntriesDropdown = detailsDocumentsWrapper.getByRole('combobox', { name: /Show/i });
    this.documentsFileNameHeader = detailsDocumentsWrapper.getByRole('columnheader', { name: /File Name:/i });
    this.documentsMediaTypeHeader = page.getByRole('columnheader', { name: /Media Type:/i });
    this.documentsAttachmentHeader = detailsDocumentsWrapper.getByRole('columnheader', { name: /Attachment:/i });
    this.documentsCreatedByHeader = detailsDocumentsWrapper.getByRole('columnheader', { name: /Created By:/i });
    this.documentsCategoryHeader = detailsDocumentsWrapper.getByRole('columnheader', { name: /Category:/i });
    this.documentsNextPageLink = detailsDocumentsWrapper.getByRole('link', { name: 'Next' });
    this.documentsPreviousPageLink = detailsDocumentsWrapper.getByRole('link', { name: 'Prev' });
    this.documentsPageOneLink = detailsDocumentsWrapper.getByRole('link', { name: '1', exact: true });
    this.documentsPagingStatus = detailsDocumentsWrapper.getByRole('status');

    const detailsDtButtons = detailsDocumentsWrapper.locator('div.dt-buttons');
    this.documentsExportCopyButton = detailsDtButtons.locator('button.buttons-copy');
    this.documentsExportExcelButton = detailsDtButtons.locator('button.buttons-excel');
    this.documentsExportCsvButton = detailsDtButtons.locator('button.buttons-csv');
    this.documentsExportPdfButton = detailsDtButtons.locator('button.buttons-pdf');
    this.firstDocumentAttachmentLink = detailsDocumentsWrapper.locator('tbody tr').first().locator('a').first();
    this.firstDocumentRow = detailsDocumentsWrapper.locator('tbody tr').first();

    this.editFormUpdateInformationButton = page.getByRole('button', { name: /Update Information/i });

    // Edit → All Documents grid: scope by **Request ID** + **Media Type** columns (unique on this page).
    // Note: DataTables "ID" column a11y name is usually `ID: activate to sort…`, so /^ID$/ does not match — that broke this wrapper and all Edit-doc flows (E2E-017/018).
    // Document row numeric id is still the first `td` from `getEditDocumentIdForFileName` (not the URL / EditExpenseForm/{requestId}).
    this.editDocumentsWrapper = page
      .locator('div.dataTables_wrapper')
      .filter({ has: page.getByRole('columnheader', { name: /Request ID/i }) })
      .filter({ has: page.getByRole('columnheader', { name: /Media Type/i }) })
      .first();
    const editDocumentsWrapper = this.editDocumentsWrapper;
    this.editDocumentsSearchInput = editDocumentsWrapper.getByRole('searchbox');
    this.editDocumentsShowEntriesDropdown = editDocumentsWrapper.getByRole('combobox', { name: /Show/i });
    this.editDocumentsIdHeader = editDocumentsWrapper.getByRole('columnheader', { name: /^ID:/i });
    this.editDocumentsMediaTypeHeader = editDocumentsWrapper.getByRole('columnheader', { name: /Media Type/i });
    this.editDocumentsAttachmentHeader = editDocumentsWrapper.getByRole('columnheader', { name: /^Attachment$/i });
    this.editDocumentsRequestIdHeader = editDocumentsWrapper.getByRole('columnheader', { name: /Request ID/i });
    this.editDocumentsCreatedOnHeader = editDocumentsWrapper.getByRole('columnheader', { name: /Created On/i });
    this.editDocumentsCreatedByHeader = editDocumentsWrapper.getByRole('columnheader', { name: /Created By/i }).first();
    this.editDocumentsBelongsToHeader = editDocumentsWrapper.getByRole('columnheader', { name: /Belongs To/i });
    this.editDocumentsCategoryHeader = editDocumentsWrapper.getByRole('columnheader', { name: /Category/i }).first();
    this.editDocumentsActionHeader = editDocumentsWrapper.getByRole('columnheader', { name: /Action/i }).first();
    const editDtButtons = editDocumentsWrapper.locator('div.dt-buttons');
    this.editDocumentsExportCopyButton = editDtButtons.locator('button.buttons-copy');
    this.editDocumentsExportExcelButton = editDtButtons.locator('button.buttons-excel');
    this.editDocumentsExportCsvButton = editDtButtons.locator('button.buttons-csv');
    this.editDocumentsExportPdfButton = editDtButtons.locator('button.buttons-pdf');
    this.editDocumentsNextPageLink = editDocumentsWrapper.getByRole('link', { name: 'Next' });
    this.editDocumentsPreviousPageLink = editDocumentsWrapper.getByRole('link', { name: 'Prev' });
    this.editDocumentsPageOneLink = editDocumentsWrapper.getByRole('link', { name: '1', exact: true });
    this.editDocumentsPagingStatus = editDocumentsWrapper.getByRole('status');
    this.firstEditDocumentRow = editDocumentsWrapper.locator('tbody tr').first();
    this.firstEditDocumentAttachmentLink = this.firstEditDocumentRow.locator('a').first();


    // Edit form save toast (wording may vary slightly; avoid exact-only match).
    this.updateExpenseSuccessMessage = page.getByText(/Form Edited successfully/i).first();
  }

  /**
   * Asserts the edit-form save toast, then briefly waits and clears overlays (Escape).
   * Avoids `waitFor({ state: 'hidden' })` on the toast alone — some builds detach the node or keep a11y "visible",
   * which caused long hangs after Update Information.
   */
  async expectUpdateExpenseSuccessMessageVisible() {
    await expect(this.updateExpenseSuccessMessage).toBeVisible({ timeout: 60_000 });
  
  }

  async openHistoryPage() {
    // await ensureSidebarLinkVisible(this.page, this.historyMenuLink);
    await expect(this.historyMenuLink).toBeVisible();
    try {
      await this.historyMenuLink.scrollIntoViewIfNeeded();
      await this.historyMenuLink.click({ timeout: 5000 });
    } catch {
      await this.page.goto('/ActionCenter/AllExpenseForms', { waitUntil: 'domcontentloaded' });
    }
    await expect(this.page).toHaveURL(/\/ActionCenter\/AllExpenseForms/i);
    await expect(this.pageHeading).toBeVisible();
  }

  async search(keyword: string) {
    await this.searchInput.fill(keyword);
  }

  async clearSearch() {
    await this.searchInput.fill('');
  }

  async selectShowEntries(value: '10' | '25' | '50' | '100') {
    await this.showEntriesDropdown.selectOption(value);
  }

  async sortByVendorName() {
    await this.vendorNameHeader.click();
  }

  async goToNextPage() {
    await this.nextPageLink.click();
  }

  async goToPreviousPage() {
    await this.previousPageLink.click();
  }

  async clickFirstRowToExpand() {
    await this.firstRowIdCell.click();
  }

  async clickFirstDetailsLink() {
    await this.rowDetailsLink.click();
  }

  async openFirstExpenseDetails() {
    await this.clickFirstDetailsLink();
    await expect(this.page).toHaveURL(/\/ActionCenter\/ExpenseactionCenter\?ID=/i);
  }

  async clickEditFromDetails() {
    await this.editButton.click();
  }

  async openAddAttachmentsModal() {
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.addAttachmentsButton).toBeVisible();
    await this.addAttachmentsButton.click({ force: true });
    await expect(this.addAttachmentsModal).toBeVisible();
  }

  async expectAddAttachmentsModalVisible() {
    await expect(this.addAttachmentsModal).toBeVisible();
    await expect(this.addDocumentsUploadButton).toBeVisible();
    await expect(this.addAttachmentsSubmitButton).toBeVisible();
  }

  async uploadDocumentInAddAttachmentsModal(filePath: string) {
    await this.addDocumentsFileInput.setInputFiles(filePath);
  }

  async submitAddAttachmentsModal() {
    await this.addAttachmentsSubmitButton.click();
  }

  async closeAddAttachmentsModal() {
    await this.closeAddAttachmentsModalLink.click();
  }

  async expectAddAttachmentsModalClosed() {
    await expect(this.addAttachmentsModal).not.toBeVisible();
  }

  async ensureAddAttachmentsModalClosed() {
    for (let attempt = 0; attempt < 3; attempt++) {
      const modalVisible = await this.addAttachmentsModal.isVisible();
      const backdropVisible = await this.addAttachmentsBackdrop.isVisible();
      if (!modalVisible && !backdropVisible) return;

      if (modalVisible && (await this.closeAddAttachmentsModalLink.isVisible())) {
        await this.closeAddAttachmentsModalLink.click();
      } else {
        await this.page.keyboard.press('Escape');
      }

      await this.page.waitForTimeout(200);
    }

    await expect(this.addAttachmentsModal).not.toBeVisible();
    await expect(this.addAttachmentsBackdrop).not.toBeVisible();
  }

  async selectStatus(status: 'Approved' | 'Approved-Amended' | 'Denied' | 'Paid' | 'Pending') {
    await this.statusDropdown.selectOption(status);
  }

  async fillRemarksToSubmitter(remarks: string) {
    await this.remarksToSubmitterInput.fill(remarks);
  }

  async uploadDetailsSupportingDocument(filePath: string) {
    await this.detailsSupportingDocumentsButton.setInputFiles(filePath);
  }

  async clickUpdate() {
    await this.updateButton.click();
  }

  async clickEditFormUpdateInformation() {
    await expect(this.editFormUpdateInformationButton).toBeVisible();
    await this.editFormUpdateInformationButton.scrollIntoViewIfNeeded();
    await this.editFormUpdateInformationButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * **All Documents** table **ID** column (first `td`, e.g. `10563`) for the row containing `fileName`.
   * This is the document grid id — not the expense **Request ID** (URL `EditExpenseForm/8376`) in the Request ID column.
   */
  async getEditDocumentIdForFileName(fileName: string): Promise<string> {
    await this.searchEditDocuments('');
    const row = this.editDocumentsWrapper.locator('tbody tr').filter({ hasText: fileName }).first();
    await expect
      .poll(async () => row.isVisible(), {
        message: `Edit All Documents row for "${fileName}"`,
        timeout: 45_000
      })
      .toBeTruthy();
    const idText = (await row.locator('td').nth(0).innerText()).trim();
    expect(idText.length).toBeGreaterThan(0);
    return idText;
  }

  /** Details → All Documents: row for `fileName` must show optional createdBy / category text. */
  async expectDetailsDocumentRowForFile(
    fileName: string,
    values: { createdBy?: string | RegExp; category?: string | RegExp }
  ) {
    const row = this.detailsDocumentsWrapper.locator('tbody tr').filter({ hasText: fileName }).first();
    await expect(row).toBeVisible();
    if (values.createdBy) await expect(row).toContainText(values.createdBy);
    if (values.category) await expect(row).toContainText(values.category);
  }

  async fillComment(comment: string) {
    await this.commentsInput.fill(comment);
  }

  async clickAddComments() {
    await this.addCommentsButton.click();
  }

  async searchDocuments(keyword: string) {
    await this.documentsSearchInput.fill(keyword);
  }

  async selectDocumentsShowEntries(value: '10' | '25' | '50' | '100') {
    await this.documentsShowEntriesDropdown.selectOption(value);
  }

  async sortDocumentsByFileName() {
    if (await this.documentsFileNameHeader.count()) {
      await this.documentsFileNameHeader.first().click();
      return;
    }
    await this.documentsMediaTypeHeader.first().click();
  }

  async sortDocumentsByAttachment() {
    await this.documentsAttachmentHeader.first().click();
  }

  async goToNextDocumentsPage() {
    await this.documentsNextPageLink.click();
  }

  async clickDocumentsExportCopy() {
    await expect(this.documentsExportCopyButton).toBeVisible();
    await this.documentsExportCopyButton.scrollIntoViewIfNeeded();
    await this.documentsExportCopyButton.click();
  }

  async clickDocumentsExportExcel() {
    await expect(this.documentsExportExcelButton).toBeVisible();
    await this.documentsExportExcelButton.scrollIntoViewIfNeeded();
    await this.documentsExportExcelButton.click();
  }

  async clickDocumentsExportCsv() {
    await expect(this.documentsExportCsvButton).toBeVisible();
    await this.documentsExportCsvButton.scrollIntoViewIfNeeded();
    await this.documentsExportCsvButton.click();
  }

  async clickDocumentsExportPdf() {
    // PDF control is often `display:none` in this app (DataTables still injects the node); use attached + force click.
    await expect(this.documentsExportPdfButton).toBeAttached();
    await this.documentsExportPdfButton.scrollIntoViewIfNeeded();
    await this.documentsExportPdfButton.click({ force: true });
  }

  async openFirstDocumentAttachment() {
    await this.firstDocumentAttachmentLink.click();
  }

  async searchEditDocuments(keyword: string) {
    await this.editDocumentsWrapper.scrollIntoViewIfNeeded();
    await expect(this.editDocumentsSearchInput).toBeVisible({ timeout: 20_000 });
    await this.editDocumentsSearchInput.fill(keyword);
  }

  async selectEditDocumentsShowEntries(value: '10' | '25' | '50' | '100') {
    await this.editDocumentsWrapper.scrollIntoViewIfNeeded();
    await expect(this.editDocumentsShowEntriesDropdown).toBeVisible({ timeout: 20_000 });
    await this.editDocumentsShowEntriesDropdown.selectOption(value, { force: true, timeout: 30_000 });
  }

  async sortEditDocumentsByCreatedOn() {
    await this.editDocumentsCreatedOnHeader.click();
  }

  async goToNextEditDocumentsPage() {
    await this.editDocumentsNextPageLink.click();
  }

  async goToPreviousEditDocumentsPage() {
    await this.editDocumentsPreviousPageLink.click();
  }

  async clickEditDocumentsExportCopy() {
    await expect(this.editDocumentsExportCopyButton).toBeVisible();
    await this.editDocumentsExportCopyButton.scrollIntoViewIfNeeded();
    await this.editDocumentsExportCopyButton.click();
  }

  async clickEditDocumentsExportExcel() {
    await expect(this.editDocumentsExportExcelButton).toBeVisible();
    await this.editDocumentsExportExcelButton.scrollIntoViewIfNeeded();
    await this.editDocumentsExportExcelButton.click();
  }

  async clickEditDocumentsExportCsv() {
    await expect(this.editDocumentsExportCsvButton).toBeVisible();
    await this.editDocumentsExportCsvButton.scrollIntoViewIfNeeded();
    await this.editDocumentsExportCsvButton.click();
  }

  async clickEditDocumentsExportPdf() {
    await expect(this.editDocumentsExportPdfButton).toBeAttached();
    await this.editDocumentsExportPdfButton.scrollIntoViewIfNeeded();
    await this.editDocumentsExportPdfButton.click({ force: true });
  }

  async openFirstEditDocumentAttachment() {
    await this.firstEditDocumentAttachmentLink.click();
  }

  async clickExportCopy() {
    await expect(this.exportCopyButton).toBeVisible();
    await this.exportCopyButton.click();
  }

  async clickExportCsv() {
    await expect(this.exportCsvButton).toBeVisible();
    await this.exportCsvButton.click();
  }

  async clickExportExcel() {
    await expect(this.exportExcelButton).toBeVisible();
    await this.exportExcelButton.click();
  }

  async clickExportPdf() {
    await expect(this.exportPdfButton).toBeVisible();
    await this.exportPdfButton.click();
  }

  async expectSearchResultContains(text: string) {
    await expect(this.page.locator('tbody')).toContainText(text);
  }

  async expectPagingStatusContains(text: string) {
    await expect(this.pagingStatus).toContainText(text);
  }

  async expectRowsVisible() {
    await expect(this.tableRows.first()).toBeVisible();
  }

  async expectDetailsPageLoaded() {
    await expect(this.page).toHaveURL(/\/ActionCenter\/ExpenseactionCenter\?ID=/i);
    await expect(this.editButton).toBeVisible();
    await expect(this.addAttachmentsButton).toBeVisible();
    await expect(this.statusDropdown).toBeVisible();
    await expect(this.commentsInput).toBeVisible();
    await expect(this.documentsSearchInput).toBeVisible();
  }

  async expectDocumentsPagingStatusContains(text: string) {
    await expect(this.documentsPagingStatus).toContainText(text);
  }

  async expectFirstDetailsDocumentValues(values: {
    fileName?: string;
    createdBy?: string | RegExp;
    category?: string | RegExp;
  }) {
    await expect(this.firstDocumentRow).toBeVisible();
    if (values.fileName) await expect(this.firstDocumentRow).toContainText(values.fileName);
    if (values.createdBy) await expect(this.firstDocumentRow).toContainText(values.createdBy);
    if (values.category) await expect(this.firstDocumentRow).toContainText(values.category);
  }

  async expectFirstEditDocumentValues(values: {
    mediaType?: string | RegExp;
    requestId?: string | RegExp;
    createdOn?: string | RegExp;
    createdBy?: string | RegExp;
    belongsTo?: string | RegExp;
    category?: string | RegExp;
  }) {
    await expect(this.firstEditDocumentRow).toBeVisible();
    if (values.mediaType) await expect(this.firstEditDocumentRow).toContainText(values.mediaType);
    if (values.requestId) await expect(this.firstEditDocumentRow).toContainText(values.requestId);
    if (values.createdOn) await expect(this.firstEditDocumentRow).toContainText(values.createdOn);
    if (values.createdBy) await expect(this.firstEditDocumentRow).toContainText(values.createdBy);
    if (values.belongsTo) await expect(this.firstEditDocumentRow).toContainText(values.belongsTo);
    if (values.category) await expect(this.firstEditDocumentRow).toContainText(values.category);
  }

  /** Assert the first visible row in Edit → All Documents after filtering (e.g. by ID search). */
  async expectFirstEditDocumentRowMatches(values: {
    mediaType?: string | RegExp;
    createdOn?: string | RegExp;
    belongsTo?: string | RegExp;
    category?: string | RegExp;
  }) {
    const row = this.editDocumentsWrapper.locator('tbody tr').first();
    await expect(row).toBeVisible();
    if (values.mediaType) await expect(row).toContainText(values.mediaType);
    if (values.createdOn) await expect(row).toContainText(values.createdOn);
    if (values.belongsTo) await expect(row).toContainText(values.belongsTo);
    if (values.category) await expect(row).toContainText(values.category);
  }
}
