import { GuildMember } from "discord.js";
import * as Discord from "../../discord";
import { Log } from "../../logging";

const findGuildMember = async (id: string): Promise<GuildMember> => {
  const guildMember = await Discord.getGuild().members.fetch(id);

  if (!guildMember) {
    Log.warn(`Could not find user with id ${id} in server`);
  }

  return guildMember;
};

export default findGuildMember;
