// Import required modules
const { Client } = require("@notionhq/client");

// Initialize the Notion client
const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

// Define the database ID
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Define the serverless function
module.exports = async (req, res) => {
  // Check if the request method is POST
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // Get the incoming message from the request body
  const msg = req.body.message;

  // Check if the message is valid
  if (!msg || !msg.text) {
    res.status(400).send('Bad Request');
    return;
  }

  // Check if the message starts with "/echo"
  if (msg.text.startsWith('/echo')) {
    const resp = msg.text.slice(6); // Extract the text after "/echo "
    res.json({ method: 'sendMessage', chat_id: msg.chat.id, text: resp });
    return;
  }

  // Add the message to the Notion database
  try {
    await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: DATABASE_ID,
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
    res.json({ method: 'sendMessage', chat_id: msg.chat.id, text: 'Received your message' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

