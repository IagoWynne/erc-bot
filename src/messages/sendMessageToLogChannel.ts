import { MessageEmbed, TextChannel } from "discord.js";
import * as Discord from "../discord";
import config from "../config";
import LogChannelMessage from "../types/monitor/LogChannelMessage";
import { splitEvery } from "ramda";

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

  if (info.content && info.content.length < 1024) {
    messageEmbed.addField("Content", info.content);
  } else if (info.content) {
    const fields = splitEvery(1000, info.content);

    fields.forEach((f: string, idx: number) =>
      messageEmbed.addField(`Content ${idx + 1}`, f)
    );
  }

  if (info.attachmentUrls) {
    messageEmbed.addField("Attachments", info.attachmentUrls.join("\n"));
  }

  channel.send({ embeds: [messageEmbed] });

  if (info.alertAdmin) {
    channel.send(`<@&${config.discord.adminRoleId}>`);
  }
};

export default sendMessageToLogChannel;
