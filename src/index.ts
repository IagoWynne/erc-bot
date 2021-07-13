import { Client } from "discord.js";
import config from "./config";
import { initLogging, Log } from "./logging";
import initMonitor from "./monitor";

initLogging();

const client = new Client();

initMonitor(client);

client.on("ready", () => {
  Log.debug(`Logged in as ${client.user?.username}`);
});

client.login(config.discord.token);
