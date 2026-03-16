const { chromium } = require('playwright');
const { Client } = require("@notionhq/client");
const { Mistral } = require("@mistralai/mistralai")
require('dotenv').config();

const mApiKey = process.env.MISTRAL_API_KEY;
const mClient = new Mistral({ apiKey: mApiKey });
const notion = new Client({ auth: process.env.NOTION_KEY });
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function startBrowser(isHeadless) {
  const context = await chromium.launchPersistentContext('./bangi', {
    headless: isHeadless,
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
    page_size: 1,
  });

  if (response.results.length === 0) {
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

async function updateStatus(pageId) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      'status': {
        status: {
          name: 'Done'
        }
      }
    }
  });
}

async function genMessage(profileName, bio) {
  for (let i = 0; i < 3; i++) {
    try {
      const response = await mClient.chat.complete({
        model: "mistral-large-latest",
        messages: [{
          role: 'system',
          content: ``
        },
        {
          role: 'user',
          content: ``
        }]
      });

      console.log('message generated')
      return response.choices[0].message.content;
    } catch (error) {
      console.log(`Attempt ${i + 1} failed. \nError Status Code: ${error.statusCode} \nError Message: ${error.message} \nWaiting for 5 seconds to try again`);
      if (i < 2) await wait(5000);
    }
  }
  return "placeholder message"
}

async function sendMessage(profileURL, profileName, page, bio) {
  await page.goto(profileURL);
  await page.waitForLoadState('domcontentloaded');
  console.log(`Opened profile for ${profileName}`)
  const messageButton = page.getByLabel('Message', { exact: true });
  await messageButton.waitFor({ state: 'visible' });
  await page.waitForTimeout(1000);
  await messageButton.click();
  console.log('Cliked on message Button');
  const chatInput = page.locator('div[role="textbox"][aria-label="Message"]');
  await chatInput.waitFor({ state: 'visible' });
  console.log('Input box became visible');
  await chatInput.click();
  console.log('clicked on input box');
  console.log('trying to generate message')
  const message = await genMessage(profileName, bio)
  await chatInput.fill(message);
  await chatInput.press('Enter');
  console.log('message sent');
  console.log('--------------------')
  await page.waitForTimeout(1000);
  const closeChat = page.getByRole('button', { name: 'Close chat' });
  await closeChat.click();
};

async function main() {

  let hadError = false;
  let isHeadless = false;

  if (process.argv[2] === '--headless') {
    isHeadless = true;
  } else if (process.argv[2] === '-hl') {
    isHeadless = true
  } else {
    console.log(`"${process.argv[2]}" is not a valid flag! \navailable flags --headless/-hl`)
    return;
  }


  let profile = await getProfile();
  if (!profile) {
    console.log('All profiles are already marked as Done.')
    return;
  }


  console.log(`starting browser in ${isHeadless ? 'Headless' : 'Visible'} mode....`)
  const context = await startBrowser(isHeadless);
  const page = context.pages()[0] || await context.newPage();

  console.log("Browser is ready.");


  while (profile) {
    console.log('--------------------')
    console.log('Starting to process profile: ', profile.fullName);
    try {
      await sendMessage(profile.profileLink, profile.fullName, page, profile.bio);
      await updateStatus(profile.pageId);
    } catch (error) {
      console.log(`ERROR: failed to message ${profile.fullName}. \ndetails: `, error.message);
      hadError = true;
      await context.close();
      break;
    }
    console.log('checking for next profile.....')
    profile = await getProfile();

    if (profile) {
      console.log('found a new profile: ', profile.fullName);
    } else {
      console.log('no more new profiles found')
    }
  }

  if (!hadError) {
    console.log('--------------------')
    console.log('SUCCESS: All profiles are processed');
  } else {
    console.log('COMPLETED WITH ERRORS: Some profiles may not have been processed.');
  }
  if (context && context.browser) {
    await context.close();
  }
}

main();
