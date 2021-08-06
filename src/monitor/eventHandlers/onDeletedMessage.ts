import { Message, PartialMessage } from "discord.js";
import { compose, ifElse } from "ramda";
import config from "../../config";
import { Log } from "../../logging";
import LogChannelMessage from "../../types/monitor/LogChannelMessage";
import {
  addAuthorTagAndId,
  addChannelName,
  addMessageAttachments,
} from "../chatLog/formatMessages";
import getChannelName from "../../messages/getChannelName";
import getUserName from "../../messages/getUserName";
import getUserTag from "../chatLog/getUserTag";
import { sendMessageToLogChannel } from "../../messages";
import { isChannelBeingPurged } from "../../purge";

const handleDeletedMessage = (
  message: Message | PartialMessage
): LogChannelMessage => {
  const author = getUserName(message.member, message.author);
  const channelName = getChannelName(message);
  const authorTag = getUserTag(message.author);

  Log.debug(
    `Message from ${author} (${
      authorTag || "could not retrieve tag"
    }) in ${channelName} deleted: ${message.content}`
  );

  const logChannelMessage = {
    author: {
      name: author,
      iconURL: message.author?.avatarURL() || undefined,
    },
    title: "Message Deleted",
    colour: config.discord.logColours.messageDeleted,
    description: compose(
      addChannelName(channelName),
      addAuthorTagAndId(message)
    )(""),
    content: message.content || undefined,
  };

  return addMessageAttachments(message)(logChannelMessage);
};

const shouldLogDeletion = (message: Message | PartialMessage): boolean =>
  !isChannelBeingPurged(message.channel.id);

const onDeletedMessage = ifElse(
  shouldLogDeletion,
  compose(sendMessageToLogChannel, handleDeletedMessage),
  () => {}
);

export default onDeletedMessage;
