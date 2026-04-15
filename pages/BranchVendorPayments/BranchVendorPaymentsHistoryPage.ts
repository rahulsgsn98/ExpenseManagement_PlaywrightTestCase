import { expect, Locator, Page } from '@playwright/test';

export class BranchVendorPaymentsHistoryPage {
  readonly page: Page;

  // History page
  readonly branchVendorPaymentsHistoryMenuLink: Locator;
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
  readonly updateVendorExpenseSuccessMessage: Locator;
  readonly detailsCostCenterLabel: Locator;
  readonly detailsFullNameLabel: Locator;
  readonly detailsExpenseCategoryLabel: Locator;
  readonly detailsAmountLabel: Locator;
  readonly detailsApprovedAmountLabel: Locator;
  readonly detailsSubmissionDateLabel: Locator;
  readonly detailsSubmittedByLabel: Locator;
  readonly detailsAccruedOrIncurredDateLabel: Locator;
  readonly detailsBody: Locator;

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
    this.branchVendorPaymentsHistoryMenuLink = page.getByRole('link', { name: ' History' }).nth(2);
    this.historyPageHeading = page.getByRole('heading', { name: 'History' });
    this.historySearchInput = page.getByRole('searchbox').first();
    this.historyShowEntriesDropdown = page.getByRole('combobox', { name: /Show/i }).first();
    this.historyExportCopyButton = page.locator('button').nth(0);
    this.historyExportExcelButton = page.locator('button').nth(1);
    this.historyExportCsvButton = page.locator('button').nth(2);
    this.historyExportPdfButton = page.locator('button').nth(3);
    this.vendorNameHeader = page.getByRole('columnheader', { name: /Vendor Name:/i }).first();
    this.amountHeader = page.getByRole('columnheader', { name: /Amount:/i }).first();
    this.statusHeader = page.getByRole('columnheader', { name: /Status:/i }).first();
    this.lastUpdatedDateHeader = page.getByRole('columnheader', { name: /Last Updated Date:/i }).first();
    this.actionHeader = page.getByRole('columnheader', { name: /Action:/i }).first();
    this.historyRows = page.locator('tbody tr');
    this.firstDetailsLink = page.getByRole('link', { name: 'Details' }).first();
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
    this.detailsAddRemarkInput = page.getByRole('textbox', { name: 'Add Remark' });
    this.detailsUpdateButton = page.getByRole('button', { name: 'Update' });
    this.detailsCommentsInput = page.locator('#comment');
    this.detailsAddCommentsButton = page.getByRole('button', { name: /Add Comments/i });
    this.detailsAllCommentsSection = page.getByText('All Comments');
    this.updateVendorExpenseSuccessMessage = page
      .getByText(/Form Edited successfully|Updated successfully|successfully/i)
      .first();
    this.detailsCostCenterLabel = page.getByText('Cost Center', { exact: true }).first();
    this.detailsFullNameLabel = page.getByText('Full Name', { exact: true }).first();
    this.detailsExpenseCategoryLabel = page.getByText('Expense Category', { exact: true }).first();
    this.detailsAmountLabel = page.getByText('Amount', { exact: true }).first();
    this.detailsApprovedAmountLabel = page.getByText('Approved Amount', { exact: true }).first();
    this.detailsSubmissionDateLabel = page.getByText('Submission Date', { exact: true }).first();
    this.detailsSubmittedByLabel = page.getByText('Submitted By', { exact: true }).first();
    this.detailsAccruedOrIncurredDateLabel = page.getByText(/Accrued Date|Incurred Date/i).first();
    this.detailsBody = page.locator('body');

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
    this.addAttachmentsModal = page.getByRole('dialog').filter({ has: page.getByRole('heading', { name: /Add Attachments/i }) });
    this.addAttachmentsCloseLink = this.addAttachmentsModal.getByRole('link', { name: 'Close' });
    this.addAttachmentsFileInput = this.addAttachmentsModal.locator('input[type="file"]');
    this.addAttachmentsFileButton = this.addAttachmentsModal.getByRole('button', { name: 'Add Documents*' });
    this.addAttachmentsSubmitButton = this.addAttachmentsModal.getByRole('button', { name: 'Submit', exact: true });

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

  async openBranchVendorPaymentsHistoryPage() {
    await this.page.goto('/AllForms/GetMyVendorExpense');
    await expect(this.page).toHaveURL(/\/AllForms\/GetMyVendorExpense/i);
    await expect(this.historyPageHeading).toBeVisible();
  }

  async searchHistory(keyword: string) {
    await this.historySearchInput.fill(keyword);
  }

