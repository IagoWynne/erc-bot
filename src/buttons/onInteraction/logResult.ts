import { ColorResolvable, ButtonInteraction } from "discord.js";
import config from "../../config";
import { sendMessageToLogChannel } from "../../messages";

const logResultInServer = (
  colour: ColorResolvable,
  title: string,
  description: string
) =>
  sendMessageToLogChannel({
    author: {
      name: "ERC Bot",
    },
    colour,
    title,
    description,
  });

const formatDescription = (
  description: string,
  interaction: ButtonInteraction
) =>
  `${description}\n${interaction.user.tag} - ${interaction.user.id}\nButton ID: ${interaction.customId}`;

const sendCommandErrorMessage = (
  title: string,
  description: string,
  interaction: ButtonInteraction
) =>
  logResultInServer(
    config.discord.logColours.commandError,
    title,
    formatDescription(description, interaction)
  );

const sendCommandSuccessMessage = (
  title: string,
  description: string,
  interaction: ButtonInteraction
) =>
  logResultInServer(
    config.discord.logColours.commandUsed,
    title,
    formatDescription(description, interaction)
  );

export { sendCommandErrorMessage, sendCommandSuccessMessage };
