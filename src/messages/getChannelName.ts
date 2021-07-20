import { Message, PartialMessage } from "discord.js";
import * as Discord from "../discord";

const getChannelName = (message: Message | PartialMessage): string => {
  if (message.channel.type === "dm") {
    return "DM";
  }

  const guild = Discord.getGuild();

  const channel = guild.channels.cache.get(message.channel.id);

  return `#${channel?.name}` || "Unidentified channel";
};

export default getChannelName;
