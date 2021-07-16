import { Client } from "discord.js";
import config from "./config";
import { initLogging, Log } from "./logging";
import initMonitor from "./monitor";

Log.info("Starting bot...");

initLogging();

const client = new Client();

client.on("ready", () => {
  Log.debug(`Logged in as ${client.user?.username}`);
  Log.info("Bot started. Press Ctrl+C to terminate.");

  initMonitor(client);
});

client.login(config.discord.token);
