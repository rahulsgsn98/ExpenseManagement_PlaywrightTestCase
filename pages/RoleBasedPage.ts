import { expect, Locator, Page } from '@playwright/test';

export type UserRole =
  | 'HR'
  | 'Managers'
  | 'Super Admin'
  | 'Employees'
  | 'Accounting Team'
  | 'Divisional Manager'
  | 'Regional Manager'
  | 'Area Manager'
  | 'Branch Manager';

export class RoleBasedPage {
  readonly page: Page;

  // Profile menu
  readonly profileToggleLink: Locator;
  readonly profileUserName: Locator;
  readonly rolesDropdown: Locator;
  readonly signOutLink: Locator;

  // Shared sidebar/menu links for permission checks
  readonly expenseFormLink: Locator;
  readonly employeeHistoryLink: Locator;
  readonly newSubmissionLink: Locator;
  readonly branchHistoryLink: Locator;
  readonly requestVendorPaymentLink: Locator;
  readonly vendorPaymentHistoryLink: Locator;
  readonly approvalBranchReimbursementsLink: Locator;
  readonly approvalEmployeeReimbursementsLink: Locator;
  readonly allBranchReimbursementsLink: Locator;
  readonly allEmployeeReimbursementsLink: Locator;
  readonly allEmployeeVendorExpensesLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Profile menu
    this.profileToggleLink = page.getByRole('link', { name: 'A', exact: true }).first();
    this.profileUserName = page.locator('div').filter({ hasText: 'Amaan Ansari' }).first();
    this.rolesDropdown = page.locator('#RolesDropdown');
    this.signOutLink = page.getByRole('link', { name: /Sign out/i }).first();

