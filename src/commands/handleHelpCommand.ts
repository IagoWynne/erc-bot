import { Message } from "discord.js";
import config from "../config";
import { Log } from "../logging";
import * as Discord from "../discord";
import { sendDmToUser } from "../messages";

const handleHelpCommand = async (message: Message) => {
  const user = await Discord.findUser(message.author.id);

  if (!user) {
    Log.warn(
      `Help command failed: could not find user with id ${message.author.id}`
    );

    return;
  }

  sendDmToUser(message.author, config.commands.helpMessage);
};

export default handleHelpCommand;
