import {
  Client,
  ColorResolvable,
  Guild,
  GuildChannel,
  GuildChannelManager,
  GuildManager,
  GuildMember,
  Message,
  MessageEmbed,
  PartialGuildMember,
  PartialMessage,
  TextChannel,
  User,
} from "discord.js";
import { forEach } from "ramda";
import config from "../config";
import { Log } from "../logging";

let discordClient: Client;
let guild: Guild;

const initMonitor = (client: Client) => {
  Log.debug("Initiating monitor");

  discordClient = client;
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

  client.on("message", onMessageCreated);
  client.on("messageDelete", onMessageDeleted);
  client.on("messageUpdate", onMessageUpdated);
  client.on("guildMemberAdd", onJoinedServer);
  client.on("guildMemberRemove", onLeftServer);

  Log.debug("Monitor intiated");
};

const onJoinedServer = (member: GuildMember) => {
  const memberUsername = getUserName(member, member.user);

  Log.debug(`New Member: ${memberUsername} (${member.user.tag})`);

  sendChatlogMessage(
    {
      name: memberUsername,
      iconURL: member.user.avatarURL() || undefined,
    },
    config.discord.logColours.userJoined,
    "**User Joined**",
    `ID: ${member.user.id}\nTag: ${member.user.tag}`
  );
};

const onLeftServer = (member: GuildMember | PartialGuildMember): void => {
  const memberUsername = getUserName(member, member.user);

  Log.debug(
    `Member Left: ${memberUsername}${
      member.user ? ` (${member.user?.tag})` : ""
    }`
  );

  sendChatlogMessage(
    {
      name: memberUsername,
      iconURL: member.user?.avatarURL() || undefined,
    },
    config.discord.logColours.userLeft,
    "**User Left**",
    member.user
      ? `ID: ${member.user.id}\nTag: ${member.user.tag}`
      : "Could not retrieve user details"
  );
};

const onMessageCreated = (message: Message): void => {
  if (!shouldLogMessage(message) || !message.content) {
    return;
  }

  const author = getUserName(message.member, message.author);
  const channelName = getChannelName(message);

  Log.debug(
    `New message from ${author} (${message.author.tag}) in ${channelName}: ${message.content}`
  );

  sendChatlogMessage(
    {
      name: author,
      iconURL: message.author.avatarURL() || undefined,
    },
    config.discord.logColours.messageCreated,
    `**New Message** ${channelName} - ${message.author.tag}${
      message.channel.type !== "dm" ? ` (${message.url})` : ""
    }`,
    message.content
  );
};

const onMessageDeleted = (message: Message | PartialMessage): void => {
  if (!shouldLogMessage(message)) {
    return;
  }

  const author = getUserName(message.member, message.author);
  const channelName = getChannelName(message);

  Log.debug(
    `Message from ${author} in ${channelName} deleted: ${message.content}`
  );

  sendChatlogMessage(
    {
      name: author,
      iconURL: message.author?.avatarURL() || undefined,
    },
    config.discord.logColours.messageDeleted,
    `**Message Deleted** ${channelName}${
      message.author ? ` - ${message.author?.tag}` : ""
    }`,
    message.content || undefined
  );
};

const onMessageUpdated = (message: Message | PartialMessage): void => {
  if (!shouldLogMessage(message)) {
    return;
  }

  const updatedMessage = message.channel.messages.cache.get(message.id);

  const author = getUserName(message.member, message.author);
  const channelName = getChannelName(message);

  Log.debug(
    `Message from ${author} (${
      message.author ? `${message.author.tag}` : "could not retrieve tag"
    }) in #${channelName} edited to: ${updatedMessage?.content}`
  );

  sendChatlogMessage(
    {
      name: author,
      iconURL: message.author?.avatarURL() || undefined,
    },
    config.discord.logColours.messageUpdated,
    `**Message Edited** ${channelName}${
      message.author ? ` - ${message.author?.tag}` : ""
    }${message.channel.type !== "dm" ? ` (${message.url})` : ""}`,
    updatedMessage?.content || undefined
  );
};

const sendChatlogMessage = (
  messageAuthor: {
    name: string;
    iconURL?: string;
  },
  colour: ColorResolvable,
  description: string,
  content?: string
): void => {
  const channel = discordClient.channels.cache.get(
    config.discord.logChannelId
  ) as TextChannel;

  channel.send(`${getTimeStamp()} ${description}`);

  if (content) {
    const messageEmbed = new MessageEmbed({
      description: content,
      author: messageAuthor,
      color: colour,
    });

    channel.send(messageEmbed);
  }
};

const getUserName = (
  member?: GuildMember | PartialGuildMember | null,
  user?: User | null
): string => {
  const name = member?.nickname || user?.username || "";

  return user?.bot ? `${name} [BOT]` : name;
};

const getTimeStamp = () => `<t:${Math.floor(Date.now() / 1000)}>`;

const shouldLogMessage = (message: Message | PartialMessage): boolean =>
  message.channel.id !== config.discord.logChannelId &&
  message.author?.id !== discordClient?.user?.id;

const getChannelName = (message: Message | PartialMessage): string => {
  if (message.channel.type === "dm") {
    return "DM";
  }

  const channel = guild.channels.cache.get(message.channel.id);

  return `#${channel?.name}` || "Unidentified channel";
};
export default initMonitor;
