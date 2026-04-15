import { expect, test } from '@playwright/test';
import { NewSubmissionPage } from '../../../../pages/BranchReimbursement/NewSubmissionPage';
import { Pagegoto } from '../../../../utils/Pagegoto';
import { ensureBranchManagerRoleForEnd2E } from '../../ensureBranchManagerRoleForEnd2E';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test.describe('E2E-BR-004 New Submission - Expense Category dropdown lists all available options', () => {
  test.beforeEach(async ({ page }) => {
    await Pagegoto(page);
    await ensureBranchManagerRoleForEnd2E(page);
    const newSubmissionPage = new NewSubmissionPage(page);
    await newSubmissionPage.openNewSubmissionPage();
  });

  test('Categories visible; Travel and Meals; each option selectable without leaving form', async ({ page }) => {
    const newSubmissionPage = new NewSubmissionPage(page);

    await newSubmissionPage.openExpenseCategoryDropdown();
    const allLabels = await newSubmissionPage.getExpenseCategoryOptionLabels();
    const selectable = await newSubmissionPage.getSelectableExpenseCategoryLabels();

    expect(selectable.length).toBeGreaterThan(0);
    expect(allLabels.some((l) => /Travel/i.test(l))).toBe(true);
    expect(allLabels.some((l) => /Meals/i.test(l))).toBe(true);

    await newSubmissionPage.selectExpenseCategory('63020 Travel');
    await expect.poll(async () => newSubmissionPage.getSelectedExpenseCategoryLabel()).toMatch(/Travel/i);

    await newSubmissionPage.selectExpenseCategory('63010 Meals & Entertainment');
    await expect.poll(async () => newSubmissionPage.getSelectedExpenseCategoryLabel()).toMatch(/Meals/i);

    for (const label of selectable) {
      await newSubmissionPage.selectExpenseCategory(label);
      const selected = (await newSubmissionPage.getSelectedExpenseCategoryLabel()).trim();
      expect(selected).toBe(label.trim());
    }

    await expect(page).toHaveURL(/\/AllForms\/CostExpenseForm/i);
  });
});
