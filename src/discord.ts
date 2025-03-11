import dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits } from "discord.js";
import process from "node:process";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
});

client.login(process.env.DISCORD_TOKEN);

client.on("messageCreate", async (message) => {
  console.log(message);

  if (!message?.author.bot) {
    await message.author.send(`Echo ${message.content}`);
  }
});
