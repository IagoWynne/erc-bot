import * as Discord from "../../discord";
import config from "../../config";
import { Message } from "discord.js";

const shouldProcess = (message: Message): boolean =>
  message.channel.id !== config.discord.logChannelId &&
  message.author?.id !== Discord.getClient().user?.id;

export default shouldProcess;
