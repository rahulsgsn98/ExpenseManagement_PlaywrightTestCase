import { expect, Locator, Page } from '@playwright/test';

export class BranchReimbursementHistoryPage {
  readonly page: Page;

  // Branch history page
  readonly branchHistoryMenuLink: Locator;
  readonly historyPageHeading: Locator;
  readonly historySearchInput: Locator;
  readonly historyShowEntriesDropdown: Locator;
  readonly historyExportCopyButton: Locator;
  readonly historyExportExcelButton: Locator;
  readonly historyExportCsvButton: Locator;
  readonly branchExpenseIdHeader: Locator;
  readonly vendorNameHeader: Locator;
  readonly amountHeader: Locator;
  readonly statusHeader: Locator;
  readonly lastUpdatedDateHeader: Locator;
  readonly historyNextPageLink: Locator;
  readonly historyPagingStatus: Locator;
  readonly rowDetailsLink: Locator;
  readonly historyRows: Locator;
  /** Branch Reimbursement history DataTable (scoped so search/rows are not confused with other widgets). */
  readonly branchHistoryTableWrapper: Locator;

  // Details page
  readonly detailsEditLink: Locator;
  readonly detailsAddAttachmentsButton: Locator;
  readonly detailsStatusDropdown: Locator;
  readonly detailsApprovedAmountInput: Locator;
  readonly detailsSupportingDocumentsButton: Locator;
  readonly detailsAddRemarkInput: Locator;
  readonly detailsUpdateButton: Locator;
  readonly detailsCommentsInput: Locator;
  readonly detailsAddCommentsButton: Locator;
  readonly detailsAllCommentsSection: Locator;
  readonly updateBranchExpenseSuccessMessage: Locator;
  readonly detailsDocumentsSearchInput: Locator;
  readonly detailsDocumentsShowEntriesDropdown: Locator;
  readonly detailsDocumentsRows: Locator;
  readonly detailsDocumentsExportCopyButton: Locator;
  readonly detailsDocumentsExportExcelButton: Locator;
  readonly detailsDocumentsExportCsvButton: Locator;
  readonly detailsDocumentsExportPdfButton: Locator;

  // Add Attachments modal (Details page)
  readonly addAttachmentsModal: Locator;
  readonly addAttachmentsCloseLink: Locator;
  readonly addAttachmentsFileInput: Locator;
  readonly addAttachmentsFileButton: Locator;
  readonly addAttachmentsSubmitButton: Locator;

  // Edit page
  readonly editPageHeading: Locator;
  readonly submissionDateInput: Locator;
  readonly costCenterDropdown: Locator;
  readonly editAmountInput: Locator;
  readonly expenseDateInput: Locator;
  readonly expenseCategoryDropdown: Locator;
  readonly editVendorNameInput: Locator;
  readonly editDescriptionInput: Locator;
  readonly editSupportingDocumentsInput: Locator;
  readonly notesInput: Locator;
  readonly updateInformationButton: Locator;

  // Edit page - All Documents section
  readonly editDocumentsSearchInput: Locator;
  readonly editDocumentsShowEntriesDropdown: Locator;
  readonly editDocumentsMediaTypeHeader: Locator;
  readonly editDocumentsAttachmentHeader: Locator;
  readonly editDocumentsNextPageLink: Locator;
  readonly editDocumentsPagingStatus: Locator;
  readonly editDocumentsExportCopyButton: Locator;
  readonly editDocumentsExportExcelButton: Locator;
  readonly editDocumentsExportCsvButton: Locator;
  readonly editDocumentsExportPdfButton: Locator;
  readonly firstEditDocumentRow: Locator;
  readonly editFirstAttachmentLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Branch history
    this.branchHistoryMenuLink = page.getByRole('link', { name: ' History' }).nth(1);
    this.historyPageHeading = page.getByRole('heading', { name: 'History' });
    this.branchHistoryTableWrapper = page
      .locator('div.dataTables_wrapper')
      .filter({ has: page.getByRole('columnheader', { name: /Branch Expense ID/i }) })
      .first();
    this.historySearchInput = this.branchHistoryTableWrapper
      .locator('.dataTables_filter input')
      .or(this.branchHistoryTableWrapper.getByRole('searchbox'))
      .first();
    this.historyShowEntriesDropdown = this.branchHistoryTableWrapper.getByRole('combobox', { name: /Show/i });
    this.historyExportCopyButton = page.locator('button').filter({ hasText: 'Copy' }).first();
    this.historyExportExcelButton = page.locator('button').filter({ hasText: 'Excel' }).first();
    this.historyExportCsvButton = page.locator('button').filter({ hasText: 'CSV' }).first();
    this.branchExpenseIdHeader = page.getByRole('columnheader', { name: /Branch Expense ID:/i });
    this.vendorNameHeader = page.getByRole('columnheader', { name: /Vendor Name:/i }).first();
    this.amountHeader = page.getByRole('columnheader', { name: /Amount:/i }).first();
    this.statusHeader = page.getByRole('columnheader', { name: /Status:/i }).first();
    this.lastUpdatedDateHeader = page.getByRole('columnheader', { name: /Last Updated Date:/i });
    this.historyNextPageLink = page.getByRole('link', { name: 'Next' }).first();
    this.historyPagingStatus = page.getByRole('status').first();
    this.rowDetailsLink = page.getByRole('link', { name: 'Details' }).first();
    this.historyRows = page.locator('tbody tr');