  /** DataTables / app copy varies; accept common empty-table strings. */
  async expectHistorySearchEmptyStateVisible() {
    await expect(
      this.page.getByText(/No data available in table|No matching records found/i)
    ).toBeVisible();
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

  historyMainRow(vendorName: string, amountDisplay: string): Locator {
    return this.historyRows.filter({ hasText: vendorName }).filter({ hasText: amountDisplay }).first();
  }

  historyMainRowByRecordId(recordId: string): Locator {
    return this.page.locator('tbody tr:not(.child)', { hasText: recordId }).first();
  }

  historyRowByDetailsId(detailsId: string): Locator {
    return this.historyRows.filter({
      has: this.page.locator(`a.doc-link[href*="VendorExpenseDetails?ID=${detailsId}"]`)
    }).first();
  }

  async getHistoryRecordIdFromRow(mainRow: Locator): Promise<string> {
    return (await mainRow.locator('td').first().innerText()).trim();
  }

  async getDetailsIdFromRow(mainRow: Locator): Promise<string> {
    const href =
      (await mainRow
        .locator('a.doc-link[href*="VendorExpenseDetails?ID="]')
        .first()
        .getAttribute('href')) ?? '';
    const match = href.match(/[?&]ID=(\d+)/i);
    if (!match?.[1]) {
      throw new Error(`Could not parse details ID from href: "${href}"`);
    }
    return match[1];
  }

  async openHistoryDetailsForRow(mainRow: Locator) {
    await mainRow.getByRole('link', { name: 'Details' }).click();
    await expect(this.page).toHaveURL(/\/AllForms\/VendorExpenseDetails\?ID=/i);
  }

  /**
   * Paginate the History DataTable until a row matching vendor + amount is visible.
   * Use when many rows share the same vendor (e.g. after a text search).
   */
  async waitForHistoryMainRowVisible(
    vendorName: string,
    amountDisplay: string,
    searchKeyword?: string
  ) {
    await expect
      .poll(
        async () => {
          await this.openBranchVendorPaymentsHistoryPage();
          if (searchKeyword !== undefined) {
            await this.searchHistory(searchKeyword);
          }

          const nextIsDisabled = async () => {
            const cls = (await this.historyNextPageLink.locator('..').getAttribute('class')) ?? '';
            return cls.includes('disabled');
          };

          let safety = 0;
          while (safety < 100) {
            const row = this.historyMainRow(vendorName, amountDisplay);
            if (await row.isVisible()) {
              return true;
            }
            if (await nextIsDisabled()) {
              break;
            }
            await this.goToHistoryNextPage();
            safety++;
          }
          return false;
        },
        { timeout: 60_000, intervals: [1000, 2000, 3000, 5000] }
      )
      .toBe(true);
  }

  async waitForHistoryRowByDetailsIdVisible(detailsId: string, searchKeyword?: string) {
    await expect
      .poll(
        async () => {
          await this.openBranchVendorPaymentsHistoryPage();
          if (searchKeyword) {
            await this.searchHistory(searchKeyword);
          }

          const nextIsDisabled = async () => {
            const cls = (await this.historyNextPageLink.locator('..').getAttribute('class')) ?? '';
            return cls.includes('disabled');
          };

          let safety = 0;
          while (safety < 100) {
            const row = this.historyRowByDetailsId(detailsId);
            if (await row.isVisible()) {
              return true;
            }
            if (await nextIsDisabled()) {
              break;
            }
            await this.goToHistoryNextPage();
            safety++;
          }
          return false;
        },
        { timeout: 60_000, intervals: [1000, 2000, 3000, 5000] }
      )
      .toBe(true);
  }

  async waitForHistoryStatusByDetailsId(detailsId: string, expectedStatus: string, searchKeyword?: string) {
    await expect
      .poll(
        async () => {
          await this.openBranchVendorPaymentsHistoryPage();
          if (searchKeyword) {
            await this.searchHistory(searchKeyword);
          }

          const nextIsDisabled = async () => {
            const cls = (await this.historyNextPageLink.locator('..').getAttribute('class')) ?? '';
            return cls.includes('disabled');
          };

          let safety = 0;
          while (safety < 100) {
            const row = this.historyRowByDetailsId(detailsId);
            if (await row.isVisible()) {
              return (await row.innerText()).replace(/\s+/g, ' ');
            }
            if (await nextIsDisabled()) {
              break;
            }
            await this.goToHistoryNextPage();
            safety++;
          }
          return '';
        },
        { timeout: 60_000, intervals: [1000, 2000, 3000, 5000] }
      )
      .toContain(expectedStatus);
  }

  async waitForHistoryStatusByRecordId(recordId: string, expectedStatus: string) {
    await expect
      .poll(
        async () => {
          await this.openBranchVendorPaymentsHistoryPage();
          await this.searchHistory(recordId);
          const row = this.historyMainRowByRecordId(recordId);
          if (!(await row.isVisible())) {
            return '';
          }
          return (await row.innerText()).replace(/\s+/g, ' ');
        },
        { timeout: 60_000, intervals: [1000, 2000, 3000, 5000] }
      )
      .toContain(expectedStatus);
  }

  async expectHistoryDetailsLinkVisibleForRow(mainRow: Locator) {
    await expect(mainRow.getByRole('link', { name: 'Details' })).toBeVisible();
  }

  async expectVendorExpenseDetailsUrlHasId() {
    await expect(this.page).toHaveURL(/\/AllForms\/VendorExpenseDetails\?ID=\d+/i);
  }

  async expectVendorExpenseDetailsKeyFieldsVisible() {
    await this.expectVendorExpenseDetailsUrlHasId();
    await expect(this.detailsCostCenterLabel).toBeVisible();
    await expect(this.detailsFullNameLabel).toBeVisible();
    await expect(this.detailsExpenseCategoryLabel).toBeVisible();
    await expect(this.detailsAmountLabel).toBeVisible();
    await expect(this.detailsApprovedAmountLabel).toBeVisible();
    await expect(this.detailsSubmissionDateLabel).toBeVisible();
    await expect(this.detailsSubmittedByLabel).toBeVisible();
    await expect(this.detailsAccruedOrIncurredDateLabel).toBeVisible();
  }

  async expectDetailsBodyContains(value: string | RegExp) {
    await expect(this.detailsBody).toContainText(value);
  }

  async expectDetailsReadOnlyForBranchManager() {
    await expect(this.page.getByText(/Internal Finance Team/i)).not.toBeVisible();
    await expect(this.detailsStatusDropdown).not.toBeVisible();
    await expect(this.detailsUpdateButton).not.toBeVisible();
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

  async selectDetailsStatus(
    status: 'Approved' | 'Approved-Amended' | 'Denied' | 'Paid' | 'Pending'
  ) {
    await expect(this.detailsStatusDropdown).toBeVisible();
    await this.detailsStatusDropdown.selectOption({ value: status });

    await expect(async () => {
      await this.detailsStatusDropdown.focus();
      await this.page.waitForTimeout(300);
      await this.detailsStatusDropdown.selectOption({ value: status });
      await this.detailsStatusDropdown.dispatchEvent('change');
      await this.detailsStatusDropdown.blur();
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

  async fillRemarksToSubmitter(remarks: string) {
    await this.detailsAddRemarkInput.fill(remarks);
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

  async expectUpdateVendorExpenseSuccessMessageVisible() {
    await expect(this.updateVendorExpenseSuccessMessage).toBeVisible({ timeout: 60_000 });
  }

  async expectVendorExpenseUpdateSuccessful() {
    await expect
      .poll(
        async () => {
          const successVisible = await this.updateVendorExpenseSuccessMessage
            .isVisible()
            .catch(() => false);
          const onHistoryPage = /\/AllForms\/GetMyVendorExpense/i.test(this.page.url());
          return successVisible || onHistoryPage;
        },
        { timeout: 60_000, intervals: [1000, 2000, 3000, 5000] }
      )
      .toBe(true);
  }

  async enterDetailsApprovedAmount(amount: string) {
    await expect(this.detailsApprovedAmountInput).toBeVisible({ timeout: 30_000 });
    await this.detailsApprovedAmountInput.fill(amount);
  }

  async fillDetailsApprovedAmount(amount: string) {
    
    await this.enterDetailsApprovedAmount(amount);
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

  async waitForSubmittedVendorRowVisible(vendorName: string, amountDisplay?: string) {
    await expect
      .poll(
        async () => {
          await this.openBranchVendorPaymentsHistoryPage();
          await this.searchHistory(vendorName);

          const nextIsDisabled = async () => {
            const cls = (await this.historyNextPageLink.locator('..').getAttribute('class')) ?? '';
            return cls.includes('disabled');
          };

          let safety = 0;
          while (!(await nextIsDisabled()) && safety < 100) {
            await this.goToHistoryNextPage();
            safety++;
          }

          const lastVendorRow = this.historyRows.filter({ hasText: vendorName }).last();
          if (!(await lastVendorRow.isVisible())) {
            return false;
          }

          const rowText = (await lastVendorRow.innerText()).replace(/\s+/g, ' ');
          const hasAmount = amountDisplay ? rowText.includes(amountDisplay) : true;
          return rowText.includes(vendorName) && rowText.includes('Submitted') && hasAmount;
        },
        { timeout: 60_000, intervals: [1000, 2000, 3000, 5000] }
      )
      .toBe(true);
  }
}
