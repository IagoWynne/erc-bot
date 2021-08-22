import { Interaction } from "discord.js";
import addRole from "./addRole";
import getGuildMember from "./getGuildMember";
import getRole from "./getRole";
import removeRole from "./removeRole";

const onButtonInteraction =
  (buttonRoleMap: { [key: string]: string }) =>
  async (interaction: Interaction) => {
    if (!interaction.isButton()) return;

    const guildMember = await getGuildMember(interaction);

    if (!guildMember) return;

    const role = await getRole(interaction, buttonRoleMap);

    if (!role) return;

    if (guildMember.roles.cache.get(role.id)) {
      await removeRole(guildMember, role, interaction);
    } else {
      await addRole(guildMember, role, interaction);
    }
  };

export default onButtonInteraction;