    // Details page
    this.detailsEditLink = page.getByRole('link', { name: /Edit/i });
    this.detailsAddAttachmentsButton = page.getByRole('button', { name: /Add Attachments/i });
    const internalFinanceSection = page.locator('div').filter({ has: page.getByText('Internal Finance Team') }).first();
    this.detailsStatusDropdown = page.getByRole('combobox', { name: 'Status *' }).first();
    this.detailsApprovedAmountInput = internalFinanceSection.getByRole('textbox', { name: 'Approved Amount *' })
    this.detailsSupportingDocumentsButton = page.getByLabel('Supporting Documents *').first();
    this.detailsAddRemarkInput = internalFinanceSection.getByRole('textbox', { name: 'Add Remark' }).first();
    this.detailsUpdateButton = internalFinanceSection.getByRole('button', { name: 'Update' }).first();
    this.detailsCommentsInput = page.locator('#comment');
    this.detailsAddCommentsButton = page.getByRole('button', { name: /Add Comments/i });
    this.detailsAllCommentsSection = page.getByText('All Comments');
    this.updateBranchExpenseSuccessMessage = page.getByText(/Form Edited successfully/i).first();
    const detailsDocumentsSection = page.locator('div').filter({ hasText: 'All Documents' }).first();
    this.detailsDocumentsSearchInput = detailsDocumentsSection.getByRole('searchbox').first();
    this.detailsDocumentsShowEntriesDropdown = detailsDocumentsSection.getByRole('combobox', { name: /Show/i }).first();
    this.detailsDocumentsRows = detailsDocumentsSection.locator('tbody tr');
    const detailsDtButtons = detailsDocumentsSection.locator('div.dt-buttons');
    this.detailsDocumentsExportCopyButton = detailsDtButtons.locator('button.buttons-copy');
    this.detailsDocumentsExportExcelButton = detailsDtButtons.locator('button.buttons-excel');
    this.detailsDocumentsExportCsvButton = detailsDtButtons.locator('button.buttons-csv');
    this.detailsDocumentsExportPdfButton = detailsDtButtons.locator('button.buttons-pdf');

    // Add Attachments modal
    this.addAttachmentsModal = page.locator('div.modal-content');
    this.addAttachmentsCloseLink = page.getByRole('link', { name: 'Close' });
    this.addAttachmentsFileInput = page.locator('input[type="file"]').first();
    this.addAttachmentsFileButton = page.getByRole('button', { name: 'Add Documents*' });
    this.addAttachmentsSubmitButton = page.getByRole('button', { name: 'Submit', exact: true });

    // Edit page
    this.editPageHeading = page.getByRole('heading', { name: /Branch Expense Form/i });
    this.submissionDateInput = page.getByRole('textbox', { name: 'Submission Date *' });
    this.costCenterDropdown = page.getByLabel('Cost Center ID *');
    this.editAmountInput = page.getByRole('textbox', { name: 'Amount*' });
    this.expenseDateInput = page.getByRole('textbox', { name: 'Expense Date *' });
    this.expenseCategoryDropdown = page.getByLabel('Expense Category *');
    this.editVendorNameInput = page.getByRole('textbox', { name: /Vendor Name \*/i });
    this.editDescriptionInput = page.getByRole('textbox', { name: 'Description *' });
    this.editSupportingDocumentsInput = page.locator('input[type="file"][name="SupportingMedia"]');
    this.notesInput = page.getByRole('textbox', { name: 'Notes *' });
    this.updateInformationButton = page.getByRole('button', { name: 'Update Information' });

