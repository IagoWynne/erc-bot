import { ButtonInteraction, Role } from "discord.js";
import { Log } from "../../logging";
import { sendCommandErrorMessage } from "./logResult";
import sendInteractionReply from "./sendInteractionReply";
import * as Discord from "../../discord";

const getRole = async (
  interaction: ButtonInteraction,
  buttonRoleMap: { [key: string]: string }
): Promise<Role | null> => {
  const role = await Discord.findGuildRole(buttonRoleMap[interaction.customId]);

  if (role) {
    return role;
  }

  Log.warn(
    `Add/Remove Role button failed: could not find role requested by ${interaction.user.tag} - ${interaction.user.id}. Button ID: ${interaction.customId})`
  );

  sendCommandErrorMessage(
    "Role Selection Button Failed",
    "Add/Remove Role button failed: could not find role requested.",
    interaction
  );

  sendInteractionReply(
    interaction,
    "There was an error adding/removing this role. Please contact an admin for assistance."
  );

  return null;
};

export default getRole;
