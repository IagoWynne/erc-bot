import { Message } from "discord.js";
import { match } from "ramda";
import { getMessageCharacters } from "../../messages/hasBrokenRules";
import getCommandContent from "../getCommandContent";
import { sendDmToUser } from "../../messages";
import {
  addAllChannelDetailsToReply,
  constructInitialReplyMessage,
} from "./checkReplyConstruction";
import config from "../../config";

const handleCheckCommand = async (message: Message) => {
  const advert = getCommandContent(message.content);

  const messageContent = getMessageCharacters(advert);
  const totalChars = messageContent.length;
  const newLines = match(/\n/g, advert).length;

  let reply = constructInitialReplyMessage(totalChars, newLines);
  reply = addAllChannelDetailsToReply(advert, reply);

  await sendDmToUser(message.author, reply, {
    author: {
      name: "ERC Bot",
    },
    colour: config.discord.logColours.commandUsed,
    title: "Command Executed",
    description: `\`.check\` command executed successfully.\n${message.author.tag} - ${message.author.id}`,
  });
};

export default handleCheckCommand;
