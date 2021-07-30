import { Message, PartialMessage } from "discord.js";
import { compose } from "ramda";
import config from "../../config";
import { Log } from "../../logging";
import LogChannelMessage from "../../types/monitor/LogChannelMessage";
import {
  addMessageUrl,
  addAuthorTag,
  addChannelName,
  makeBold,
} from "../chatLog/formatMessages";
import getChannelName from "../../messages/getChannelName";
import getUserName from "../../messages/getUserName";
import getUserTag from "../chatLog/getUserTag";
import { sendMessageToLogChannel } from "../../messages";

const handleUpdatedMessage = (
  message: Message | PartialMessage
): LogChannelMessage => {
  const updatedMessage = message.channel.messages.cache.get(message.id);

  const author = getUserName(message.member, message.author);
  const channelName = getChannelName(message);
  const authorTag = getUserTag(message.author);

  Log.debug(
    `Message from ${author} (${
      authorTag || "could not retrieve tag"
    }) in ${channelName} edited to: ${updatedMessage?.content}`
  );

  return {
    author: {
      name: author,
      iconURL: message.author?.avatarURL() || undefined,
    },
    colour: config.discord.logColours.messageUpdated,
    description: compose(
      addMessageUrl(message),
      addAuthorTag(message),
      addChannelName(channelName),
      makeBold
    )("Message Edited"),
    content: updatedMessage?.content || undefined,
  };
};

const onUpdatedMessage = compose(sendMessageToLogChannel, handleUpdatedMessage);

export default onUpdatedMessage;
