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

const handleCreatedMessage = (
  message: Message | PartialMessage
): LogChannelMessage => {
  Log.debug("Detected new message");
  const author = getUserName(message.member, message.author);
  const channelName = getChannelName(message);

  Log.debug(
    `New message from ${author} (${getUserTag(
      message.author
    )}) in ${channelName}: ${message.content}`
  );

  const logChannelMessage = {
    author: {
      name: author,
      iconURL: message.author?.avatarURL() || undefined,
    },
    title: "New Message",
    colour: config.discord.logColours.messageCreated,
    description: compose(
      addChannelName(channelName),
      addAuthorTagAndId(message)
    )(""),
    content: message.content!,
  };

  return compose(
    addMessageUrl(message),
    addMessageAttachments(message)
  )(logChannelMessage);
};

const onCreatedMessage = compose(sendMessageToLogChannel, handleCreatedMessage);

export default onCreatedMessage;