    // Edit page documents section
    const editDocumentsSection = page.locator('div').filter({ hasText: 'All Documents' }).first();
    this.editDocumentsSearchInput = editDocumentsSection.getByRole('searchbox');
    this.editDocumentsShowEntriesDropdown = editDocumentsSection.getByRole('combobox', { name: /Show/i });
    this.editDocumentsMediaTypeHeader = page.getByRole('columnheader', { name: /Media Type:/i });
    this.editDocumentsAttachmentHeader = page.getByRole('columnheader', { name: /Attachment:/i });
    this.editDocumentsNextPageLink = editDocumentsSection.getByRole('link', { name: 'Next' });
    this.editDocumentsPagingStatus = editDocumentsSection.getByRole('status');
    const editDtButtons = editDocumentsSection.locator('div.dt-buttons');
    this.editDocumentsExportCopyButton = editDtButtons.locator('button.buttons-copy');
    this.editDocumentsExportExcelButton = editDtButtons.locator('button.buttons-excel');
    this.editDocumentsExportCsvButton = editDtButtons.locator('button.buttons-csv');
    this.editDocumentsExportPdfButton = editDtButtons.locator('button.buttons-pdf');
    this.firstEditDocumentRow = editDocumentsSection.locator('tbody tr').first();
    this.editFirstAttachmentLink = this.firstEditDocumentRow.locator('a').first();
  }

  async openBranchHistoryPage() {
    await this.page.goto('/ActionCenter/AllCostExpense');
    await expect(this.page).toHaveURL(/\/ActionCenter\/AllCostExpense/i);
    await expect(this.historyPageHeading).toBeVisible();
  }

  async searchBranchHistory(keyword: string) {
    await this.historySearchInput.fill(keyword);
  }

  /**
   * Main grid row (excludes DataTables `tr.child` detail rows). Use after {@link searchBranchHistory}.
   */
  branchHistoryMainDataRow(vendorName: string, amountDisplay: string): Locator {
    return this.branchHistoryTableWrapper
      .locator('tbody tr:not(.child)')
      .filter({ hasText: vendorName })
      .filter({ hasText: amountDisplay })
      .first();
  }

  async selectHistoryShowEntries(value: '10' | '25' | '50' | '100') {
    await this.historyShowEntriesDropdown.selectOption(value);
  }

  async sortBranchHistoryByVendorName() {
    await this.vendorNameHeader.click();
  }

  async openFirstHistoryDetails() {
    await this.rowDetailsLink.click();
    await expect(this.page).toHaveURL(/\/ActionCenter\/CostactionCenter\?ID=/i);
  }

  async hasBranchHistoryRows() {
    return (await this.branchHistoryTableWrapper.locator('tbody tr:not(.child)').count()) > 0;
  }

  async openFirstBranchHistoryDetails() {
    const firstMainRow = this.branchHistoryTableWrapper.locator('tbody tr:not(.child)').first();
    await expect(firstMainRow).toBeVisible();
    await this.openBranchHistoryDetailsForRow(firstMainRow);
  }

  /** Expand the main row (first cell), then open Details — same pattern as {@link openFirstHistoryDetails}. */
  async openBranchHistoryDetailsForRow(mainRow: Locator) {
    await mainRow.locator('td, th').first().click();
    await this.rowDetailsLink.click();
    await expect(this.page).toHaveURL(/\/ActionCenter\/CostactionCenter\?ID=/i);
  }

  async openAddAttachmentsModal() {
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.detailsAddAttachmentsButton).toBeVisible();
    await this.detailsAddAttachmentsButton.click({ force: true });
    await expect(this.addAttachmentsModal).toBeVisible();
  }

  async selectDetailsStatus(status: 'Approved' | 'Approved-Amended' | 'Denied' | 'Paid' | 'Pending') {
    await expect(this.detailsStatusDropdown).toBeVisible();
    await this.detailsStatusDropdown.selectOption({ value: status });
     
 // Wait for React to finish any pending renders before interacting
// await this.page.waitForTimeout(1000);
  
 await expect(async () => {
   await this.detailsStatusDropdown.focus();
   await this.page.waitForTimeout(300);
   await this.detailsStatusDropdown.selectOption({ value: status });
   await this.detailsStatusDropdown.dispatchEvent('change');
   await expect(this.detailsStatusDropdown).toHaveValue(status);
 }).toPass({ timeout: 15_000, intervals: [1000, 2000, 3000] });


   
 if (status === 'Approved-Amended') {
  await expect
    .poll(
      async () => {
        await this.detailsStatusDropdown.selectOption({ value: status });
        await this.detailsStatusDropdown.dispatchEvent('change');
        await this.detailsStatusDropdown.blur();
        return await this.detailsApprovedAmountInput.isVisible();
      },
      { timeout: 30_000, intervals: [500, 1000, 2000, 3000] }
    )
    .toBe(true);
}
   
  }

  async fillDetailsApprovedAmount(amount: string) {
 
    await expect(this.detailsApprovedAmountInput).toBeVisible({ timeout: 10_000 });
    await this.detailsApprovedAmountInput.fill(amount);
  }

  async fillRemarksToSubmitter(remarks: string) {
    await this.detailsAddRemarkInput.fill(remarks);
  }

  async uploadFileInAddAttachmentsModal(filePath: string) {
    await this.addAttachmentsFileInput.setInputFiles(filePath);
  }

  async uploadDetailsSupportingDocument(filePath: string) {
    await this.detailsSupportingDocumentsButton.setInputFiles(filePath);
  }

  async fillComment(comment: string) {
    await this.detailsCommentsInput.fill(comment);
  }

  async clickUpdate() {
    await this.detailsUpdateButton.click();
  }

  async submitAddAttachmentsModal() {
    await this.addAttachmentsSubmitButton.click();
  }

  async closeAddAttachmentsModal() {
    await this.addAttachmentsCloseLink.click();
    await expect(this.addAttachmentsModal).not.toBeVisible();
  }

  async ensureAddAttachmentsModalClosed() {
    if (await this.addAttachmentsModal.isVisible()) {
      await this.closeAddAttachmentsModal();
    }
    await expect(this.addAttachmentsModal).not.toBeVisible();
  }

  async openEditFromDetails() {
    await this.detailsEditLink.click();
    await expect(this.page).toHaveURL(/\/AllForms\/EditCostExpenseForm\//i);
    await expect(this.editPageHeading).toBeVisible();
  }

  async updateBranchExpenseForm(data: {
    amount: string;
    expenseDate: string;
    expenseCategoryValue: string;
    vendorName: string;
    description: string;
    notes: string;
  }) {
    await this.editAmountInput.fill(data.amount);
    await this.expenseDateInput.fill(data.expenseDate);
    await this.expenseCategoryDropdown.selectOption(data.expenseCategoryValue);
    await this.editVendorNameInput.fill(data.vendorName);
    await this.editDescriptionInput.fill(data.description);
    await this.notesInput.fill(data.notes);
  }

  async clickUpdateInformation() {
    await this.updateInformationButton.click();
  }

  async expectUpdateBranchExpenseSuccessMessageVisible() {
    await expect(this.updateBranchExpenseSuccessMessage).toBeVisible({ timeout: 60_000 });
  }

  async searchEditDocuments(keyword: string) {
    await this.editDocumentsSearchInput.fill(keyword);
  }

  async sortEditDocumentsByMediaType() {
    await this.editDocumentsMediaTypeHeader.click();
  }

  async sortEditDocumentsByAttachment() {
    await this.editDocumentsAttachmentHeader.click();
  }

  async selectEditDocumentsShowEntries(value: '10' | '25' | '50' | '100') {
    await this.editDocumentsShowEntriesDropdown.selectOption(value);
  }

  async clickEditDocumentsExportCopy() {
    await this.editDocumentsExportCopyButton.click();
  }

  async clickEditDocumentsExportExcel() {
    await this.editDocumentsExportExcelButton.click();
  }

  async clickEditDocumentsExportCsv() {
    await this.editDocumentsExportCsvButton.click();
  }

  async clickEditDocumentsExportPdf() {
    await this.editDocumentsExportPdfButton.click();
  }

  async clickDetailsDocumentsExportCopy() {
    await this.detailsDocumentsExportCopyButton.click();
  }

  async clickDetailsDocumentsExportExcel() {
    await this.detailsDocumentsExportExcelButton.click();
  }

  async clickDetailsDocumentsExportCsv() {
    await this.detailsDocumentsExportCsvButton.click();
  }

  async selectDetailsDocumentsShowEntries(value: '10' | '25' | '50' | '100') {
    await this.detailsDocumentsShowEntriesDropdown.selectOption(value);
  }

  async searchDetailsDocuments(keyword: string) {
    await this.detailsDocumentsSearchInput.fill(keyword);
  }

  async expectDetailsDocumentRowForFile(fileName: string, values: {
    createdBy?: string | RegExp;
    category?: string | RegExp;
  }) {
    const row = this.detailsDocumentsRows.filter({ hasText: fileName }).first();
    await expect(row).toBeVisible();
    await expect(row).toContainText(fileName);
    if (values.createdBy) await expect(row).toContainText(values.createdBy);
    if (values.category) await expect(row).toContainText(values.category);
  }

  async openFirstEditDocumentAttachment() {
    await this.editFirstAttachmentLink.click();
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
}
