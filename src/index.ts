import { Client, GatewayIntentBits } from 'discord.js';
import Bot from './lib/bot';
import dotenv from "dotenv";
import initDB from './db';



dotenv.config();
initDB();

export const bot = new Bot(
  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      // GatewayIntentBits.MessageContent,
      // GatewayIntentBits.GuildMembers,
      // GatewayIntentBits.GuildMessageReactions,
      // GatewayIntentBits.DirectMessages
    ]
  })
);





