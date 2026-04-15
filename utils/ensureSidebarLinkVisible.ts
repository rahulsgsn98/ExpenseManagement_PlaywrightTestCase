import { Locator, Page } from '@playwright/test';

/**
 * In CI, the left navigation can be collapsed behind the hamburger icon.
 * Expand it when needed so sidebar links are interactable.
 */
export async function ensureSidebarLinkVisible(page: Page, targetLink: Locator): Promise<void> {
  const isOnScreen = async () =>
    targetLink
      .evaluate((el) => {
        const r = (el as HTMLElement).getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < window.innerHeight && r.left < window.innerWidth;
      })
      .catch(() => false);

  if ((await targetLink.isVisible().catch(() => false)) && (await isOnScreen())) {
    return;
  }

  const sidebarToggleIcon = page.locator('em.icon.ni.ni-menu').first();
  if (await sidebarToggleIcon.isVisible().catch(() => false)) {
    await sidebarToggleIcon.click({ force: true });
    await page.waitForTimeout(150);
    return;
  }

  // Fallback for builds where the icon is wrapped differently.
  const sidebarToggleLink = page.getByRole('link', { name: '' }).first();
  if (await sidebarToggleLink.isVisible().catch(() => false)) {
    await sidebarToggleLink.click({ force: true });
    await page.waitForTimeout(150);
  }
}
