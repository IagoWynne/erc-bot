import { Client } from "discord.js";
import config from "./config";
import { setupLogging, Log } from "./logging";

setupLogging();

const client = new Client();

client.on("ready", () => {
  Log.debug(`Logged in as ${client.user?.username}`);
});

client.login(config.discord.token);
