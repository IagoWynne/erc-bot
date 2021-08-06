import { Message, PartialMessage } from "discord.js";
import { compose } from "ramda";
import config from "../../config";
import { Log } from "../../logging";
import LogChannelMessage from "../../types/monitor/LogChannelMessage";
import {
  addMessageUrl,
  addAuthorTagAndId,
  addChannelName,
  addMessageAttachments,
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

  const logChannelMessage = {
    author: {
      name: author,
      iconURL: message.author?.avatarURL() || undefined,
    },
    title: "Message Edited",
    colour: config.discord.logColours.messageUpdated,
    description: compose(
      addChannelName(channelName),
      addAuthorTagAndId(message)
    )(""),
    content: updatedMessage?.content || undefined,
  };

  return compose(
    addMessageUrl(message),
    addMessageAttachments(message)
  )(logChannelMessage);
};

const onUpdatedMessage = compose(sendMessageToLogChannel, handleUpdatedMessage);

export default onUpdatedMessage;
