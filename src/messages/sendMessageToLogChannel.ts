import { MessageEmbed, TextChannel } from "discord.js";
import * as Discord from "../discord";
import config from "../config";
import LogChannelMessage from "../types/monitor/LogChannelMessage";

const sendMessageToLogChannel = (info: LogChannelMessage): void => {
  const channel = Discord.getClient().channels.cache.get(
    config.discord.logChannelId
  ) as TextChannel;

  const messageEmbed = new MessageEmbed({
    title: info.title,
    description: info.description,
    author: info.author,
    color: info.colour,
    url: info.url,
    timestamp: Date.now(),
  });

  if (info.content) {
    messageEmbed.addField("Content", info.content);
  }

  if (info.attachmentUrls) {
    messageEmbed.addField("Attachments", info.attachmentUrls.join("\n"));
  }

  channel.send(messageEmbed);
};

const getTimeStamp = () => `<t:${Math.floor(Date.now() / 1000)}>`;

export default sendMessageToLogChannel;
