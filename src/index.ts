import initCommands from "./commands";
import * as Discord from "./discord";
import { initLogging, Log } from "./logging";
import initMonitor from "./monitor";

initLogging();

Log.info("Starting bot...");

const client = Discord.getClient();

client.on("ready", () => {
  Log.debug(`Logged in as ${client.user?.username}`);

  initMonitor();
  initCommands(client);

  Log.info("Bot started. Press Ctrl+C to terminate.");
});

Discord.login();
