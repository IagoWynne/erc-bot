import { Message, GuildMember, Role, User } from "discord.js";
import { find, includes, split } from "ramda";
import config from "../config";
import { Log } from "../logging";
import RoleMatchConfig from "../types/config/commands/roleMatchConfig";

const handleAddRoleCommand = async (
  findGuildMember: (id: string) => Promise<GuildMember>,
  findGuildRole: (id: string) => Promise<Role | null>,
  sendDm: (user: User, message: string) => void,
  message: Message
) => {
  const guildMember = await findGuildMember(message.author.id);

  if (!guildMember) {
    Log.warn(
      `Add Role command failed: could not find guild member with id ${message.author.id}`
    );
    return;
  }

  const roleAlias = split(" ")(message.content)[1];

  const roleId = getRoleId(roleAlias);
  const role = roleId ? await findGuildRole(roleId) : undefined;

  if (!roleId || !role) {
    Log.warn(
      `Add Role command from ${message.author.tag} failed: could not find role with id ${roleAlias}`
    );
    sendDm(
      guildMember.user,
      `Sorry, the role ${roleAlias} does not exist. Type \`.help\` to view the available commands.`
    );
    return;
  }

  if (guildMember.roles.cache.get(roleId)) {
    sendDm(guildMember.user, `You already have the role ${role.name}.`);
    return;
  }

  try {
    guildMember.roles.add(role);
    sendDm(guildMember.user, `Added role ${role.name}`);
  } catch (e) {
    sendDm(
      guildMember.user,
      `There was an error adding the role ${role.name}. Please contact an admin for assistance.`
    );
  }
};

const getRoleId = (roleAlias: string) =>
  find(
    (roleMatchConfig: RoleMatchConfig) =>
      includes(roleAlias, roleMatchConfig.aliases),
    config.commands.roles
  )?.roleId;

export default handleAddRoleCommand;
