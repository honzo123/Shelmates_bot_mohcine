import { Client, GatewayIntentBits, Message } from 'discord.js';
import Bot from './lib/bot';
import dotenv from "dotenv";
import initDB from './db';
import scheduleCommand from './commands/schedule';
//import scheduleCommand from './commands/schedule'; // the exoprted function



dotenv.config();
//initDB();

export const bot = new Bot(
  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      // GatewayIntentBits.GuildMembers,
      // GatewayIntentBits.GuildMessageReactions,
      // GatewayIntentBits.DirectMessages
    ]
  })
)
bot.client.on('messageCreate', async (message: Message) => {
  // Check if the message starts with !schedule
  if (message.content.startsWith('!schedule')) {
    await scheduleCommand(message); // Call the schedule command
  }
});

// Log in to Discord with your bot token
bot.client.login(process.env.TOKEN);
;





