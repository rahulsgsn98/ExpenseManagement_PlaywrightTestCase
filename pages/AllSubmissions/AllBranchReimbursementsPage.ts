import { expect, Locator, Page } from '@playwright/test';
// import { ensureSidebarLinkVisible } from '../../utils/ensureSidebarLinkVisible';

export class AllBranchReimbursementsPage {
  readonly page: Page;

  // History page
  readonly allBranchReimbursementsMenuLink: Locator;
  readonly historyPageHeading: Locator;
  readonly statusFilterDropdown: Locator;
  readonly lvExportButton: Locator;
  readonly historySearchInput: Locator;
  readonly historyShowEntriesDropdown: Locator;
  readonly historyExportCopyButton: Locator;
  readonly historyExportExcelButton: Locator;
  readonly historyExportCsvButton: Locator;
  readonly branchExpenseIdHeader: Locator;
  readonly vendorNameHeader: Locator;
  readonly amountHeader: Locator;
  readonly statusHeader: Locator;
  readonly submittedByHeader: Locator;
  readonly lastUpdatedDateHeader: Locator;
  readonly firstBranchExpenseIdCell: Locator;
  readonly firstExpandedDetailsLink: Locator;
  readonly historyRows: Locator;
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
    this.allBranchReimbursementsMenuLink = page.getByRole('link', { name: ' All Branch Reimbursements' });
    this.historyPageHeading = page.getByRole('heading', { name: 'History' });
    /** Status filter (All / Paid / …); must not use `select.first()` — role `#RolesDropdown` is also a `<select>` and is often hidden in DOM order first. */
    this.statusFilterDropdown = page.locator('select').filter({ has: page.getByRole('option', { name: 'Submitted' }) }).first();
    this.lvExportButton = page.getByRole('button', { name: 'Export' }).first();
    this.historySearchInput = page.getByRole('searchbox').first();
    this.historyShowEntriesDropdown = page.getByRole('combobox', { name: /Show/i }).first();
    this.historyExportCopyButton = page.locator('button').nth(1);
    this.historyExportExcelButton = page.locator('button').nth(2);
    this.historyExportCsvButton = page.locator('button').nth(3);
    this.branchExpenseIdHeader = page.getByRole('columnheader', { name: /Branch Expense ID/i }).first();
    this.vendorNameHeader = page.getByRole('columnheader', { name: /Vendor Name/i }).first();
    this.amountHeader = page.getByRole('columnheader', { name: /Amount/i }).first();
    this.statusHeader = page.getByRole('columnheader', { name: /Status/i }).first();
    this.submittedByHeader = page.getByRole('columnheader', { name: /Submitted By/i }).first();
    this.lastUpdatedDateHeader = page.getByRole('columnheader', { name: /Last Updated Date/i }).first();
    this.firstBranchExpenseIdCell = page.locator('tbody tr').first().locator('td').first();
    this.firstExpandedDetailsLink = page.getByRole('link', { name: 'Details' }).first();
    this.historyRows = page.locator('tbody tr');
    this.historyPrevPageLink = page.getByRole('link', { name: 'Prev' }).first();
    this.historyNextPageLink = page.getByRole('link', { name: 'Next' }).first();
    this.historyPagingStatus = page.getByRole('status').first();

    // Details page
    this.detailsEditLink = page.getByRole('link', { name: /Edit/i });
    this.detailsAddAttachmentsButton = page.getByRole('button', { name: /Add Attachments/i });
    const internalFinanceSection = page
      .locator('div')
      .filter({ has: page.getByText('Internal Finance Team') })
      .first();
    this.detailsStatusDropdown = page.getByRole('combobox', { name: /Status \*/i });
    this.detailsApprovedAmountInput = internalFinanceSection
      .getByRole('textbox', { name: /Approved Amount \*/i })
      .or(page.getByRole('textbox', { name: 'Enter Amount' }));
    this.detailsSupportingDocumentsButton = page.getByRole('button', { name: 'Supporting Documents *' }).first();
    this.detailsAddRemarkInput = internalFinanceSection
      .getByRole('textbox', { name: /Add Remark|Remarks to Submitter/i });
    this.detailsUpdateButton = internalFinanceSection.getByRole('button', { name: 'Update' });
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
    this.addAttachmentsModal = page.getByRole('dialog').filter({ has: page.getByRole('heading', { name: /Add Attachments/i }) });
    this.addAttachmentsCloseLink = this.addAttachmentsModal.getByRole('link', { name: 'Close' });
    this.addAttachmentsFileInput = this.addAttachmentsModal.locator('input[type="file"]');
    this.addAttachmentsFileButton = this.addAttachmentsModal.getByRole('button', { name: 'Add Documents*' });
    this.addAttachmentsSubmitButton = this.addAttachmentsModal.getByRole('button', { name: 'Submit', exact: true });

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

  async openAllBranchReimbursementsPage() {
    // await ensureSidebarLinkVisible(this.page, this.allBranchReimbursementsMenuLink);
    await expect(this.allBranchReimbursementsMenuLink).toBeVisible();
    try {
      await this.allBranchReimbursementsMenuLink.scrollIntoViewIfNeeded();
      await this.allBranchReimbursementsMenuLink.click({ timeout: 5000 });
    } catch {
      await this.page.goto('/ActionCenter/AllSubmmissionCostExpense', { waitUntil: 'domcontentloaded' });
    }
    await expect(this.page).toHaveURL(/\/ActionCenter\/AllSubmmissionCostExpense/i);
    await expect(this.historyPageHeading).toBeVisible();
  }

