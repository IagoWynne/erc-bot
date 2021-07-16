import { Client } from "discord.js";
import initCommands from "./commands";
import config from "./config";
import { initLogging, Log } from "./logging";
import initMonitor from "./monitor";

initLogging();

Log.info("Starting bot...");

const client = new Client();

client.on("ready", () => {
  Log.debug(`Logged in as ${client.user?.username}`);

  initMonitor(client);
  initCommands(client);

  Log.info("Bot started. Press Ctrl+C to terminate.");
});

client.login(config.discord.token);
