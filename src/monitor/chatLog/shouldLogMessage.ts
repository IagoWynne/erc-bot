import { Message, PartialMessage } from "discord.js";
import { isEmpty } from "ramda";
import config from "../../config";
import * as Discord from "../../discord";

const shouldLogMessage = (message: Message | PartialMessage): boolean =>
  message.channel.id !== config.discord.logChannelId &&
  message.author?.id !== Discord.getClient().user?.id &&
  !isEmpty(message.content);

export default shouldLogMessage;
