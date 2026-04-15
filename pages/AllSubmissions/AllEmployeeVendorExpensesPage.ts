import { expect, Locator, Page } from '@playwright/test';

export class AllEmployeeVendorExpensesPage {
  readonly page: Page;

  // History page
  readonly allEmployeeVendorExpensesMenuLink: Locator;
  readonly historyPageHeading: Locator;
  readonly historySearchInput: Locator;
  readonly historyShowEntriesDropdown: Locator;
  readonly historyExportCopyButton: Locator;
  readonly historyExportExcelButton: Locator;
  readonly historyExportCsvButton: Locator;
  readonly historyExportPdfButton: Locator;
  readonly vendorNameHeader: Locator;
  readonly amountHeader: Locator;
  readonly statusHeader: Locator;
  readonly lastUpdatedDateHeader: Locator;
  readonly actionHeader: Locator;
  readonly historyRows: Locator;
  readonly firstDetailsLink: Locator;
  readonly historyPrevPageLink: Locator;
  readonly historyNextPageLink: Locator;
  readonly historyPagingStatus: Locator;

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

  // Details page - All Documents section
  readonly detailsDocumentsSearchInput: Locator;
  readonly detailsDocumentsShowEntriesDropdown: Locator;
  readonly detailsDocumentsFileNameHeader: Locator;
  readonly detailsDocumentsAttachmentHeader: Locator;
  readonly detailsDocumentsCreatedByHeader: Locator;
  readonly detailsDocumentsExportCopyButton: Locator;
  readonly detailsDocumentsExportExcelButton: Locator;
  readonly detailsDocumentsExportCsvButton: Locator;
  readonly detailsDocumentsExportPdfButton: Locator;
  readonly detailsFirstAttachmentLink: Locator;
  readonly detailsDocumentsPagingStatus: Locator;

  // Add Attachments modal
  readonly addAttachmentsModal: Locator;
  readonly addAttachmentsCloseLink: Locator;
  readonly addAttachmentsFileInput: Locator;
  readonly addAttachmentsFileButton: Locator;
  readonly addAttachmentsSubmitButton: Locator;

  // Edit page
  readonly editPageHeading: Locator;
  readonly vendorExpenseSubmissionDateInput: Locator;
  readonly editAmountInput: Locator;
  readonly expenseDateInput: Locator;
  readonly expenseCategoryDropdown: Locator;
  readonly editVendorNameInput: Locator;
  readonly editSupportingDocumentsInput: Locator;
  readonly expenseDescriptionInput: Locator;
  readonly notesInput: Locator;
  readonly updateInformationButton: Locator;

  // Edit page - All Documents section
  readonly editDocumentsSearchInput: Locator;
  readonly editDocumentsShowEntriesDropdown: Locator;
  readonly editDocumentsIdHeader: Locator;
  readonly editDocumentsMediaTypeHeader: Locator;
  readonly editDocumentsAttachmentHeader: Locator;
  readonly editDocumentsRequestIdHeader: Locator;
  readonly editDocumentsCreatedOnHeader: Locator;
  readonly editDocumentsCreatedByHeader: Locator;
  readonly editDocumentsBelongsToHeader: Locator;
  readonly editDocumentsExportCopyButton: Locator;
  readonly editDocumentsExportExcelButton: Locator;
  readonly editDocumentsExportCsvButton: Locator;
  readonly editDocumentsExportPdfButton: Locator;
  readonly editFirstAttachmentLink: Locator;
  readonly editDocumentsNextPageLink: Locator;
  readonly editDocumentsPagingStatus: Locator;

