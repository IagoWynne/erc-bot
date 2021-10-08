import createCommandData from "./createCommandData";
import * as Discord from "../../discord";
import { Interaction } from "discord.js";
import { Log } from "../../logging";
import handleAddToBlacklist from "./handleAddToBlacklist";
import handleViewBlacklist from "./handleViewBlacklist";
import handleRemovedFromBlacklist from "./handleRemoveFromBlacklist";

const initBlacklistCommands = async () => {
  await createCommandData();

  const client = Discord.getClient();
  client.on("interactionCreate", onCommandInteraction);
};

const onCommandInteraction = async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName !== "blacklist") return;

  const subCommand = interaction.options.getSubcommand();

  Log.debug(
    `Blacklist interaction detected. User: ${interaction.user.tag} - ${interaction.user.id}. Subcommand: ${subCommand}.`
  );

  switch (subCommand) {
    case "add":
      handleAddToBlacklist(interaction);
      break;
    case "view":
      handleViewBlacklist(interaction);
      break;
    case "remove":
      handleRemovedFromBlacklist(interaction);
      break;
    default:
      Log.debug("Unrecognised blacklist subcommand.");
      interaction.reply({
        ephemeral: true,
        content: "This subcommand was not recognised.",
      });
  }
};

export default initBlacklistCommands;
