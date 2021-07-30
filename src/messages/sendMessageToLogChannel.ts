import { MessageEmbed, TextChannel } from "discord.js";
import * as Discord from "../discord";
import config from "../config";
import LogChannelMessage from "../types/monitor/LogChannelMessage";

const sendMessageToLogChannel = (info: LogChannelMessage): void => {
  const channel = Discord.getClient().channels.cache.get(
    config.discord.logChannelId
  ) as TextChannel;

  channel.send(`${getTimeStamp()} ${info.description}`);

  if (info.content) {
    const messageEmbed = new MessageEmbed({
      description: info.content,
      author: info.author,
      color: info.colour,
    });

    channel.send(messageEmbed);
  }
};

const getTimeStamp = () => `<t:${Math.floor(Date.now() / 1000)}>`;

export default sendMessageToLogChannel;