    // Sidebar links
    this.expenseFormLink = page.getByRole('link', { name: ' Expense Form' });
    this.employeeHistoryLink = page.getByRole('link', { name: ' History' }).first();
    this.newSubmissionLink = page.getByRole('link', { name: ' New Submission' });
    this.branchHistoryLink = page.getByRole('link', { name: ' History' }).nth(1);
    this.requestVendorPaymentLink = page.getByRole('link', { name: ' Request Vendor Payment' });
    this.vendorPaymentHistoryLink = page.getByRole('link', { name: ' History' }).nth(2);
    this.approvalBranchReimbursementsLink = page.getByRole('link', { name: ' Branch Reimbursements' });
    this.approvalEmployeeReimbursementsLink = page.getByRole('link', { name: ' Employee Reimbursements' });
    this.allBranchReimbursementsLink = page.getByRole('link', { name: ' All Branch Reimbursements' });
    this.allEmployeeReimbursementsLink = page.getByRole('link', { name: ' All Employee Reimbursements' });
    this.allEmployeeVendorExpensesLink = page.getByRole('link', { name: ' All Employee Vendor Expenses' });
  }

  async openDashboard() {
    await this.page.goto('https://expense-staging-ccbyhcf2fch9cmgf.eastus-01.azurewebsites.net/Home/Index');
    await expect(this.page).toHaveURL(/\/Home\/Index/i);
  }

  async openProfileMenu() {
    await expect(this.profileToggleLink).toBeVisible();
    // CI can intermittently miss the first click on the avatar menu.
    await expect
      .poll(
        async () => {
          await this.profileToggleLink.click({ force: true });
          return await this.rolesDropdown.isVisible().catch(() => false);
        },
        { timeout: 20_000, intervals: [200, 400, 800, 1200] }
      )
      .toBe(true);
    await expect(this.signOutLink).toBeVisible();
  }

  async switchRole(role: UserRole) {
    await this.openProfileMenu();
    await this.rolesDropdown.selectOption({ label: role });
    await this.page.waitForLoadState('domcontentloaded');
    await expect
      .poll(
        async () => this.page.url().length > 0,
        { timeout: 20_000, intervals: [300, 500, 1000] }
      )
      .toBe(true);
    await this.openProfileMenu();
    await expect
      .poll(async () => this.getSelectedRoleLabel(), { timeout: 20_000, intervals: [300, 500, 1000] })
      .toBe(role);
  }

  /** Requires the roles combobox to be visible (e.g. after openProfileMenu). */
  async getSelectedRoleLabel(): Promise<string> {
    return await this.rolesDropdown.evaluate((el: HTMLSelectElement) => {
      const i = el.selectedIndex;
      return i >= 0 ? (el.options[i]?.text ?? '').trim() : '';
    });
  }

  /**
   * Lands on dashboard and ensures the given role is active.
   * @param role - Must match an option label in the roles dropdown (e.g. 'Employees').
   * @param options.profileMenuAlreadyOpen - Skip dashboard + menu open when the profile menu is already open with the combobox visible.
   */
  async ensureActiveRole(role: UserRole, options?: { profileMenuAlreadyOpen?: boolean }) {
    if (!options?.profileMenuAlreadyOpen) {
      await this.openDashboard();
      await this.openProfileMenu();
    }
    const labels = (await this.rolesDropdown.locator('option').allTextContents()).map((t) => t.trim());
    if (!labels.includes(role)) {
      throw new Error(`Role "${role}" is not available. Options: ${labels.join(', ')}`);
    }
    const current = await this.getSelectedRoleLabel();
    if (current !== role) {
      await this.rolesDropdown.selectOption({ label: role });
      await this.page.waitForLoadState('domcontentloaded');
      await expect
        .poll(
          async () => this.page.url().length > 0,
          { timeout: 20_000, intervals: [300, 500, 1000] }
        )
        .toBe(true);
      await this.openProfileMenu();
      await expect
        .poll(async () => this.getSelectedRoleLabel(), { timeout: 20_000, intervals: [300, 500, 1000] })
        .toBe(role);
    }
  }

  async signOut() {
    await this.openProfileMenu();
    await this.signOutLink.click();
  }

  // Route-level check helper. Some roles redirect to AccessDenied which currently returns 404.
  async gotoAndCheckAccess(path: string) {
    await this.page.goto(path);
    const url = this.page.url();
    const blockedByAccessDenied = url.includes('/Account/AccessDenied') || url.startsWith('chrome-error://');
    return {
      url,
      accessible: !blockedByAccessDenied
    };
  }

  async expectRoleVisibleInDropdown(role: UserRole) {
    await this.openProfileMenu();
    await expect(this.rolesDropdown.locator(`option:has-text("${role}")`)).toBeVisible();
  }

  async expectRestrictedMenuForEmployeeLikeRoles() {
    await expect(this.expenseFormLink).toBeVisible();
    await expect(this.employeeHistoryLink).toBeVisible();
    await expect(this.newSubmissionLink).not.toBeVisible();
    await expect(this.requestVendorPaymentLink).not.toBeVisible();
    await expect(this.allBranchReimbursementsLink).not.toBeVisible();
    await expect(this.allEmployeeReimbursementsLink).not.toBeVisible();
    await expect(this.allEmployeeVendorExpensesLink).not.toBeVisible();
  }

  async expectSuperAdminMenuAccess() {
    await expect(this.expenseFormLink).toBeVisible();
    await expect(this.employeeHistoryLink).toBeVisible();
    await expect(this.newSubmissionLink).toBeVisible();
    await expect(this.branchHistoryLink).toBeVisible();
    await expect(this.requestVendorPaymentLink).toBeVisible();
    await expect(this.vendorPaymentHistoryLink).toBeVisible();
    await expect(this.approvalBranchReimbursementsLink).toBeVisible();
    await expect(this.approvalEmployeeReimbursementsLink).toBeVisible();
    await expect(this.allBranchReimbursementsLink).toBeVisible();
    await expect(this.allEmployeeReimbursementsLink).toBeVisible();
    await expect(this.allEmployeeVendorExpensesLink).toBeVisible();
  }

  async expectAccountingTeamMenuAccess() {
    await expect(this.expenseFormLink).toBeVisible();
    await expect(this.employeeHistoryLink).toBeVisible();
    await expect(this.newSubmissionLink).toBeVisible();
    await expect(this.branchHistoryLink).toBeVisible();
    await expect(this.requestVendorPaymentLink).toBeVisible();
    await expect(this.vendorPaymentHistoryLink).toBeVisible();
    await expect(this.allBranchReimbursementsLink).toBeVisible();
    await expect(this.allEmployeeReimbursementsLink).toBeVisible();
    await expect(this.allEmployeeVendorExpensesLink).toBeVisible();
  }

  async expectBranchManagerMenuAccess() {
    await expect(this.expenseFormLink).toBeVisible();
    await expect(this.employeeHistoryLink).toBeVisible();
    await expect(this.newSubmissionLink).toBeVisible();
    await expect(this.branchHistoryLink).toBeVisible();
    await expect(this.requestVendorPaymentLink).toBeVisible();
    await expect(this.vendorPaymentHistoryLink).toBeVisible();
    await expect(this.approvalBranchReimbursementsLink).toBeVisible();
    await expect(this.approvalEmployeeReimbursementsLink).toBeVisible();
    await expect(this.allBranchReimbursementsLink).not.toBeVisible();
    await expect(this.allEmployeeReimbursementsLink).not.toBeVisible();
    await expect(this.allEmployeeVendorExpensesLink).not.toBeVisible();
  }
}
