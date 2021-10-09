import { CommandInteraction } from "discord.js";
import config from "../../config";
import { Blacklist } from "../../data";
import { Log } from "../../logging";
import { sendMessageToLogChannel } from "../../messages";

const handleRemovedFromBlacklist = async (interaction: CommandInteraction) => {
  try {
    const item = interaction.options.getString("item");

    if (!item) {
      interaction.reply({
        ephemeral: true,
        content:
          "You must define a word/phrase to add to the blacklist using `item:`.",
      });
      return;
    }

    await Blacklist.remove(item);
    await Blacklist.fetch();

    sendMessageToLogChannel({
      author: { name: "erc-bot" },
      colour: config.discord.logColours.commandUsed,
      title: "Item removed to blacklist",
      description: `Removed: ${item}\n${interaction.user.tag} - ${interaction.user.id}`,
    });

    interaction.reply({
      ephemeral: true,
      content: `Removed ${item} from the blacklist.`,
    });
  } catch (e) {
    Log.error(e);
    interaction.reply({
      ephemeral: true,
      content:
        "There was an error removing from the blacklist. Please check the logs for more information.",
    });
  }
};

export default handleRemovedFromBlacklist;
