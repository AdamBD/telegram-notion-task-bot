const TelegramBot = require("node-telegram-bot-api");

// replace the value below with the Telegram token you receive from @BotFather
const token = "1793527718:AAFxYwVXfEBvx5dAPzkLwoF2HKNxP4zgmN0";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {
  polling: true,
});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on("message", (msg) => {
  // send a message to the chat acknowledging receipt of their message

  bot.sendMessage(msg.chat.id, "Received your message");

  const { Client } = require("@notionhq/client");

  const notion = new Client({
    auth: process.env.secret,
  });

  console.log("Made it here");
  (async () => {
    const response = await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: "c7157abe0cf949d7a19cb9e7dd5f35d5",
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: msg.text,
              },
            },
          ],
        },
      },
    });
    console.log(response);
  })();
});
