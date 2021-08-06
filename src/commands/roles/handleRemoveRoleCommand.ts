import { Message } from "discord.js";
import config from "../../config";
import { Log } from "../../logging";
import { sendDmToUser } from "../../messages";
import getCommandContent from "../getCommandContent";
import findGuildMember from "./findGuildMember";
import findGuildRole from "./findGuildRole";
import getRoleId from "./getRoleId";

const handleRemoveRoleCommand = async (message: Message) => {
  const guildMember = await findGuildMember(message.author.id);

  if (!guildMember) {
    Log.warn(
      `Remove Role command failed: could not find guild member with id ${message.author.id}`
    );
    return;
  }

  const roleAlias = getCommandContent(message.content);

  const roleId = getRoleId(roleAlias);

  const role = roleId ? await findGuildRole(roleId) : undefined;

  if (!roleId || !role) {
    Log.warn(
      `Remove Role command from ${message.author.tag} failed: could not find role with id ${roleAlias}`
    );

    sendDmToUser(
      guildMember.user,
      `Sorry, the role ${roleAlias} does not exist. Type \`.help\` to view the available commands.`,
      {
        author: {
          name: "ERC Bot",
        },
        colour: config.discord.logColours.commandError,
        title: "Command Execution Failed",
        description: `\`.iamnot\` command failed.\nUser requested role which does not exist.\n${message.author.tag} (${message.author.id})`,
      }
    );
    return;
  }

  if (!guildMember.roles.cache.get(roleId)) {
    sendDmToUser(guildMember.user, `You do not have the role ${role.name}.`, {
      author: {
        name: "ERC Bot",
      },
      colour: config.discord.logColours.commandError,
      title: "Command Execution Failed",
      description: `\`.iamnot\` command failed.\nUser requested role which they do not have.\n${message.author.tag} - ${message.author.id}`,
    });
    return;
  }

  try {
    guildMember.roles.remove(role);
    sendDmToUser(guildMember.user, `Removed role ${role.name}`, {
      author: {
        name: "ERC Bot",
      },
      colour: config.discord.logColours.commandUsed,
      title: "Command Executed",
      description: `\`.iamnot\` command executed successfully.\nRemoved role ${role.name} from user.\n${message.author.tag} - ${message.author.id}`,
    });
  } catch (e) {
    Log.error(e);
    sendDmToUser(
      guildMember.user,
      `There was an error removing the role ${role.name}. Please contact an admin for assistance.`,
      {
        author: {
          name: "ERC Bot",
        },
        colour: config.discord.logColours.commandError,
        title: "Command Execution Failed",
        description: `\`.iamnot\` command failed.\nPlease review error logs.\n${message.author.tag} - ${message.author.id}`,
      }
    );
  }
};

export default handleRemoveRoleCommand;
