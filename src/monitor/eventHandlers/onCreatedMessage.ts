import { Message, PartialMessage } from "discord.js";
import { compose } from "ramda";
import config from "../../config";
import { Log } from "../../logging";
import ChatLogInfo from "../../types/monitor/chatLogInfo";
import {
  addMessageUrl,
  addAuthorTag,
  addChannelName,
  makeBold,
} from "../chatLog/formatMessages";
import getChannelName from "../../messages/getChannelName";
import getUserName from "../../messages/getUserName";
import getUserTag from "../chatLog/getUserTag";
import sendChatlogMessage from "../chatLog/sendChatLogMessage";

const handleCreatedMessage = (
  message: Message | PartialMessage
): ChatLogInfo => {
  const author = getUserName(message.member, message.author);
  const channelName = getChannelName(message);

  Log.debug(
    `New message from ${author} (${getUserTag(
      message.author
    )}) in ${channelName}: ${message.content}`
  );

  return {
    author: {
      name: author,
      iconURL: message.author?.avatarURL() || undefined,
    },
    colour: config.discord.logColours.messageCreated,
    description: compose(
      addMessageUrl(message),
      addAuthorTag(message),
      addChannelName(channelName),
      makeBold
    )("New Message"),
    content: message.content!,
  };
};

const onCreatedMessage = compose(sendChatlogMessage, handleCreatedMessage);

export default onCreatedMessage;
