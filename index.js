const axios = require("axios");
const puppeteer = require("puppeteer");
const TelegramBot = require("node-telegram-bot-api");

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' and 'YOUR_CHAT_ID' with your actual Telegram bot token and chat ID
const botToken = "6766661829:AAFjucZOvcM-eMgyLQjIkgvX_cHBv4mgWPc";
const chatId = "-1001857871064";
const telegramBot = new TelegramBot(botToken, { polling: false });

async function checkWebsite() {
  try {
    // Step 1: Check if the website is loading correctly
    const websiteResponse = await axios.get(
      "https://skyjumpertrampolinepark.com/"
    );
    const istDate = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    if (
      websiteResponse.status === 200 &&
      websiteResponse.data.includes('<select id="selform" class="selLocation">')
    ) {
      // Step 2: Perform actions after confirming the website is loading correctly
      const browser = await puppeteer.launch({
        args: [
          "--disable-setuid-sandbox",
          "--no-sandbox",
          "--single-process",
          "--no-zygote",
        ],
        executablePath:
          process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
      });
      const page = await browser.newPage();

      // Replace 'OPTION_VALUE' with the value of the option you want to select
      await page.goto("https://skyjumpertrampolinepark.com/");
      await page.waitForSelector("#selform");
      await page.select("#selform", "ahmedabad60");

      let consoleMessages = [];
      page.on("console", (message) => {
        consoleMessages.push(message.text());
        console.log(`Message: ${message.text()}`);
      });
      function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      await delay(40000);
      await browser.close();

      // Process console messages and send Telegram notification
      const popupLoadTimeMatch = consoleMessages
      .map(message => message.match(/TuriTop Calendar Load Time: (\d+(\.\d+)?)s/))
      .filter(match => match);
      
      const popupLoadTime = popupLoadTimeMatch.length > 0 ? parseFloat(popupLoadTimeMatch[0][1]) : null;

      if (popupLoadTime) {
let msg = `
[+] Report [+]

Website Health     :   200    ✅ 
TuriTop popup       :   UP     ✅
Popup Load Time : ${popupLoadTime}s  🕰
Checkup Time       :   ${istDate}
`;
        telegramBot.sendMessage(chatId, msg);
      } else {
        // Popup did not work, send error message to Telegram
let msg = `
[⚠️] Alert [⚠️]

Website Health     :   200    ✅ 
TuriTop popup       :   DOWN    ❌
Checkup Time       :   ${istDate}

Website works, turitop is down!
`;
        telegramBot.sendMessage(chatId, msg);
      }
    } else {
      // Website not loading correctly, send error message to Telegram
let msg = `
[⚠️] Alert [⚠️]

Website Health     :   404    ❌ 
URL -> https://skyjumpertrampolinepark.com/
Checkup Time       :   ${istDate}

Website is down, take immediate action!
`;
      telegramBot.sendMessage(chatId, msg);
    }
  } catch (error) {
    // Handle any errors and send error message to Telegram
    telegramBot.sendMessage(chatId, `Error: ${error.message}`);
  }
}

function getRandomInterval() {
  // Generate a random multiplier between 0 and 1
  const randomMultiplier = Math.random();
  
  // Calculate the interval between 1 and 2 hours
  const minInterval = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
  const maxInterval = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  const randomInterval = minInterval + randomMultiplier * (maxInterval - minInterval);

  return randomInterval;
}

// Initial call
checkWebsite();

// Set a random interval between 1 and 2 hours
setInterval(() => {
  checkWebsite();
}, getRandomInterval());