import { expect, Locator, Page } from '@playwright/test';
// import { ensureSidebarLinkVisible } from '../../utils/ensureSidebarLinkVisible';

export class ExpenseFormPage {
  readonly page: Page;

  readonly expenseFormMenuLink: Locator;
  readonly amountInput: Locator;
  readonly expenseCategoryDropdown: Locator;
  readonly vendorNameInput: Locator;
  readonly supportingDocumentsButton: Locator;
  readonly expenseDescriptionInput: Locator;
  readonly submitButton: Locator;
  readonly submitAndAddNewButton: Locator;
  readonly expenseAddedSuccessToast: Locator;
  readonly amountExceedsLimitError: Locator;
  readonly uploadedFilePill: Locator;
  readonly uploadedFileName: Locator;
  readonly uploadedFileRemoveButton: Locator;

  /** Shown when submit fails server-side (e.g. invalid amount + upload path). */
  readonly technicalErrorPageHeading: Locator;
  readonly technicalErrorPageSubheading: Locator;
  readonly technicalErrorFileUploadParagraph: Locator;

  constructor(page: Page) {
    this.page = page;

    this.expenseFormMenuLink = page.getByRole('link', { name: ' Expense Form' });
    this.amountInput = page.getByRole('textbox', { name: 'Amount*' });
    this.expenseCategoryDropdown = page.getByLabel('Expense Category*');
    this.vendorNameInput = page.getByRole('textbox', { name: 'Vendor Name*' });
    this.supportingDocumentsButton = page.getByRole('button', { name: 'Supporting Documents *' });
    this.expenseDescriptionInput = page.getByRole('textbox', { name: 'Enter Expense Description' });
   
    this.submitButton = page.getByRole('button', { name: /^(Submit|Create Expense)$/i });
    this.submitAndAddNewButton = page.getByRole('button', {
      name: /^(Submit and Add New|Create Expense and Add New)$/i
    });
    this.expenseAddedSuccessToast = page.getByText('×Expense Added successfully!');
    this.amountExceedsLimitError = page.getByText(
      'Error: Amount cannot exceed 3000 for one expense.',
      { exact: true }
    );
    this.uploadedFilePill = page.locator('div.file-pill');
    this.uploadedFileName = this.uploadedFilePill.locator('span.file-name');
    this.uploadedFileRemoveButton = this.uploadedFilePill.locator('span.remove-btn');

    this.technicalErrorPageHeading = page.getByRole('heading', { name: 'Error.' });
    this.technicalErrorPageSubheading = page.getByRole('heading', {
      name: 'An error occurred while processing your request.'
    });
    this.technicalErrorFileUploadParagraph = page.locator(
      'p:has-text("Error Message: File upload failed due to a technical issue.")'
    );
  }
/* 
  async gotoHomePage() {
    await this.page.goto(
      'https://expense-staging-ccbyhcf2fch9cmgf.eastus-01.azurewebsites.net/Home/Index'
    );
  } */

  async openExpenseForm() {
    // await ensureSidebarLinkVisible(this.page, this.expenseFormMenuLink);
    await expect(this.expenseFormMenuLink).toBeVisible();
    try {
      await this.expenseFormMenuLink.scrollIntoViewIfNeeded();
      await this.expenseFormMenuLink.click({ timeout: 5000 });
    } catch {
      await this.page.goto('/AllForms/ExpenseForm', { waitUntil: 'domcontentloaded' });
    }
    await expect(this.page).toHaveURL(/\/AllForms\/ExpenseForm/i);
  }

  async enterAmount(amount: string) {
  //  await this.amountInput.click();
    await this.amountInput.fill(amount);
  }

  async selectExpenseCategory(categoryValue: string) {
    await this.expenseCategoryDropdown.selectOption(categoryValue);
  }

  async openExpenseCategoryDropdown() {
    await this.expenseCategoryDropdown.click();
  }

  /** All option labels as shown in the UI (includes placeholder). */
  async getExpenseCategoryOptionLabels(): Promise<string[]> {
    const texts = await this.expenseCategoryDropdown.locator('option').allTextContents();
    return texts.map((t) => t.trim());
  }

  /** Category option labels excluding the default placeholder. */
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

