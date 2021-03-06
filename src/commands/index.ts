import { Message } from "discord.js";
import { ifElse } from "ramda";
import * as Discord from "../discord";
import { Log } from "../logging";
import { deleteTriggerMessage } from "../messages";
import shouldProcess from "./preProcessing/shouldProcess";
import getCommand from "./preProcessing/getCommand";
import initBlacklistCommands from "./blacklist";

const initCommands = async () => {
  Log.debug("Initiating command handlers...");
  const client = Discord.getClient();
  await Discord.fetchGuild();

  await initBlacklistCommands();

  client.on(
    "messageCreate",
    ifElse(shouldProcess, handleMessage, () => {})
  );

  Log.debug("Command handlers initiated!");
};

const handleMessage = (message: Message) => {
  const command: ((m: Message) => void) | undefined = getCommand(message);

  if (command) {
    command(message);
    deleteTriggerMessage(message);
  }
};

export default initCommands;
