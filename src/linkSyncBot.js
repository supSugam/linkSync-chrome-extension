import TelegramBot from 'node-telegram-bot-api';

// Replace <YOUR_BOT_TOKEN> with your actual bot token
const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
// Create a new bot instance
const bot = new TelegramBot(botToken, { polling: true });

// Handle the /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.chat.first_name;
  const replyMessage = `
Congrats, ${firstName}! 👋 You have successfully subscribed to LinkSync+  💚

You are now ready to share links and messages with just a single tap ✨

Here's the one time setup process 🙋‍♂️

👉 Install LinkSync+ Chrome Extension
👉 Enter Your Telegram Username
👉 Tap on the share button to share links or messages 🌨️
👉 View them Right Here 📱

Something's wrong? DM @IdebuSug 💢
  `
  bot.sendMessage(chatId, replyMessage);
});

// Start listening for incoming messages
bot.on('message', (msg) => {
  if(msg.text !== '/start') {
    bot.sendMessage(msg.chat.id, `Sorry, ${msg.chat.first_name}! But the current version of LinkSync+ only supports sharing links and messages from the Chrome Extension to Telegram, not the other way around.

Stay tuned for updates! 🙌`);
  }
});
