import { Client, ColorResolvable, MessageEmbed, TextChannel } from "discord.js";
import config from "../../config";
import ChatLogInfo from "../../types/monitor/chatLogInfo";

const sendChatlogMessage =
  (discordClient: Client) =>
  (info: ChatLogInfo): void => {
    const channel = discordClient.channels.cache.get(
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

export default sendChatlogMessage;
