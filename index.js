const { chromium, devices } = require('playwright');

(async () => {
  const context = await chromium.launchPersistentContext('./bangi', {
    headless: false,
    viewport: { width: 1280, height: 620 },
    args: [
      '--start-maximized',
      '--disable-blink-features=AutomationControlled',
      '--disable-gpu'
    ],
    slowMo: 10,
    ignoreDefaultArgs: ['--enable-automation']
  });

  const page = context.pages()[0] || context.newPage();


  try {
    await page.goto('https://www.facebook.com/abid.bin.yusuf.2024', {
      waitUntil: 'commit'
    });
  } catch (error) {
    console.log('the xdg shit popped up');
  }

  console.log('went to the profile')

  const messageButton = page.getByLabel('Message', { exact: true });

  await messageButton.waitFor({ state: 'visible' });

  await messageButton.click();

  console.log('cliked on Message button')

  const chatInput = page.locator('div[role="textbox"][aria-label="Message"]');

  await chatInput.waitFor({ state: 'visible' });

  await chatInput.click();

  console.log('clicked on input')

  await chatInput.fill('Hello! My system is slow, but my bot is working.');

  await chatInput.press('Enter');

  const closeChat = page.getByLabel('Close Chat', { exact: true });

  await closeChat.click();

  console.log('message sent')
})();
