const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from the keep-alive server!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



const axios = require("axios");
const puppeteer = require("puppeteer");
const TelegramBot = require("node-telegram-bot-api");

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' and 'YOUR_CHAT_ID' with your actual Telegram bot token and chat ID
const botToken = "6766661829:AAFjucZOvcM-eMgyLQjIkgvX_cHBv4mgWPc";
const chatId = "558902547";
const telegramBot = new TelegramBot(botToken, {
    polling: false
});

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
                // headless: false,
                executablePath:
                  process.env.NODE_ENV === "production"
                    ? process.env.PUPPETEER_EXECUTABLE_PATH
                    : puppeteer.executablePath(),
            });
            const page = await browser.newPage();

            // Replace 'OPTION_VALUE' with the value of the option you want to select
            await page.goto("https://skyjumpertrampolinepark.com/", {
                timeout: 300000,
            });
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
            await delay(50000);



            // Process console messages and send Telegram notification
            const popupLoadTimeMatch = consoleMessages
                .map((message) =>
                    message.match(/TuriTop Calendar Load Time: (\d+(\.\d+)?)s/)
                )
                .filter((match) => match);

            const popupLoadTime =
                popupLoadTimeMatch.length > 0 ?
                parseFloat(popupLoadTimeMatch[0][1]) :
                null;

            if (popupLoadTime) {


                await page.waitForSelector(".ui-datepicker-next", {
                    timeout: 60000
                });

                // Click the "Next" button
                await page.click(".ui-datepicker-next");
                console.log("Message: Next Month selected, waiting....")
                await delay(30000);

                // Click on the specific date element (e.g., data-date="20")
                await page.click('a.ui-state-default[data-date="20"]');
                console.log("Message: Date selected, waiting....")

                await page.waitForSelector(
                    ".turitop_booking_system_times.turitop_booking_system_times_classic", {
                      timeout: 60000
                  }
                );

                await page.click(
                    ".turitop_booking_system_times.turitop_booking_system_times_classic span:nth-child(4)"
                );
                console.log("Message: Time selected, waiting....")
                await delay(20000);

                await page.click(
                    ".turitop_booking_system_button_event.lightbox-button-turitop-wc.lightbox-button-turitop-wc-calendar-classic"
                );
                console.log("Message: Clicked on booking, waiting....")


                // Wait for navigation to the new page
                // const newPagePromise = new Promise((resolve) => browser.once('targetcreated', target => resolve(target.page())));
                // await Promise.all([page.click('.turitop_booking_system_button_event.lightbox-button-turitop-wc.lightbox-button-turitop-wc-calendar-classic'), newPagePromise]);

                await page.waitForSelector("#billing_first_name", {
                  timeout: 60000
              });
                console.log("Message: Billing page loaded, filling details now....")

                await delay(5000);

                // Fill out the form
                await page.type("#billing_first_name", "SKYJUMPER");
                await page.type("#billing_last_name", "BOT");
                await page.type("#billing_address_1", "Bot street, ABK, Thane");
                await page.type("#billing_address_2", "Kolshet");
                await page.type("#billing_city", "Quantastic");
                await page.select("#billing_state", "MH");
                await page.type("#billing_postcode", "686868");
                await page.type("#billing_email", "prashik@quantastic.in");
                await page.click("#terms");
                await delay(5000);
                await page.type("#billing_phone", "+918281288271");
                await delay(5000);
                await page.click("#terms");
                await delay(5000);
                await page.click("#place_order");
                
                console.log("Message: Order placed, redirecting....")

                await delay(30000);

                // const errorMessageSelector = 'ul.woocommerce-error li';
                // await page.waitForSelector(errorMessageSelector);
              
                // // Extract and log the text content of the error message element
                // const errorMessage = await page.$eval(errorMessageSelector, (element) => {
                //   return element.textContent.trim();
                // });

              
                // console.log('Error message:', errorMessage);

                console.log("Message: Currently on: " + page.url())
                await page.waitForNavigation({
                  timeout: 300000
                });
                await page.waitForSelector('#header-merchant-name',{
                  timeout: 300000
              });

                console.log("Message: Currently on: " + page.url())
                await delay(30000);
                console.log("Message: Currently on: " + page.url())
                const currentUrl = page.url();
                console.log("Message: Currently on: " + page.url())
                if (currentUrl.includes('mercury-t2.phonepe.com')) {
                console.log("Message: Gateway reached, going to sleep....")
                console.log("++++++++++++++++++++++++++++++++++++++++++++++++")


                    // Set the variable gway to true
                    let msg = `
[+] Report V2[+]

Website Health     :   200    ✅ 
TuriTop popup       :   UP     ✅
Popup Load Time : ${popupLoadTime}s  🕰
Checkup Time       :   ${istDate}
PhonePe Gateway :   Works  ✅

The flow is completely healthy!
`;
                    await browser.close();
                    telegramBot.sendMessage(chatId, msg);
                } else if (!currentUrl.includes('mercury-t2.phonepe.com')){
                    let msg = `
[+] Report V2[+]

Website Health     :   200    ✅ 
TuriTop popup       :   UP     ✅
Popup Load Time : ${popupLoadTime}s  🕰
Checkup Time       :   ${istDate}
PhonePe Gateway    : Not reached ❗️

There might be some error in placing an order!
`;
await browser.close();
                telegramBot.sendMessage(chatId, msg);
                }
            } else {
                // Popup did not work, send error message to Telegram
                let msg = `
[⚠️] Alert V2[⚠️]

Website Health     :   200    ✅ 
TuriTop popup       :   DOWN    ❌
Checkup Time       :   ${istDate}

Website works, turitop is down!
`;
await browser.close();
                telegramBot.sendMessage(chatId, msg);
            }
        } else {
            // Website not loading correctly, send error message to Telegram
            let msg = `
[⚠️] Alert V2[⚠️]

Website Health     :   404    ❌ 
URL -> https://skyjumpertrampolinepark.com/
Checkup Time       :   ${istDate}

Website is down, take immediate action!
`;
await browser.close();
            telegramBot.sendMessage(chatId, msg);
        }
    } catch (error) {
        // Handle any errors and send error message to Telegram
        // await browser.close();
        telegramBot.sendMessage(chatId, `Error: ${error.message}`);
    }
}

function getRandomInterval() {
    // Generate a random multiplier between 0 and 1
    const randomMultiplier = Math.random();

    // Calculate the interval between 1 and 2 hours
    const minInterval = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
    const maxInterval = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    const randomInterval =
        minInterval + randomMultiplier * (maxInterval - minInterval);

    return randomInterval;
}

// Initial call
checkWebsite();

// Set a random interval between 1 and 2 hours
setInterval(() => {
  checkWebsite();
}, getRandomInterval());