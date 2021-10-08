import { CommandInteraction } from "discord.js";
import config from "../../config";
import { Blacklist } from "../../data";
import { Log } from "../../logging";
import { sendMessageToLogChannel } from "../../messages";

const handleAddToBlacklist = async (interaction: CommandInteraction) => {
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

    await Blacklist.add(item);
    await Blacklist.fetch();

    sendMessageToLogChannel({
      author: { name: "erc-bot" },
      colour: config.discord.logColours.commandUsed,
      title: "Item added to blacklist",
      description: `Added: ${item}\n${interaction.user.tag} - ${interaction.user.id}`,
    });

    interaction.reply({
      ephemeral: true,
      content: `Added ${item} to the blacklist.`,
    });
  } catch (e) {
    Log.error(e);
    interaction.reply({
      ephemeral: true,
      content:
        "There was an error adding to the blacklist. Please check the logs for more information.",
    });
  }
};

export default handleAddToBlacklist;
