import { Message, PartialMessage } from "discord.js";
import LogChannelMessage from "../../types/monitor/LogChannelMessage";

const makeBold = (content: string): string => `**${content}**`;

const addChannelName =
  (channelName: string) =>
  (content: string): string =>
    `${content}\n${channelName}`;

const addAuthorTagAndId =
  (message: Message | PartialMessage) =>
  (content: string): string =>
    message.author
      ? `${content} ${message.author.tag} - ${message.author.id}`
      : content;

const addMessageUrl =
  (message: Message | PartialMessage) =>
  (logChannelMessage: LogChannelMessage): LogChannelMessage =>
    message.channel.type !== "dm"
      ? { ...logChannelMessage, url: message.url }
      : { ...logChannelMessage };

const addMessageAttachments =
  (message: Message | PartialMessage) =>
  (logMessage: LogChannelMessage): LogChannelMessage =>
    message.attachments.size > 0
      ? {
          ...logMessage,
          attachmentUrls: message.attachments.map(
            (attachment) => attachment.url
          ),
        }
      : { ...logMessage };

export {
  makeBold,
  addChannelName,
  addAuthorTagAndId,
  addMessageUrl,
  addMessageAttachments,
};