  constructor(page: Page) {
    this.page = page;

    // History page
    this.allEmployeeVendorExpensesMenuLink = page.getByRole('link', { name: ' All Employee Vendor Expenses' });
    this.historyPageHeading = page.getByRole('heading', { name: 'History' });
    this.historySearchInput = page.getByRole('searchbox').first();
    this.historyShowEntriesDropdown = page.getByRole('combobox', { name: /Show/i }).first();
    this.historyExportCopyButton = page.locator('button').nth(0);
    this.historyExportExcelButton = page.locator('button').nth(1);
    this.historyExportCsvButton = page.locator('button').nth(2);
    this.historyExportPdfButton = page.locator('button').nth(3);
    this.vendorNameHeader = page.getByRole('columnheader', { name: /Vendor Name/i }).first();
    this.amountHeader = page.getByRole('columnheader', { name: /Amount/i }).first();
    this.statusHeader = page.getByRole('columnheader', { name: /Status/i }).first();
    this.lastUpdatedDateHeader = page.getByRole('columnheader', { name: /Last Updated Date/i }).first();
    this.actionHeader = page.getByRole('columnheader', { name: /Action/i }).first();
    this.historyRows = page.locator('tbody tr');
    this.firstDetailsLink = page.getByRole('link', { name: 'Details' }).first();
    this.historyPrevPageLink = page.getByRole('link', { name: 'Prev' }).first();
    this.historyNextPageLink = page.getByRole('link', { name: 'Next' }).first();
    this.historyPagingStatus = page.getByRole('status').first();

    // Details page
    this.detailsEditLink = page.getByRole('link', { name: /Edit/i });
    this.detailsAddAttachmentsButton = page.getByRole('button', { name: /Add Attachments/i });
    this.detailsStatusDropdown = page.getByRole('combobox', { name: /Status \*/i });
    this.detailsApprovedAmountInput = page.getByRole('textbox', { name: 'Enter Amount' });
    this.detailsSupportingDocumentsButton = page.getByRole('button', { name: 'Supporting Documents *' }).first();
    this.detailsAddRemarkInput = page.getByRole('textbox', { name: 'Add Remark' });
    this.detailsUpdateButton = page.getByRole('button', { name: 'Update' });
    this.detailsCommentsInput = page.locator('#comment');
    this.detailsAddCommentsButton = page.getByRole('button', { name: /Add Comments/i });
    this.detailsAllCommentsSection = page.getByText('All Comments');

    // Details page - All Documents section
    const detailsDocumentsSection = page.locator('div').filter({ hasText: 'All Documents' }).first();
    this.detailsDocumentsSearchInput = detailsDocumentsSection.getByRole('searchbox');
    this.detailsDocumentsShowEntriesDropdown = detailsDocumentsSection.getByRole('combobox', { name: /Show/i });
    this.detailsDocumentsFileNameHeader = page.getByRole('columnheader', { name: /File Name:/i }).first();
    this.detailsDocumentsAttachmentHeader = page.getByRole('columnheader', { name: /Attachment:/i }).first();
    this.detailsDocumentsCreatedByHeader = page.getByRole('columnheader', { name: /Created By:/i }).first();
    this.detailsDocumentsExportCopyButton = detailsDocumentsSection.locator('button').nth(0);
    this.detailsDocumentsExportExcelButton = detailsDocumentsSection.locator('button').nth(1);
    this.detailsDocumentsExportCsvButton = detailsDocumentsSection.locator('button').nth(2);
    this.detailsDocumentsExportPdfButton = detailsDocumentsSection.locator('button').nth(3);
    this.detailsFirstAttachmentLink = detailsDocumentsSection.locator('tbody tr').first().locator('a').first();
    this.detailsDocumentsPagingStatus = detailsDocumentsSection.getByRole('status');

    // Add Attachments modal
    this.addAttachmentsModal = page.getByRole('dialog').filter({
      has: page.getByRole('heading', { name: /Add Attachments/i })
    });
    this.addAttachmentsCloseLink = this.addAttachmentsModal.getByRole('link', { name: 'Close' });
    this.addAttachmentsFileInput = this.addAttachmentsModal.locator('input[type="file"]');
    this.addAttachmentsFileButton = this.addAttachmentsModal.getByRole('button', { name: 'Add Documents*' });
    this.addAttachmentsSubmitButton = this.addAttachmentsModal.getByRole('button', {
      name: 'Submit',
      exact: true
    });

    // Edit page
    this.editPageHeading = page.getByRole('heading', { name: /Expense Vendor Form/i });
    this.vendorExpenseSubmissionDateInput = page.getByRole('textbox', { name: 'Vendor Expense Submission Date*' });
    this.editAmountInput = page.getByRole('textbox', { name: 'Amount*' });
    this.expenseDateInput = page.getByRole('textbox', { name: 'Expense Date*' });
    this.expenseCategoryDropdown = page.getByLabel('Expense Category*');
    this.editVendorNameInput = page.getByRole('textbox', { name: 'Vendor Name*' });
    this.editSupportingDocumentsInput = page.locator('input[type="file"][name="SupportingMedia"]');
    this.expenseDescriptionInput = page.getByRole('textbox', { name: 'Expense Description*' });
    this.notesInput = page.getByRole('textbox', { name: 'Notes*' });
    this.updateInformationButton = page.getByRole('button', { name: 'Update Information' });

    // Edit page - All Documents section
    const editDocumentsSection = page.locator('div').filter({ hasText: 'All Documents' }).first();
    this.editDocumentsSearchInput = editDocumentsSection.getByRole('searchbox');
    this.editDocumentsShowEntriesDropdown = editDocumentsSection.getByRole('combobox', { name: /Show/i });
    this.editDocumentsIdHeader = page.getByRole('columnheader', { name: /ID:/i }).first();
    this.editDocumentsMediaTypeHeader = page.getByRole('columnheader', { name: /Media Type:/i }).first();
    this.editDocumentsAttachmentHeader = page.getByRole('columnheader', { name: /Attachment:/i }).first();
    this.editDocumentsRequestIdHeader = page.getByRole('columnheader', { name: /Request ID:/i }).first();
    this.editDocumentsCreatedOnHeader = page.getByRole('columnheader', { name: /Created On:/i }).first();
    this.editDocumentsCreatedByHeader = page.getByRole('columnheader', { name: /Created By:/i }).first();
    this.editDocumentsBelongsToHeader = page.getByRole('columnheader', { name: /Belongs To:/i }).first();
    this.editDocumentsExportCopyButton = editDocumentsSection.locator('button').nth(0);
    this.editDocumentsExportExcelButton = editDocumentsSection.locator('button').nth(1);
    this.editDocumentsExportCsvButton = editDocumentsSection.locator('button').nth(2);
    this.editDocumentsExportPdfButton = editDocumentsSection.locator('button').nth(3);
    this.editFirstAttachmentLink = editDocumentsSection.locator('tbody tr').first().locator('a').first();
    this.editDocumentsNextPageLink = editDocumentsSection.getByRole('link', { name: 'Next' });
    this.editDocumentsPagingStatus = editDocumentsSection.getByRole('status');
  }

