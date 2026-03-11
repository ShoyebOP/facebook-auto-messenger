const { chromium, devices } = require('playwright');

(async () => {
  const pixel5 = devices['Pixel 5']

  const context = await chromium.launchPersistentContext('./bangi', {
    ...pixel5,
    headless: false,
    args: [`--window-size=${pixel5.viewport.width},${pixel5.viewport.height + 100}`],
    slowMo: 500
  });

  const page = context.pages()[0] || context.newPage();

  await page.goto('https://m.facebook.com');

  console.log('facebook loaded')
})();
