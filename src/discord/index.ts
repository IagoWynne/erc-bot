import { Client, Guild, GuildChannel } from "discord.js";
import config from "../config";
import { Log } from "../logging";

const client = new Client();
let guild: Guild;

const getClient = (): Client => client;

const login = () => {
  client.login(config.discord.token);
};

const fetchGuild = async () => {
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
  });
};

const getGuild = (): Guild => guild;

export { getClient, login, getGuild, fetchGuild };
