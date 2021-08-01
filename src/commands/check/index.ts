import { Message } from "discord.js";
import { match } from "ramda";
import { getMessageCharacters } from "../../messages/hasBrokenRules";
import getCommandContent from "../getCommandContent";
import { sendDmToUser } from "../../messages";
import {
  addAllChannelDetailsToReply,
  constructInitialReplyMessage,
} from "./checkReplyConstruction";

const handleCheckCommand = async (message: Message) => {
  const advert = getCommandContent(message.content);

  const messageContent = getMessageCharacters(advert);
  const totalChars = messageContent.length;
  const newLines = match(/\n/g, advert).length;

  let reply = constructInitialReplyMessage(totalChars, newLines);
  reply = addAllChannelDetailsToReply(advert, reply);

  await sendDmToUser(message.author, reply);
};

export default handleCheckCommand;
