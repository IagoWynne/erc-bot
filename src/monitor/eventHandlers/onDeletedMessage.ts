import { Message, PartialMessage, User, Util } from "discord.js";
import { compose } from "ramda";
import config from "../../config";
import { Log } from "../../logging";
import LogChannelMessage from "../../types/monitor/LogChannelMessage";
import {
  addAuthorTagAndId,
  addChannelName,
  addDeletedBy,
  addMessageAttachments,
} from "../chatLog/formatMessages";
import getChannelName from "../../messages/getChannelName";
import getUserName from "../../messages/getUserName";
import getUserTag from "../chatLog/getUserTag";
import { sendMessageToLogChannel } from "../../messages";
import * as Discord from "../../discord";

const getUserWhoDeletedMessage = async (
  message: Message | PartialMessage
): Promise<string> => {
  if (Discord.isBotDeletedMessage(message.id)) {
    Discord.removeDeletedMessageId(message.id);
    return "ERC Bot";
  }

  await Util.delayFor(900);
  try {
    Log.debug("Fetching audit logs...");
    const fetchedLogs = await message.guild?.fetchAuditLogs({
      limit: 6,
      type: "MESSAGE_DELETE",
    });

    const auditEntry = fetchedLogs?.entries.find(
      (a) =>
        (a.target as User).id === message.author?.id &&
        (a.extra as any).channel.id === message.channel.id &&
        Date.now() - a.createdTimestamp < 20000
    );

    if (auditEntry) {
      return auditEntry.executor
        ? `${auditEntry.executor.tag} - ${auditEntry.executor.id}`
        : "Unknown - probably other user";
    }
  } catch (e) {
    Log.error(e);
    return "Unknown - error retrieving Discord Audit Logs";
  }

  return "Unknown - probably self-deleted";
};

const handleDeletedMessage = async (
  message: Message | PartialMessage
): Promise<LogChannelMessage> => {
  const author = getUserName(message.member, message.author);
  const channelName = getChannelName(message);
  const authorTag = getUserTag(message.author);
  const executor = await getUserWhoDeletedMessage(message);

  Log.debug(
    `Message from ${author} (${
      authorTag || "could not retrieve tag"
    }) in ${channelName} deleted by ${executor}: ${message.content}`
  );

  const logChannelMessage = {
    author: {
      name: author,
      iconURL: message.author?.avatarURL() || undefined,
    },
    title: "Message Deleted",
    colour: config.discord.logColours.messageDeleted,
    description: compose(
      addChannelName(channelName),
      addDeletedBy(executor),
      addAuthorTagAndId(message)
    )(""),
    content: message.content || undefined,
  };

  return addMessageAttachments(message)(logChannelMessage);
};

const shouldLogDeletion = (message: Message | PartialMessage): boolean =>
  !Discord.isMessagePurged(message.channel.id, message.id);

const onDeletedMessage = async (message: Message | PartialMessage) => {
  if (shouldLogDeletion(message)) {
    const logChannelMessage = await handleDeletedMessage(message);
    sendMessageToLogChannel(logChannelMessage);
  }
};

export default onDeletedMessage;
