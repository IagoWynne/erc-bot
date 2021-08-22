import { ButtonInteraction } from "discord.js";

const sendInteractionReply = (
  interaction: ButtonInteraction,
  message: string
) =>
  interaction.reply({
    ephemeral: true,
    content: message,
  });

export default sendInteractionReply;
