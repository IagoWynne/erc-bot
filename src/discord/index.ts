import {
  Client,
  Guild,
  GuildChannel,
  GuildMember,
  Intents,
  Role,
  TextChannel,
  ThreadChannel,
  User,
} from "discord.js";
import { exit } from "process";
import { includes, pathOr } from "ramda";
import config from "../config";
import { Log } from "../logging";

const intents = new Intents(Intents.FLAGS.GUILDS);
intents.add(Intents.FLAGS.GUILD_MEMBERS);
intents.add(Intents.FLAGS.DIRECT_MESSAGES);
intents.add(Intents.FLAGS.GUILD_MESSAGES);
intents.add(Intents.FLAGS.GUILD_BANS);

const client = new Client({ intents, partials: ["CHANNEL"] });

let guild: Guild;
const purgedMessageIds: { [key: string]: string[] } = {};
const botDeletedMessageIds: string[] = [];

const getClient = (): Client => client;

const login = async () => {
  try {
    await client.login(config.discord.token);
    client.on("error", (e: Error) => {
      Log.error(e);
    });
    client.on("shardDisconnect", () => {
      Log.info("Bot has been irrevocably disconnected. Restarting.");
      exit;
    });
  } catch (e: any) {
    Log.error(e);
  }
};

const fetchGuild = async () => {
  Log.debug("Fetching guild...");
  if (guild) {
    return;
  }

  await client.guilds.fetch(config.discord.guildId);

  const clientGuild = client.guilds.cache.get(config.discord.guildId);
  if (!clientGuild) {
    Log.error(new Error("Could not get guild from ID"));
    exit;
  } else {
    guild = clientGuild;

    try {
      await guild.members.fetch();
      await guild.emojis.fetch();
    } catch (e: any) {
      Log.error(e);
    }

    guild.channels.cache.forEach((channel: GuildChannel | ThreadChannel) => {
      channel.fetch();

      if (channel instanceof TextChannel) {
        channel.messages.fetch();
      }
    });
  }
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

const findGuildMember = async (id: string): Promise<GuildMember> => {
  const guildMember = await guild.members.fetch(id);

  if (!guildMember) {
    Log.warn(`Could not find user with id ${id} in server`);
  }

  return guildMember;
};

const findGuildRole = async (id: string): Promise<Role | null> => {
  const role = await guild.roles.fetch(id);

  if (!role) {
    Log.warn(`Could not find role with id ${id} in server`);
  }

  return role;
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
  findGuildMember,
  findGuildRole,
};
