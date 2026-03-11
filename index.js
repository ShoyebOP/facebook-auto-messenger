const { chromium } = require('playwright');

async function startBrowser() {
  const context = await chromium.launchPersistentContext('./bangi', {
    headless: false,
    viewport: { width: 1280, height: 620 },
    args: ['--start-maximized', '--disable-blink-features=AutomationControlled', '--disable-gpu'],
    ignoreDefaultArgs: ['--enable-automation']
  });
  return context;
}

async function getProfile() {
  // notion logic for getting profile info will be here
}

async function sendMessage(profileURL, profileName, page) {
  await page.goto(profileURL);
  await page.waitForLoadState('domcontentloaded');
  console.log(`Opened profile for ${profileName}`)
  const messageButton = page.getByLabel('Message', { exact: true });
  await messageButton.waitFor({ state: 'visible' });
  await messageButton.click();
  console.log('Cliked on message Button');
  const chatInput = page.locator('div[role="textbox"][aria-label="Message"]');
  await chatInput.waitFor({ state: 'visible' });
  console.log('Input box became visible');
  await chatInput.click();
  console.log('clicked on input box');
  await chatInput.fill('placeholder message');
  await chatInput.press('Enter');
  console.log('message sent');
  await page.waitForTimeout(1000);
  const closeChat = page.getByRole('button', { name: 'Close chat' });
  await closeChat.click();
};

async function main() {
  const context = await startBrowser();
  const page = context.pages()[0] || await context.newPage();

  console.log("Browser is ready.");

  // there will be a for loop
}

// This is how we start the whole thing
main();