  async enterVendorName(vendorName: string) {
  //  await this.vendorNameInput.click();
    await this.vendorNameInput.fill(vendorName);
  }

  async uploadSupportingDocument(filePath: string) {
    await this.supportingDocumentsButton.setInputFiles(filePath);
  }

  /** Select multiple files in one file-picker action (input must allow multiple). */
  async uploadSupportingDocuments(filePaths: string[]) {
    await this.supportingDocumentsButton.setInputFiles(filePaths);
  }

  async expectUploadedFilePill(fileName: string) {
    await expect(this.uploadedFilePill).toBeVisible();
    await expect(this.uploadedFileName).toHaveText(fileName);
    await expect(this.uploadedFileRemoveButton).toBeVisible();
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

  async enterExpenseDescription(description: string) {
   // await this.expenseDescriptionInput.click();
    await this.expenseDescriptionInput.fill(description);
  }

  async submitExpense() {
    await this.submitButton.click();
  }

  async submitAndAddNewExpense() {
    await this.submitAndAddNewButton.click();
  }

  async expectExpenseAddedSuccessfully() {
    await expect(this.expenseAddedSuccessToast).toBeVisible();
  }

  async expectReadyForNewExpenseEntry() {
    await expect(this.amountInput).toBeVisible();
    await expect(this.vendorNameInput).toBeVisible();
    await expect(this.expenseDescriptionInput).toBeVisible();
    await expect(this.supportingDocumentsButton).toBeVisible();

    await expect(this.amountInput).toHaveValue('');
    await expect(this.vendorNameInput).toHaveValue('');
    await expect(this.expenseDescriptionInput).toHaveValue('');
  }

  async expectAmountExceedsLimitError() {
    await expect(this.amountExceedsLimitError).toBeVisible();
  }

  /**
   * Asserts the generic error page after Submit / Submit and Add New when the app
   * redirects with a file-upload technical failure message.
   */
  async expectFileUploadTechnicalErrorPage() {
    await expect(this.technicalErrorPageHeading).toBeVisible();
    await expect(this.technicalErrorPageSubheading).toBeVisible();
    await expect(this.technicalErrorFileUploadParagraph).toBeVisible();
  }

  /**
   * All mandatory fields filled including supporting document; amount is invalid.
   * After Submit or Submit and Add New, the app may navigate to the technical error screen.
   */
  async fillFormWithInvalidAmountSubmitAndExpectFileUploadTechnicalError(options: {
    invalidAmount: string;
    expenseCategoryValue: string;
    vendorName: string;
    supportingDocumentPath: string;
    uploadedFileDisplayName: string;
    description: string;
    submitAction: 'submit' | 'submitAndAddNew';
  }) {
    await this.enterAmount(options.invalidAmount);
    await this.selectExpenseCategory(options.expenseCategoryValue);
    await this.enterVendorName(options.vendorName);
    await this.uploadSupportingDocument(options.supportingDocumentPath);
    await this.expectUploadedFilePill(options.uploadedFileDisplayName);
    await this.enterExpenseDescription(options.description);
    if (options.submitAction === 'submit') {
      await this.submitExpense();
    } else {
      await this.submitAndAddNewExpense();
    }
    await this.expectFileUploadTechnicalErrorPage();
  }

  async submitExpenseForm(data: {
    amount: string;
    expenseCategoryValue: string;
    vendorName: string;
    supportingDocumentPath: string;
    description: string;
  }) {
    await this.enterAmount(data.amount);
    await this.selectExpenseCategory(data.expenseCategoryValue);
    await this.enterVendorName(data.vendorName);
    await this.uploadSupportingDocument(data.supportingDocumentPath);
    await this.enterExpenseDescription(data.description);
    await this.submitExpense();
  }

  async submitExpenseFormAndAddNew(data: {
    amount: string;
    expenseCategoryValue: string;
    vendorName: string;
    supportingDocumentPath: string;
    description: string;
  }) {
    await this.enterAmount(data.amount);
    await this.selectExpenseCategory(data.expenseCategoryValue);
    await this.enterVendorName(data.vendorName);
    await this.uploadSupportingDocument(data.supportingDocumentPath);
    await this.enterExpenseDescription(data.description);
    await this.submitAndAddNewExpense();
  }
}