  async openAllEmployeeVendorExpensesPage() {
    await expect(this.allEmployeeVendorExpensesMenuLink).toBeVisible();
    await this.allEmployeeVendorExpensesMenuLink.click();
    await expect(this.page).toHaveURL(/\/AllForms\/GetAllVendorExpense/i);
    await expect(this.historyPageHeading).toBeVisible();
  }

  async searchHistory(keyword: string) {
    await this.historySearchInput.fill(keyword);
  }

  async selectHistoryShowEntries(value: '10' | '25' | '50' | '100') {
    await this.historyShowEntriesDropdown.selectOption(value);
  }

  async sortHistoryByVendorName() {
    await this.vendorNameHeader.click();
  }

  async sortHistoryByAmount() {
    await this.amountHeader.click();
  }

  async sortHistoryByStatus() {
    await this.statusHeader.click();
  }

  async sortHistoryByLastUpdatedDate() {
    await this.lastUpdatedDateHeader.click();
  }

  async goToHistoryNextPage() {
    await this.historyNextPageLink.click();
  }

  async goToHistoryPreviousPage() {
    await this.historyPrevPageLink.click();
  }

  async openFirstHistoryDetails() {
    await this.firstDetailsLink.click();
    await expect(this.page).toHaveURL(/\/AllForms\/VendorExpenseDetails\?ID=/i);
  }

