import { expect, Locator, Page } from '@playwright/test';
import { resolveBranchNewSubmissionCostCenterId } from '../../utils/branchCostCenters';

export class NewSubmissionPage {
  readonly page: Page;

  readonly newSubmissionMenuLink: Locator;
  readonly pageHeading: Locator;
  readonly amountInput: Locator;
  readonly expenseCategoryDropdown: Locator;
  readonly incurredDateInput: Locator;
  readonly costCenterDropdown: Locator;
  readonly vendorNameInput: Locator;
  readonly supportingDocumentsInput: Locator;
  readonly supportingDocumentsButton: Locator;
  readonly descriptionInput: Locator;
  readonly submitButton: Locator;
  readonly submitAndAddNewButton: Locator;
  readonly amountExceedsLimitError: Locator;
  readonly submissionSuccessToast: Locator;
  readonly uploadedFilePill: Locator;
  readonly uploadedFileName: Locator;
  readonly uploadedFileRemoveButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.newSubmissionMenuLink = page.getByRole('link', { name: ' New Submission' }).first();
    this.pageHeading = page.getByRole('heading', { name: 'New Submission' });
    this.amountInput = page.getByRole('textbox', { name: 'Amount *' });
    this.expenseCategoryDropdown = page.getByLabel('Expense Category *');
    this.incurredDateInput = page.getByRole('textbox', { name: 'Incurred Date *' });
    this.costCenterDropdown = page.locator('#costCenterDropdown')
    this.vendorNameInput = page.getByRole('textbox', { name: 'Vendor Name *' });
    this.supportingDocumentsInput = page.locator('input[type="file"][name="SupportingMedia"]');
    this.supportingDocumentsButton = page.getByRole('button', { name: 'Supporting Documents *' });
    // UI label is "Description *"; accessible name follows placeholder "Enter Expense Description" (same pattern as Expense Form).
    this.descriptionInput = page.getByRole('textbox', { name: /Enter Expense Description|Description \*/i });
    this.submitButton = page.getByRole('button', { name: 'Submit', exact: true });
    this.submitAndAddNewButton = page.getByRole('button', { name: 'Submit and Add New' });
    this.amountExceedsLimitError = page.getByText(
      'Error: Amount cannot exceed 3000 for one expense.',
      { exact: true }
    );
    this.submissionSuccessToast = page.getByText(/Added successfully/i);
    this.uploadedFilePill = page.locator('div.file-pill');
    this.uploadedFileName = this.uploadedFilePill.locator('span.file-name');
    this.uploadedFileRemoveButton = this.uploadedFilePill.locator('span.remove-btn');
  }

  async openNewSubmissionPage() {
    // Direct navigation: sidebar "New Submission" can sit outside the viewport (nested menu), blocking clicks.
    await this.page.goto('/AllForms/CostExpenseForm');
    await expect(this.page).toHaveURL(/\/AllForms\/CostExpenseForm/i);
    await expect(this.pageHeading).toBeVisible();
  }

  async enterAmount(amount: string) {
    await this.amountInput.fill(amount);
  }

  async selectExpenseCategory(categoryValue: string) {
    await this.expenseCategoryDropdown.selectOption(categoryValue);
  }

  async openExpenseCategoryDropdown() {
    await this.expenseCategoryDropdown.click();
  }

  async getExpenseCategoryOptionLabels(): Promise<string[]> {
    const texts = await this.expenseCategoryDropdown.locator('option').allTextContents();
    return texts.map((t) => t.trim());
  }

  async getSelectableExpenseCategoryLabels(): Promise<string[]> {
    const labels = await this.getExpenseCategoryOptionLabels();
    return labels.filter((t) => t.length > 0 && !/^Select Expense Category$/i.test(t));
  }

  async getSelectedExpenseCategoryLabel(): Promise<string> {
    return await this.expenseCategoryDropdown.evaluate((el: HTMLSelectElement) => {
      const i = el.selectedIndex;
      return i >= 0 ? (el.options[i]?.text ?? '').trim() : '';
    });
  }

  /** Value must be `yyyy-MM-dd` (HTML `type="date"`). */
  async enterIncurredDate(dateValue: string) {
    await this.incurredDateInput.fill(dateValue);
  }

  async selectCostCenter(costCenterValue: string) {
    await this.costCenterDropdown.selectOption(costCenterValue);
  }

  async getCostCenterOptionValues(): Promise<string[]> {
    return await this.costCenterDropdown.locator('option').evaluateAll((opts) =>
      (opts as HTMLOptionElement[]).map((o) => o.value)
    );
  }

  /**
   * Picks Cost Center ID using {@link resolveBranchNewSubmissionCostCenterId} and known IDs in `utils/branchCostCenters.ts`.
   * Pass a preferred option `value` (e.g. from `BRANCH_NEW_SUBMISSION_COST_CENTER_IDS`) when the test needs a specific center.
   */
  async selectBranchCostCenter(preferredId?: string) {
    const values = await this.getCostCenterOptionValues();
    const value = resolveBranchNewSubmissionCostCenterId(values, preferredId);
    await this.costCenterDropdown.selectOption(value);
    await expect(this.costCenterDropdown).toHaveValue(value);
  }

  /**
   * Legacy: substring match on option label text, or first real option.
   * Prefer {@link selectBranchCostCenter} + `utils/branchCostCenters.ts` for stable IDs.
   */
  async selectCostCenterPreferringLabel(partialLabel: string) {
    const labels = (await this.costCenterDropdown.locator('option').allTextContents()).map((t) => t.trim());
    const match = labels.find((l) => l.includes(partialLabel));
    const fallback = labels.find((l) => l.length > 0 && !/^Select Cost Center/i.test(l));
    const chosen = match ?? fallback;
    if (!chosen) {
      throw new Error('No Cost Center options available in dropdown.');
    }
    await this.costCenterDropdown.selectOption({ label: chosen });
  }

  async enterVendorName(vendorName: string) {
    await this.vendorNameInput.fill(vendorName);
  }

  async uploadSupportingDocument(filePath: string) {
    await this.supportingDocumentsInput.setInputFiles(filePath);
  }

  async uploadSupportingDocuments(filePaths: string[]) {
    await this.supportingDocumentsInput.setInputFiles(filePaths);
  }

  async enterDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async clickSubmitAndAddNew() {
    await this.submitAndAddNewButton.click();
  }

  async submitNewSubmissionForm(data: {
    amount: string;
    expenseCategoryValue: string;
    incurredDate: string;
    costCenterValue: string;
    vendorName: string;
    description: string;
    supportingDocumentPath?: string;
  }) {
    await this.enterAmount(data.amount);
    await this.selectExpenseCategory(data.expenseCategoryValue);
    await this.enterIncurredDate(data.incurredDate);
    await this.selectCostCenter(data.costCenterValue);
    await this.enterVendorName(data.vendorName);
    if (data.supportingDocumentPath) {
      await this.uploadSupportingDocument(data.supportingDocumentPath);
    }
    await this.enterDescription(data.description);
    await this.clickSubmit();
  }

  async submitAndAddNewSubmissionForm(data: {
    amount: string;
    expenseCategoryValue: string;
    incurredDate: string;
    costCenterValue: string;
    vendorName: string;
    description: string;
    supportingDocumentPath?: string;
  }) {
    await this.enterAmount(data.amount);
    await this.selectExpenseCategory(data.expenseCategoryValue);
    await this.enterIncurredDate(data.incurredDate);
    await this.selectCostCenter(data.costCenterValue);
    await this.enterVendorName(data.vendorName);
    if (data.supportingDocumentPath) {
      await this.uploadSupportingDocument(data.supportingDocumentPath);
    }
    await this.enterDescription(data.description);
    await this.clickSubmitAndAddNew();
  }

  async expectAmountExceedsLimitError() {
    await expect(this.amountExceedsLimitError).toBeVisible();
  }

  async expectUploadedFilePill(fileName: string) {
    await expect(this.uploadedFilePill).toBeVisible();
    await expect(this.uploadedFileName).toHaveText(fileName);
  }

  async expectUploadedFilePills(fileNames: string[]) {
    const pills = this.page.locator('div.file-pill');
    await expect(pills).toHaveCount(fileNames.length);
    for (const name of fileNames) {
      await expect(pills.filter({ hasText: name })).toHaveCount(1);
    }
  }

  async removeUploadedSupportingDocument() {
    await expect(this.uploadedFileRemoveButton).toBeVisible();
    await this.uploadedFileRemoveButton.click();
    await expect(this.uploadedFilePill).not.toBeVisible();
  }

  async expectSubmissionSuccessful() {
    await expect(this.submissionSuccessToast).toBeVisible();
  }

  /** After Submit and Add New, the form resets for another entry. */
  async expectReadyForNewSubmissionEntry() {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.amountInput).toHaveValue('');
    await expect(this.vendorNameInput).toHaveValue('');
    await expect(this.descriptionInput).toHaveValue('');
  }
}
