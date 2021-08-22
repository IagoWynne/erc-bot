import { ButtonInteraction, GuildMember } from "discord.js";
import { Log } from "../../logging";
import { sendCommandErrorMessage } from "./logResult";
import sendInteractionReply from "./sendInteractionReply";
import * as Discord from "../../discord";

const getGuildMember = async (
  interaction: ButtonInteraction
): Promise<GuildMember | null> => {
  const guildMember = await Discord.findGuildMember(interaction.user.id);

  if (!guildMember) {
    Log.warn(
      `Add/Remove Role button failed: could not find guild member ${interaction.user.tag} - ${interaction.user.id}`
    );

    sendCommandErrorMessage(
      "Role Selection Button Failed",
      "Add/Remove Role button failed: could not find guild member.",
      interaction
    );

    sendInteractionReply(
      interaction,
      "There was an error adding/removing this role. Please try again and contact an admin for assistance if there are further problems."
    );

    return null;
  }

  return guildMember;
};

export default getGuildMember;
