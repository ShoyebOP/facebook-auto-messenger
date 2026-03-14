const { chromium } = require('playwright');
const { Client } = require("@notionhq/client");
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_KEY });

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
  const response = await notion.dataSources.query({
    data_source_id: process.env.NOTION_DATA_SOURCE_ID,
    filter: {
      property: 'status',
      status: {
        equals: 'Not started',
      },
    },
    page_size: 1, // Just get one person for the test
  });

  if (response.results.length === 0) {
    console.log('no more profile to message!');
    return null;
  } else {
    const page = response.results[0];
    const props = page.properties;

    return {
      pageId: page.id,
      fullName: props['Full Name'].title[0]?.plain_text || 'No Name',
      profileLink: props['Profile Link'].url,
      bio: props.Bio.rich_text[0]?.plain_text || 'No Bio',
    }
  }
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
  // const context = await startBrowser();
  // const page = context.pages()[0] || await context.newPage();
  //
  // console.log("Browser is ready.");

  const profile = await getProfile();
  console.log(profile);
}

// This is how we start the whole thing
main();
