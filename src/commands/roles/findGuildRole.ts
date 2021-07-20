import { Role } from "discord.js";
import * as Discord from "../../discord";
import { Log } from "../../logging";

const findGuildRole = async (id: string): Promise<Role | null> => {
  const role = await Discord.getGuild().roles.fetch(id);

  if (!role) {
    Log.warn(`Could not find role with id ${id} in server`);
  }

  return role;
};

export default findGuildRole;
