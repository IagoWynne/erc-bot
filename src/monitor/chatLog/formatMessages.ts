import { Message, PartialMessage } from "discord.js";

const makeBold = (content: string): string => `**${content}**`;

const addChannelName =
  (channelName: string) =>
  (content: string): string =>
    `${content} ${channelName}`;

const addAuthorTag =
  (message: Message | PartialMessage) =>
  (content: string): string =>
    message.author ? `${content} - ${message.author.tag}` : content;

const addMessageUrl =
  (message: Message | PartialMessage) =>
  (content: string): string =>
    message.channel.type !== "dm" ? `${content} (${message.url})` : content;

export { makeBold, addChannelName, addAuthorTag, addMessageUrl };
