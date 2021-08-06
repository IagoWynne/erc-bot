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

  sendDmToUser(message.author, config.commands.helpMessage, {
    author: {
      name: "ERC Bot",
    },
    colour: config.discord.logColours.commandUsed,
    title: "Command Executed",
    description: `\`.help\` command executed successfully.\n${message.author.tag} - ${message.author.id}`,
  });
};

export default handleHelpCommand;
