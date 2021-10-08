import { CommandInteraction } from "discord.js";
import { Blacklist } from "../../data";
import { Log } from "../../logging";

const handleViewBlacklist = async (interaction: CommandInteraction) => {
  try {
    const blacklist = await Blacklist.fetch();

    interaction.reply({
      ephemeral: true,
      content: `Blacklisted words/phrases:\n${blacklist.join("\n")}`,
    });
  } catch (e) {
    Log.error(e);
    interaction.reply({
      ephemeral: true,
      content:
        "There was an error retrieving the blacklist. Please view the error log for more details.",
    });
  }
};

export default handleViewBlacklist;
