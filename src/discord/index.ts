import { Client, Guild, GuildChannel, TextChannel, User } from "discord.js";
import config from "../config";
import { Log } from "../logging";

const client = new Client();
let guild: Guild;

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

export { getClient, login, getGuild, fetchGuild, findUser };
