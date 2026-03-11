const { chromium, devices } = require('playwright');

(async () => {
  const pixel5 = devices['Pixel 5']

  const context = await chromium.launchPersistentContext('./bangi', {
    userAgent: pixel5.userAgent,
    viewport: {
      width: 393,
      height: 620
    },
    isMobile: true,
    headless: false,
    args: [`--window-size=343,720`],
    slowMo: 500
  });

  const page = context.pages()[0] || context.newPage();

  try {
    await page.goto('https://m.facebook.com/profile.php?id=61586067321690', {
      waitUntil: 'commit'
    });
  } catch (error) {
    console.log('the xdg shit popped up');
  }

  console.log("Current page is: ", page.url());

})();
