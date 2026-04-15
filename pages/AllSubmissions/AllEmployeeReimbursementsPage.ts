import { expect, Locator, Page } from '@playwright/test';

export class AllEmployeeReimbursementsPage {
  readonly page: Page;

  // History page
  readonly allEmployeeReimbursementsMenuLink: Locator;
  readonly historyPageHeading: Locator;
  readonly historySearchInput: Locator;
  readonly statusFilterDropdown: Locator;
  readonly lvExportButton: Locator;
  readonly idHeader: Locator;
  readonly vendorNameHeader: Locator;
  readonly amountHeader: Locator;
  readonly submittedDateHeader: Locator;
  readonly statusHeader: Locator;
  readonly submittedByHeader: Locator;
  readonly lastUpdatedDateHeader: Locator;
  readonly actionHeader: Locator;
  readonly historyRows: Locator;
  readonly firstDetailsLink: Locator;

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
  readonly detailsDocumentsCategoryHeader: Locator;
  readonly detailsDocumentsExportCopyButton: Locator;
  readonly detailsDocumentsExportExcelButton: Locator;
  readonly detailsDocumentsExportCsvButton: Locator;
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
  readonly expenseSubmissionDateInput: Locator;
  readonly editAmountInput: Locator;
  readonly expenseDateInput: Locator;
  readonly expenseCategoryDropdown: Locator;
  readonly editVendorNameInput: Locator;
  readonly editSupportingDocumentsInput: Locator;
  readonly expenseDescriptionInput: Locator;
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
    this.allEmployeeReimbursementsMenuLink = page.getByRole('link', { name: ' All Employee Reimbursements' });
    this.historyPageHeading = page.getByRole('heading', { name: /History/i });
    this.historySearchInput = page.getByRole('textbox', { name: 'Search records...' });
    this.statusFilterDropdown = page.locator('select').first();
    this.lvExportButton = page.getByRole('button', { name: 'Export' }).first();
    this.idHeader = page.getByRole('columnheader', { name: 'ID' });
    this.vendorNameHeader = page.getByRole('columnheader', { name: 'Vendor Name' });
    this.amountHeader = page.getByRole('columnheader', { name: 'Amount' });
    this.submittedDateHeader = page.getByRole('columnheader', { name: 'Submitted Date' });
    this.statusHeader = page.getByRole('columnheader', { name: 'Status' });
    this.submittedByHeader = page.getByRole('columnheader', { name: 'Submitted By' });
    this.lastUpdatedDateHeader = page.getByRole('columnheader', { name: 'Last Updated Date' });
    this.actionHeader = page.getByRole('columnheader', { name: 'Action' });
    this.historyRows = page.locator('table tbody tr');
    this.firstDetailsLink = page.getByRole('link', { name: 'Details' }).first();

    // Details page
    this.detailsEditLink = page.getByRole('link', { name: /Edit/i });
    this.detailsAddAttachmentsButton = page.getByRole('button', { name: /Add Attachments/i });
    this.detailsStatusDropdown = page.getByRole('combobox', { name: /Status \*/i });
    this.detailsApprovedAmountInput = page.getByRole('textbox', { name: 'Approved Amount *' });
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
    this.detailsDocumentsCategoryHeader = page.getByRole('columnheader', { name: /Category:/i }).first();
    this.detailsDocumentsExportCopyButton = detailsDocumentsSection.locator('button').nth(0);
    this.detailsDocumentsExportExcelButton = detailsDocumentsSection.locator('button').nth(1);
    this.detailsDocumentsExportCsvButton = detailsDocumentsSection.locator('button').nth(2);
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
    this.editPageHeading = page.getByRole('heading', { name: /Expense Form/i });
    this.expenseSubmissionDateInput = page.getByRole('textbox', { name: 'Expense Submission Date*' });
    this.editAmountInput = page.getByRole('textbox', { name: 'Amount*' });
    this.expenseDateInput = page.getByRole('textbox', { name: 'Expense Date*' });
    this.expenseCategoryDropdown = page.getByRole('combobox', { name: 'Expense Category*' });
    this.editVendorNameInput = page.getByRole('textbox', { name: 'Vendor Name*' });
    this.editSupportingDocumentsInput = page.locator('input[type="file"][name="SupportingMedia"]');
    this.expenseDescriptionInput = page.locator('textarea').first();
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

  async openAllEmployeeReimbursementsPage() {
    await expect(this.allEmployeeReimbursementsMenuLink).toBeVisible();
    await this.allEmployeeReimbursementsMenuLink.click();
    await expect(this.page).toHaveURL(/\/ActionCenter\/AllSubmissionExpenseForms/i);
    await expect(this.historyPageHeading).toBeVisible();
  }

  async searchHistory(keyword: string) {
    await this.historySearchInput.fill(keyword);
  }

  async selectStatusFilter(
    status: 'All' | 'Paid' | 'Approved' | 'Approved-Amended' | 'Submitted' | 'Denied' | 'Pending'
  ) {
    await this.statusFilterDropdown.selectOption({ label: status });
  }

  async clickLvExport() {
    await this.lvExportButton.click();
  }

  async openFirstHistoryDetails() {
    await this.firstDetailsLink.click();
    await expect(this.page).toHaveURL(/\/ActionCenter\/ExpenseactionCenter\?ID=/i);
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
    await expect(this.page).toHaveURL(/\/AllForms\/EditExpenseForm\//i);
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

  async updateExpenseForm(data: {
    amount: string;
    expenseDate: string;
    expenseCategoryValue: string;
    vendorName: string;
    description: string;
  }) {
    await this.editAmountInput.fill(data.amount);
    await this.expenseDateInput.fill(data.expenseDate);
    await this.expenseCategoryDropdown.selectOption(data.expenseCategoryValue);
    await this.editVendorNameInput.fill(data.vendorName);
    await this.expenseDescriptionInput.fill(data.description);
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