  historyMainRowByRecordId(recordId: string): Locator {
    return this.page.locator('tbody tr:not(.child)', { hasText: recordId }).first();
  }

  async openHistoryDetailsForRow(mainRow: Locator) {
    await mainRow.getByRole('link', { name: 'Details' }).click();
    await expect(this.page).toHaveURL(/\/AllForms\/VendorExpenseDetails\?ID=/i);
  }

  async uploadDetailsSupportingDocument(filePath: string) {
    await this.detailsSupportingDocumentsButton.setInputFiles(filePath);
  }

  async fillRemarksToSubmitter(remarks: string) {
    await this.enterDetailsRemark(remarks);
  }

  async fillComment(comment: string) {
    await this.addDetailsComment(comment);
  }

  async clickUpdate() {
    await this.clickDetailsUpdate();
  }

  async openAddAttachmentsModal() {
    await expect(this.detailsAddAttachmentsButton).toBeVisible();
    await this.detailsAddAttachmentsButton.click();
    await expect(this.addAttachmentsModal).toBeVisible();
  }

  async uploadFileInAddAttachmentsModal(filePath: string) {
    await this.addAttachmentsFileInput.setInputFiles(filePath);
  }

  async submitAddAttachmentsModal() {
    await this.addAttachmentsSubmitButton.click();
  }

  async closeAddAttachmentsModal() {
    await this.addAttachmentsCloseLink.click();
    await expect(this.addAttachmentsModal).not.toBeVisible();
  }

  async openEditFromDetails() {
    await this.detailsEditLink.click();
    await expect(this.page).toHaveURL(/\/AllForms\/EditVendorExpenseDetails\//i);
    await expect(this.editPageHeading).toBeVisible();
  }

  async selectDetailsStatus(status: string) {
    await this.detailsStatusDropdown.selectOption({ label: status });
  }

  async enterDetailsApprovedAmount(amount: string) {
    await this.detailsApprovedAmountInput.fill(amount);
  }

  async enterDetailsRemark(remark: string) {
    await this.detailsAddRemarkInput.fill(remark);
  }

  async clickDetailsUpdate() {
    await this.detailsUpdateButton.click();
  }

  async addDetailsComment(comment: string) {
    await this.detailsCommentsInput.fill(comment);
    await this.detailsAddCommentsButton.click();
  }

  async updateVendorExpenseForm(data: {
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
    await this.expenseDescriptionInput.fill(data.description);
    await this.notesInput.fill(data.notes);
  }

  async clickUpdateInformation() {
    await this.updateInformationButton.click();
  }

  async searchDetailsDocuments(keyword: string) {
    await this.detailsDocumentsSearchInput.fill(keyword);
  }

  async selectDetailsDocumentsShowEntries(value: '10' | '25' | '50' | '100') {
    await this.detailsDocumentsShowEntriesDropdown.selectOption(value);
  }

  async openFirstDetailsDocumentAttachment() {
    await this.detailsFirstAttachmentLink.click();
  }

  async searchEditDocuments(keyword: string) {
    await this.editDocumentsSearchInput.fill(keyword);
  }

  async sortEditDocumentsById() {
    await this.editDocumentsIdHeader.click();
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

  async openFirstEditDocumentAttachment() {
    await this.editFirstAttachmentLink.click();
  }

  async expectHistoryRowsVisible() {
    await expect(this.historyRows.first()).toBeVisible();
  }

  async expectHistoryPagingStatusContains(value: string) {
    await expect(this.historyPagingStatus).toContainText(value);
  }

  async expectDetailsCommentsSectionVisible() {
    await expect(this.detailsAllCommentsSection).toBeVisible();
  }

  async expectDetailsDocumentsPagingStatusContains(value: string) {
    await expect(this.detailsDocumentsPagingStatus).toContainText(value);
  }

  async expectEditDocumentsPagingStatusContains(value: string) {
    await expect(this.editDocumentsPagingStatus).toContainText(value);
  }
}
