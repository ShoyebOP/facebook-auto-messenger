# 🤖 Facebook Auto Messenger

Automate your Facebook outreach with this powerful tool that sends personalized messages to profiles managed through Notion. Built with Playwright for reliable browser automation.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Playwright](https://img.shields.io/badge/Playwright-Latest-blue?logo=microsoft-playwright)
![Notion API](https://img.shields.io/badge/Notion-API-black?logo=notion)

## ✨ Features

- 🎯 **Automated Messaging** - Send messages to Facebook profiles automatically
- 📊 **Notion Integration** - Manage contacts and track progress in Notion databases
- 🚀 **Headless Browser** - Uses Playwright with persistent browser context for stability
- 🔄 **Queue System** - Processes profiles one by one from your Notion database
- ✅ **Status Tracking** - Automatically marks completed profiles in Notion
- 🛡️ **Error Handling** - Graceful error management with detailed logging

## 📋 Prerequisites

- Node.js 18+
- Notion account with API access
- Facebook account
- Linux/macOS/Windows

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShoyebOP/facebook-auto-messenger.git
   cd facebook-auto-messenger
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install chromium
   ```

4. **Configure environment variables**
   ```bash
   cp .envex .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   NOTION_KEY=secret_your_actual_key_here
   NOTION_DATA_SOURCE_ID=your_database_id_here
   ```

## 📝 Notion Setup

1. Create a Notion database with the following properties:
   - **Full Name** (Title)
   - **Profile Link** (URL)
   - **Bio** (Rich Text)
   - **Status** (Status) with options: "Not started", "Done"

2. Get your Notion API key from [Notion Integrations](https://www.notion.so/my-integrations)

3. Share your database with the integration

4. Copy the database ID to your `.env` file

## 💻 Usage

Run the automation:

```bash
node index.js
```

The script will:
1. Fetch profiles from Notion with status "Not started"
2. Open each Facebook profile
3. Click the message button
4. Send the predefined message
5. Update the status to "Done" in Notion
6. Move to the next profile

## ⚙️ Customization

### Change the message
Edit the message in `index.js`:
```javascript
await chatInput.fill('Your custom message here');
```

### Adjust browser settings
Modify the browser context in `startBrowser()`:
```javascript
const context = await chromium.launchPersistentContext('./bangi', {
  headless: false,  // Set to true for headless mode
  viewport: { width: 1280, height: 620 },
  // ... other options
});
```

## ⚠️ Important Notes

- **Use responsibly**: Respect Facebook's Terms of Service
- **Rate limiting**: Consider adding delays between messages to avoid detection
- **Personalization**: Customize messages to avoid spam-like behavior
- **Account safety**: Use at your own risk; automated actions may violate platform policies

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Playwright** - Browser automation
- **Notion SDK** - Database integration
- **dotenv** - Environment variable management

## 📄 License

ISC

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

---

Made with ❤️ by [@ShoyebOP](https://github.com/ShoyebOP)
