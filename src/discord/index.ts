import { Client, Guild, GuildChannel, TextChannel, User } from "discord.js";
import { compose, includes, pathOr } from "ramda";
import config from "../config";
import { Log } from "../logging";

const client = new Client();
let guild: Guild;
const purgedMessageIds: { [key: string]: string[] } = {};
const botDeletedMessageIds: string[] = [];

const getClient = (): Client => client;

const login = () => {
  client.login(config.discord.token);
};

const fetchGuild = async () => {
  if (guild) {
    return;
  }

  await client.guilds.fetch(config.discord.guildId);

  const clientGuild = client.guilds.cache.get(config.discord.guildId);
  if (!clientGuild) {
    Log.error(new Error("Could not get guild from ID"));
  } else {
    guild = clientGuild;
  }

  await guild.members.fetch();

  guild.channels.cache.forEach((channel: GuildChannel) => {
    channel.fetch();

    if (channel instanceof TextChannel) {
      channel.messages.fetch();
    }
  });
};

const getGuild = (): Guild => guild;

const findUser = async (id: string): Promise<User> => {
  const user = await client.users.fetch(id);

  if (!user) {
    Log.warn(`Could not find user with id ${id}`);
  }

  return user;
};

const getChannelPurgedMessageIds = (channelId: string) =>
  pathOr([], [channelId], purgedMessageIds);

const addPurgedMessageIds = (channelId: string, messageIds: string[]) => {
  const existingChannelMessageIds = getChannelPurgedMessageIds(channelId);
  purgedMessageIds[channelId] = [...existingChannelMessageIds, ...messageIds];
};

const clearChannelPurgedMessages = (channelId: string) => {
  purgedMessageIds[channelId] = [];
};

const isMessagePurged = (channelId: string, messageId: string): boolean =>
  includes(messageId, getChannelPurgedMessageIds(channelId));

const addDeletedMessageId = (messageId: string): void => {
  botDeletedMessageIds.push(messageId);
};

const isBotDeletedMessage = (messageId: string): boolean =>
  includes(messageId, botDeletedMessageIds);

const removeDeletedMessageId = (messageId: string): void => {
  const idx = botDeletedMessageIds.indexOf(messageId);

  if (idx > -1) {
    botDeletedMessageIds.splice(idx, 1);
  }
};

export {
  getClient,
  login,
  getGuild,
  fetchGuild,
  findUser,
  addPurgedMessageIds,
  clearChannelPurgedMessages,
  isMessagePurged,
  addDeletedMessageId,
  isBotDeletedMessage,
  removeDeletedMessageId,
};
