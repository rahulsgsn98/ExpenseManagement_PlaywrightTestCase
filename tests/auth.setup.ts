import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import {TestConfig} from "../test.config";

const testConfig = new TestConfig();

const authFile = path.join(__dirname, '../playwright/.auth/user.json')
const EMAIL = testConfig.email;
const PASSWORD = testConfig.password;

setup('authenticate', async ({ page }) => {
  setup.setTimeout(180000); // Set a longer timeout for the authentication process

 
  if (fs.existsSync(authFile)) {
  console.log('Session exists. Skipping login.');
  return;
}



  await page.goto('https://expense-staging-ccbyhcf2fch9cmgf.eastus-01.azurewebsites.net/');

  const welcomeHeading = page.getByRole('heading', { name: 'Welcome to the Employee Expense Portal!' })

  // --- 2. SCENARIO: ALREADY LOGGED IN ---
  // Use a short wait instead of immediate isVisible
  const alreadyLoggedIn = await welcomeHeading.isVisible({ timeout: 5000 }).catch(() => false);
  if (alreadyLoggedIn) {
    await page.context().storageState({ path: authFile });
    return;
  }

  // --- 3. SCENARIO: CONTINUE BUTTON ---
  const continueButton = page.getByRole('button', { name: /Continue to Login/i });
  if (await continueButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await continueButton.click();
  }

  // --- 4. MICROSOFT LOGIN LOGIC ---
  // Wait for either "Pick account" OR "Email input"
  const accountOption = page.getByText(EMAIL, { exact: false });
  const emailInput = page.getByPlaceholder(/Email|phone|Skype/i);

  // Use a "race" or check visibility with a small timeout
  if (await accountOption.isVisible({ timeout: 8000 }).catch(() => false)) {
    console.log('Scenario: Pick Account');
    await accountOption.click();
  } else {
    console.log('Scenario: Fresh Email Login');
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill(EMAIL);
    await page.getByRole('button', { name: /Next/i }).click();

    const passwordInput = page.getByPlaceholder(/Password/i);
    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.fill(PASSWORD);
    await page.getByRole('button', { name: /Sign in/i }).click();
  }

await page.waitForLoadState('domcontentloaded');
// Short wait to ensure any MFA prompt has time to trigger

 //  WAIT for the MFA prompt to arrive (This replaces waitForTimeout)
// We wait for the specific text "Approve a request" to be attached to the DOM
/* const mfaPrompt = page.getByText(/Approve a request on my Microsoft Authenticator app/i);
await mfaPrompt.waitFor({ state: 'visible', timeout: 15000 });

// 3. RECOVERY: If the red "trouble verifying" message appears, click to retry
const errorMsg = page.getByText(/trouble verifying your account/i);
if (await errorMsg.isVisible()) {
    console.log('🔄 Microsoft glitch detected. Re-triggering MFA notification...');
    // Clicking the prompt again usually forces Microsoft to send the push
    await mfaPrompt.click(); 
} */

  // --- 5. HANDLE "STAY SIGNED IN?" ---
  // Microsoft usually shows this after Password/MFA. If ignored, the session isn't "Persistent"
 // --- 5. HANDLE "STAY SIGNED IN?" ---
  // This screen appears immediately AFTER you approve the MFA on your phone
  const staySignedInScreen = page.getByText(/Stay signed in\?/i);
  const dontShowAgainCheckbox = page.getByLabel(/Don't show this again/i);
  const yesButton = page.getByRole('button', { name: /Yes/i });

  try {
    // 1. Wait for the screen to appear after your phone approval
    console.log('⌛ Waiting for "Stay signed in?" screen...');
    await staySignedInScreen.waitFor({ state: 'visible', timeout: 60000 });

    // 2. CHECK THE BOX: This prevents the screen from coming back tomorrow
    if (await dontShowAgainCheckbox.isVisible()) {
      await dontShowAgainCheckbox.check();
      console.log('✅ Checked "Don\'t show this again"');
    }

    // 3. CLICK YES
    await yesButton.click();
    console.log('✅ Clicked "Yes"');
  } catch (e) {
    // If the screen doesn't appear, it means Microsoft skipped it (already "remembered")
    console.log('ℹ️ "Stay signed in?" screen skipped or already handled.');
  }

  // --- 6. WAIT FOR MFA & DASHBOARD ---
  console.log('⚠️ Waiting for MFA approval and Dashboard load...');
  await expect(welcomeHeading).toBeVisible({ timeout: 120000 }); // Wait up to 2 minutes for the dashboard to load after MFA

  // --- 7. SAVE STATE ---
  await page.context().storageState({ path: authFile });
  console.log('🚀 Session saved successfully.');
});
