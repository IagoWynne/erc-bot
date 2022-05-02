import { GuildMember, Role, ButtonInteraction } from "discord.js";
import { Log } from "../../logging";
import {
  sendCommandSuccessMessage,
  sendCommandErrorMessage,
} from "./logResult";
import sendInteractionReply from "./sendInteractionReply";

const addRole = async (
  guildMember: GuildMember,
  role: Role,
  interaction: ButtonInteraction
) => {
  try {
    await guildMember.roles.add(role);

    sendCommandSuccessMessage(
      "Role Selection Executed",
      `Add/Remove Role button executed successfully.\nAdded role ${role.name}.`,
      interaction
    );

    sendInteractionReply(
      interaction,
      `You've assigned yourself the role ${role.name}. To remove it, press the button again.`
    );
  } catch (e: any) {
    Log.error(e);

    sendCommandErrorMessage(
      "Role Selection Button Failed",
      `Add/Remove Role button failed to add role ${role.name}: Please review error logs.`,
      interaction
    );

    sendInteractionReply(
      interaction,
      "There was an error adding this role. Please contact an admin for assistance."
    );
  }
};

export default addRole;
