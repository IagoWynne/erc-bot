import { Client } from "discord.js";
import { DISCORD } from "./constants/env";
import { setupLogging, Log } from "./logging";

setupLogging();

const client = new Client();

client.on("ready", () => {
  Log.debug(`Logged in as ${client.user?.username}`);
});

client.login(DISCORD.TOKEN);
