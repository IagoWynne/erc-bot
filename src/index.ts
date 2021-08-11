import initCommands from "./commands";
import * as Discord from "./discord";
import { initLogging, Log } from "./logging";
import initMonitor from "./monitor";
import initPurge from "./purge";
import initThrottling from "./throttling";
import initWelcomeMessage from "./welcome";

initLogging();

Log.info("Starting bot...");

const client = Discord.getClient();

client.on("ready", async () => {
  Log.debug(`Logged in as ${client.user?.username}`);

  await initMonitor();
  await initCommands();
  initPurge();
  initThrottling();
  await initWelcomeMessage();

  Log.info("Bot started. Press Ctrl+C to terminate.");
});

Discord.login();
