import { Page } from '@playwright/test';

export async function handleContinueLogin(page: Page) {

  const continueButton = page.getByRole('button', { name: /Continue to Login/i });

  try {
    await continueButton.waitFor({ state: 'visible', timeout: 7000 });

    console.log('Continue Login detected → clicking');

    await continueButton.click();

  } catch {
    console.log('Continue Login not present');
  }

}