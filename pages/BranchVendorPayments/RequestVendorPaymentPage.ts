import { expect, Locator, Page } from '@playwright/test';
import { resolveBranchNewSubmissionCostCenterId } from '../../utils/branchCostCenters';
import { resolveBranchVendorPaymentVendorName } from '../../utils/branchVendorNames';

export class RequestVendorPaymentPage {
  readonly page: Page;

  readonly requestVendorPaymentMenuLink: Locator;
  readonly pageHeading: Locator;
  readonly amountInput: Locator;
  readonly expenseCategoryDropdown: Locator;
  readonly incurredDateInput: Locator;
  readonly costCenterDropdown: Locator;
  readonly vendorNameDropdown: Locator;
  readonly supportingDocumentsInput: Locator;
  readonly supportingDocumentsButton: Locator;
  readonly descriptionInput: Locator;
  readonly submitButton: Locator;
  readonly submitAndAddNewButton: Locator;
  readonly amountExceedsLimitError: Locator;
  readonly submissionSuccessToast: Locator;
  readonly uploadedFilePill: Locator;
  readonly uploadedFileName: Locator;

  constructor(page: Page) {
    this.page = page;

    this.requestVendorPaymentMenuLink = page.getByRole('link', { name: ' Request Vendor Payment' });
    this.pageHeading = page.getByRole('heading', { name: 'New Branch Vendor Expense Form' });
    this.amountInput = page.getByRole('textbox', { name: 'Amount*' });
    this.expenseCategoryDropdown = page.getByLabel('Expense Category*');
    this.incurredDateInput = page.getByRole('textbox', { name: 'Incurred Date*' });
    this.costCenterDropdown = page.locator('#costCenterDropdown')
    this.vendorNameDropdown = page.getByLabel('Vendor Name*');
    this.supportingDocumentsInput = page.locator('input[type="file"][name="SupportingMedia"]');
    this.supportingDocumentsButton = page.getByRole('button', { name: 'Supporting Documents *' });
    this.descriptionInput = page.getByRole('textbox', { name: 'Description*' });
    this.submitButton = page.getByRole('button', { name: 'Submit', exact: true });
    this.submitAndAddNewButton = page.getByRole('button', { name: 'Submit and Add New' });
    this.amountExceedsLimitError = page.getByText(
      'Error: Amount cannot exceed 3000 for one expense.',
      { exact: true }
    );
    this.submissionSuccessToast = page.getByText(/Added successfully/i);
    this.uploadedFilePill = page.locator('div.file-pill');
    this.uploadedFileName = this.uploadedFilePill.locator('span.file-name');
  }

  async openRequestVendorPaymentPage() {
    await this.page.goto('/AllForms/BranchVendorExpenseForm');
    await expect(this.page).toHaveURL(/\/AllForms\/BranchVendorExpenseForm/i);
    await expect(this.pageHeading).toBeVisible();
  }

  async enterAmount(amount: string) {
    await this.amountInput.fill(amount);
  }

  async selectExpenseCategory(categoryValue: string) {
    await this.expenseCategoryDropdown.selectOption(categoryValue);
  }

  async enterIncurredDate(incurredDate: string) {
    await this.incurredDateInput.fill(incurredDate);
  }

  async selectCostCenter(costCenterValue: string) {
    await this.costCenterDropdown.selectOption(costCenterValue);
  }

  async selectVendorName(vendorNameValue: string) {
    await this.vendorNameDropdown.selectOption(vendorNameValue);
  }

  async getCostCenterOptionValues(): Promise<string[]> {
    return await this.costCenterDropdown.locator('option').evaluateAll((opts) =>
      (opts as HTMLOptionElement[]).map((o) => o.value)
    );
  }

  async selectBranchCostCenter(preferredId?: string) {
    await expect
      .poll(async () => {
        const current = await this.getCostCenterOptionValues();
        return current.map((v) => v.trim()).filter((v) => v.length > 0).length;
      }, { timeout: 30_000, intervals: [500, 1000, 2000, 3000] })
      .toBeGreaterThan(0);
    const values = await this.getCostCenterOptionValues();
    const value = resolveBranchNewSubmissionCostCenterId(values, preferredId);
    await this.selectCostCenter(value);
    await expect(this.costCenterDropdown).toHaveValue(value);
  }

  async getVendorOptionValues(): Promise<string[]> {
    return await this.vendorNameDropdown.locator('option').evaluateAll((opts) =>
      (opts as HTMLOptionElement[]).map((o) => o.value)
    );
  }

  async selectBranchVendorName(preferredName?: string) {
    await expect
      .poll(async () => {
        const current = await this.getVendorOptionValues();
        return current.map((v) => v.trim()).filter((v) => v.length > 0).length;
      }, { timeout: 30_000, intervals: [500, 1000, 2000, 3000] })
      .toBeGreaterThan(0);
    const values = await this.getVendorOptionValues();
    const value = resolveBranchVendorPaymentVendorName(values, preferredName);
    await this.selectVendorName(value);
    await expect(this.vendorNameDropdown).toHaveValue(value);
  }

  async uploadSupportingDocument(filePath: string) {
    await this.supportingDocumentsInput.setInputFiles(filePath);
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

  async submitRequestVendorPayment(data: {
    amount: string;
    expenseCategoryValue: string;
    incurredDate: string;
    costCenterValue: string;
    vendorNameValue: string;
    description: string;
    supportingDocumentPath?: string;
  }) {
    await this.enterAmount(data.amount);
    await this.selectExpenseCategory(data.expenseCategoryValue);
    await this.enterIncurredDate(data.incurredDate);
    await this.selectCostCenter(data.costCenterValue);
    await this.selectVendorName(data.vendorNameValue);
    if (data.supportingDocumentPath) {
      await this.uploadSupportingDocument(data.supportingDocumentPath);
    }
    await this.enterDescription(data.description);
    await this.clickSubmit();
  }

  async submitAndAddNewRequestVendorPayment(data: {
    amount: string;
    expenseCategoryValue: string;
    incurredDate: string;
    costCenterValue: string;
    vendorNameValue: string;
    description: string;
    supportingDocumentPath?: string;
  }) {
    await this.enterAmount(data.amount);
    await this.selectExpenseCategory(data.expenseCategoryValue);
    await this.enterIncurredDate(data.incurredDate);
    await this.selectCostCenter(data.costCenterValue);
    await this.selectVendorName(data.vendorNameValue);
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
    if (await this.uploadedFilePill.first().isVisible()) {
      await expect(this.uploadedFileName).toHaveText(fileName);
      return;
    }
    await expect
      .poll(async () =>
        this.supportingDocumentsInput.evaluate((el) => {
          const input = el as HTMLInputElement;
          return input.files?.[0]?.name ?? '';
        })
      )
      .toBe(fileName);
  }

  async expectSubmissionSuccessful() {
    if (await this.submissionSuccessToast.first().isVisible()) {
      await expect(this.submissionSuccessToast).toBeVisible();
      return;
    }
    await expect(this.page).toHaveURL(/\/AllForms\/GetMyVendorExpense/i);
  }

  /** After Submit and Add New, the form resets for another entry. */
  async expectReadyForNewRequestVendorPaymentEntry() {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.submitAndAddNewButton).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }
}
