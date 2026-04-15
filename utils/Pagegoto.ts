import { Page } from '@playwright/test';
import { TestConfig } from '../test.config';

const testConfig = new TestConfig();

export async function Pagegoto(page: Page): Promise<void> {
  await page.goto(
    testConfig.appUrl,
    {
      waitUntil:'domcontentloaded'
    }
  );
}
