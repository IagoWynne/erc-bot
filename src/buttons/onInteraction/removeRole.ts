import { GuildMember, Role, ButtonInteraction } from "discord.js";
import { Log } from "../../logging";
import {
  sendCommandSuccessMessage,
  sendCommandErrorMessage,
} from "./logResult";
import sendInteractionReply from "./sendInteractionReply";

const removeRole = async (
  guildMember: GuildMember,
  role: Role,
  interaction: ButtonInteraction
) => {
  try {
    await guildMember.roles.remove(role);

    sendCommandSuccessMessage(
      "Role Selection Executed",
      `Add/Remove Role button executed successfully.\nRemoved role ${role.name}.`,
      interaction
    );

    sendInteractionReply(
      interaction,
      `You no longer have the role ${role.name}. To re-add it, press the button again.`
    );
  } catch (e) {
    Log.error(e);

    sendCommandErrorMessage(
      "Role Selection Button Failed",
      `Add/Remove Role button failed to remove role ${role.name}: Please review error logs.`,
      interaction
    );

    sendInteractionReply(
      interaction,
      "There was an error removing this role. Please contact an admin for assistance."
    );
  }
};

export default removeRole;
