import { Message } from "discord.js";
import { ifElse } from "ramda";
import * as Discord from "../discord";
import { Log } from "../logging";
import { deleteTriggerMessage } from "./messages";
import shouldProcess from "./preProcessing/shouldProcess";
import getCommand from "./preProcessing/getCommand";

const initCommands = async () => {
  Log.debug("Initialising command handlers...");
  const client = Discord.getClient();
  await Discord.fetchGuild();

  client.on(
    "message",
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
