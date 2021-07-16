import {
  Client,
  Guild,
  GuildChannel,
  GuildMember,
  Message,
  PartialGuildMember,
  PartialMessage,
  User,
} from "discord.js";
import { compose, isEmpty } from "ramda";
import config from "../config";
import { Log } from "../logging";
import sendChatlogMessage from "./chatLog/sendChatLogMessage";
import {
  makeBold,
  addChannelName,
  addAuthorTag,
  addMessageUrl,
} from "./chatLog/formatMessages";
import ChatLogInfo from "../types/monitor/chatLogInfo";

let discordClient: Client;
let guild: Guild;

const initMonitor = (client: Client) => {
  Log.debug("Initiating monitor");

  discordClient = client;
  fetchGuild();

  setupListeners();

  Log.debug("Monitor intiated");
};

const fetchGuild = () => {
  discordClient.guilds.fetch(config.discord.guildId);

  const clientGuild = discordClient.guilds.cache.get(config.discord.guildId);
  if (!clientGuild) {
    Log.error(new Error("Could not get guild from ID"));
  } else {
    guild = clientGuild;
  }

  guild.members.fetch();

  guild.channels.cache.forEach((channel: GuildChannel) => {
    channel.fetch();
  });
};

const setupListeners = () => {
  const logMessage = sendChatlogMessage(discordClient);

  discordClient.on("message", onMessageEvent(logMessage, handleCreatedMessage));
  discordClient.on(
    "messageDelete",
    onMessageEvent(logMessage, handleDeletedMessage)
  );
  discordClient.on(
    "messageUpdate",
    onMessageEvent(logMessage, handleUpdatedMessage)
  );
  discordClient.on("guildMemberAdd", compose(logMessage, handleJoinedServer));
  discordClient.on("guildMemberRemove", compose(logMessage, handleLeftServer));
};

//todo: refactor all this stuff into separate files for each event type

const onMessageEvent =
  (
    messageEventLogger: (info: ChatLogInfo) => void,
    messageEventHandler: (message: Message | PartialMessage) => ChatLogInfo
  ) =>
  (message: Message | PartialMessage) =>
    shouldLogMessage(message)
      ? compose(messageEventLogger, messageEventHandler)(message)
      : null;

const handleJoinedServer = (member: GuildMember): ChatLogInfo => {
  const memberUsername = getUserName(member, member.user);

  Log.debug(`New Member: ${memberUsername} (${member.user.tag})`);

  return {
    author: {
      name: memberUsername,
      iconURL: member.user.avatarURL() || undefined,
    },
    colour: config.discord.logColours.userJoined,
    description: makeBold("User Joined"),
    content: `ID: ${member.user.id}\nTag: ${member.user.tag}`,
  };
};

const handleLeftServer = (
  member: GuildMember | PartialGuildMember
): ChatLogInfo => {
  const memberUsername = getUserName(member, member.user);

  Log.debug(
    `Member Left: ${memberUsername}${
      member.user ? ` (${member.user?.tag})` : ""
    }`
  );

  return {
    author: {
      name: memberUsername,
      iconURL: member.user?.avatarURL() || undefined,
    },
    colour: config.discord.logColours.userLeft,
    description: makeBold("User Left"),
    content: member.user
      ? `ID: ${member.user.id}\nTag: ${member.user.tag}`
      : "Could not retrieve user details",
  };
};

const handleCreatedMessage = (
  message: Message | PartialMessage
): ChatLogInfo => {
  const author = getUserName(message.member, message.author);
  const channelName = getChannelName(message);

  Log.debug(
    `New message from ${author} (${getUserTag(
      message.author
    )}) in ${channelName}: ${message.content}`
  );

  return {
    author: {
      name: author,
      iconURL: message.author?.avatarURL() || undefined,
    },
    colour: config.discord.logColours.messageCreated,
    description: compose(
      addMessageUrl(message),
      addAuthorTag(message),
      addChannelName(channelName),
      makeBold
    )("New Message"),
    content: message.content!,
  };
};

const handleDeletedMessage = (
  message: Message | PartialMessage
): ChatLogInfo => {
  const author = getUserName(message.member, message.author);
  const channelName = getChannelName(message);

  Log.debug(
    `Message from ${author} in ${channelName} deleted: ${message.content}`
  );

  return {
    author: {
      name: author,
      iconURL: message.author?.avatarURL() || undefined,
    },
    colour: config.discord.logColours.messageDeleted,
    description: compose(
      addAuthorTag(message),
      addChannelName(channelName),
      makeBold
    )("Message Deleted"),
    content: message.content || undefined,
  };
};

const handleUpdatedMessage = (
  message: Message | PartialMessage
): ChatLogInfo => {
  const updatedMessage = message.channel.messages.cache.get(message.id);

  const author = getUserName(message.member, message.author);
  const channelName = getChannelName(message);

  Log.debug(
    `Message from ${author} (${
      message.author ? `${message.author.tag}` : "could not retrieve tag"
    }) in #${channelName} edited to: ${updatedMessage?.content}`
  );

  return {
    author: {
      name: author,
      iconURL: message.author?.avatarURL() || undefined,
    },
    colour: config.discord.logColours.messageUpdated,
    description: compose(
      addMessageUrl(message),
      addAuthorTag(message),
      addChannelName(channelName),
      makeBold
    )("Message Edited"),
    content: updatedMessage?.content || undefined,
  };
};

const getUserName = (
  member?: GuildMember | PartialGuildMember | null,
  user?: User | null
): string => {
  const name = member?.nickname || user?.username || "";

  return user?.bot ? `${name} [BOT]` : name;
};

const getUserTag = (user: User | null): string => {
  return user?.tag || "Could not retrieve tag";
};

const shouldLogMessage = (message: Message | PartialMessage): boolean =>
  message.channel.id !== config.discord.logChannelId &&
  message.author?.id !== discordClient?.user?.id &&
  !isEmpty(message.content);

const getChannelName = (message: Message | PartialMessage): string => {
  if (message.channel.type === "dm") {
    return "DM";
  }

  const channel = guild.channels.cache.get(message.channel.id);

  return `#${channel?.name}` || "Unidentified channel";
};

export default initMonitor;
