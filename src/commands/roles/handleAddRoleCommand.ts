import { Message } from "discord.js";
import { Log } from "../../logging";
import { sendDmToUser } from "../../messages";
import getCommandContent from "../getCommandContent";
import findGuildMember from "./findGuildMember";
import findGuildRole from "./findGuildRole";
import getRoleId from "./getRoleId";

const handleAddRoleCommand = async (message: Message) => {
  const guildMember = await findGuildMember(message.author.id);

  if (!guildMember) {
    Log.warn(
      `Add Role command failed: could not find guild member with id ${message.author.id}`
    );
    return;
  }

  const roleAlias = getCommandContent(message.content);

  const roleId = getRoleId(roleAlias);

  const role = roleId ? await findGuildRole(roleId) : undefined;

  if (!roleId || !role) {
    Log.warn(
      `Add Role command from ${message.author.tag} failed: could not find role with id ${roleAlias}`
    );
    sendDmToUser(
      guildMember.user,
      `Sorry, the role ${roleAlias} does not exist. Type \`.help\` to view the available commands.`
    );
    return;
  }

  if (guildMember.roles.cache.get(roleId)) {
    sendDmToUser(guildMember.user, `You already have the role ${role.name}.`);
    return;
  }

  try {
    guildMember.roles.add(role);
    sendDmToUser(guildMember.user, `Added role ${role.name}`);
  } catch (e) {
    Log.error(e);
    sendDmToUser(
      guildMember.user,
      `There was an error adding the role ${role.name}. Please contact an admin for assistance.`
    );
  }
};

export default handleAddRoleCommand;