  /** Same destination as {@link openAllBranchReimbursementsPage}; use when the sidebar link is not scrollable (e.g. profile menu open). */
  async gotoAllBranchReimbursementsList() {
    await this.page.goto('/ActionCenter/AllSubmmissionCostExpense', { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveURL(/\/ActionCenter\/AllSubmmissionCostExpense/i);
    await expect(this.historyPageHeading).toBeVisible();
  }

  async selectStatusFilter(status: 'All' | 'Paid' | 'Approved' | 'Approved-Amended' | 'Submitted' | 'Denied' | 'Pending') {
    await this.statusFilterDropdown.selectOption({ label: status });
  }

  async clickLvExport() {
    await this.lvExportButton.click();
  }

  async searchHistory(keyword: string) {
    await this.historySearchInput.fill(keyword);
  }

  async selectHistoryShowEntries(value: '10' | '25' | '50' | '100') {
    await this.historyShowEntriesDropdown.selectOption(value);
  }

  async sortHistoryByBranchExpenseId() {
    await this.branchExpenseIdHeader.click();
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

  async sortHistoryBySubmittedBy() {
    await this.submittedByHeader.click();
  }

  async expandFirstHistoryRow() {
    await this.firstBranchExpenseIdCell.click();
  }

  async openFirstExpandedDetails() {
    await this.firstExpandedDetailsLink.click();
    await expect(this.page).toHaveURL(/\/ActionCenter\/CostactionCenter\?ID=/i);
  }

  /** Main grid row (excludes DataTables `tr.child` rows). */
  historyMainDataRow(vendorName: string, amountDisplay: string): Locator {
    return this.page
      .locator('tbody tr:not(.child)')
      .filter({ hasText: vendorName })
      .filter({ hasText: amountDisplay })
      .first();
  }

  historyRowByBranchExpenseId(branchExpenseId: string): Locator {
    return this.page.locator('tbody tr:not(.child)', { hasText: branchExpenseId }).first();
  }

  async openHistoryDetailsForMainRow(mainRow: Locator) {
    await mainRow.locator('td').first().click();
    await this.page.getByRole('link', { name: 'Details' }).first().click();
    await expect(this.page).toHaveURL(/\/ActionCenter\/CostactionCenter\?ID=/i);
  }

  async goToHistoryNextPage() {
    await this.historyNextPageLink.click();
  }

  async goToHistoryPreviousPage() {
    await this.historyPrevPageLink.click();
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
    await expect(this.page).toHaveURL(/\/AllForms\/EditCostExpenseForm\//i);
    await expect(this.editPageHeading).toBeVisible();
  }

  async selectDetailsStatus(status: 'Approved' | 'Approved-Amended' | 'Denied' | 'Paid' | 'Pending') {
    await expect(this.detailsStatusDropdown).toBeVisible();
    await this.detailsStatusDropdown.selectOption({ value: status });
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
    await expect(this.detailsApprovedAmountInput).toBeVisible({ timeout: 30_000 });
    await this.detailsApprovedAmountInput.fill(amount);
  }

  async enterDetailsRemark(remark: string) {
    await this.detailsAddRemarkInput.fill(remark);
  }

  async fillRemarksToSubmitter(remarks: string) {
    await this.enterDetailsRemark(remarks);
  }

  async fillComment(comment: string) {
    await this.detailsCommentsInput.fill(comment);
  }

  async uploadDetailsSupportingDocument(filePath: string) {
    await this.detailsSupportingDocumentsButton.setInputFiles(filePath);
  }

  async clickDetailsUpdate() {
    await this.detailsUpdateButton.click();
  }

  async clickUpdate() {
    await this.clickDetailsUpdate();
  }

  async addDetailsComment(comment: string) {
    await this.detailsCommentsInput.fill(comment);
    await this.detailsAddCommentsButton.click();
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

  async expectBranchExpenseDetailsCoreFieldsVisible() {
    await expect(this.page.getByText('Vendor Name', { exact: true }).first()).toBeVisible();
    await expect(this.page.getByText('Expense Category', { exact: true }).first()).toBeVisible();
    await expect(this.page.getByText('Amount', { exact: true }).first()).toBeVisible();
    await expect(this.page.getByText('Approved Amount', { exact: true }).first()).toBeVisible();
    await expect(this.page.getByText(/Accrued Date|Incurred Date/i).first()).toBeVisible();
    await expect(this.page.getByText('Submission Date', { exact: true }).first()).toBeVisible();
    await expect(this.page.getByText('Submitted By', { exact: true }).first()).toBeVisible();
    await expect(this.page.getByText('Remarks', { exact: true }).first()).toBeVisible();
  }

  async expectInternalFinanceSectionNotVisible() {
    await expect(this.page.getByText('Internal Finance Team')).not.toBeVisible();
  }

  async expectDetailsDocumentsPagingStatusContains(value: string) {
    await expect(this.detailsDocumentsPagingStatus).toContainText(value);
  }

  async expectEditDocumentsPagingStatusContains(value: string) {
    await expect(this.editDocumentsPagingStatus).toContainText(value);
  }
}
