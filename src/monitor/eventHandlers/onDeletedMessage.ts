import { Message, PartialMessage } from "discord.js";
import { compose } from "ramda";
import config from "../../config";
import { Log } from "../../logging";
import ChatLogInfo from "../../types/monitor/chatLogInfo";
import {
  addAuthorTag,
  addChannelName,
  makeBold,
} from "../chatLog/formatMessages";
import getChannelName from "../../messages/getChannelName";
import getUserName from "../../messages/getUserName";
import getUserTag from "../chatLog/getUserTag";
import sendChatlogMessage from "../chatLog/sendChatLogMessage";

const handleDeletedMessage = (
  message: Message | PartialMessage
): ChatLogInfo => {
  const author = getUserName(message.member, message.author);
  const channelName = getChannelName(message);
  const authorTag = getUserTag(message.author);

  Log.debug(
    `Message from ${author} (${
      authorTag || "could not retrieve tag"
    }) in ${channelName} deleted: ${message.content}`
  );

  return {
    author: {
      name: author,
      iconURL: message.author?.avatarURL() || undefined,
    },
    colour: config.discord.logColours.messageDeleted,
    description: compose(
      addAuthorTag(message),
      addChannelName(channelName),
      makeBold
    )("Message Deleted"),
    content: message.content || undefined,
  };
};

const onDeletedMessage = compose(sendChatlogMessage, handleDeletedMessage);

export default onDeletedMessage;
