import { Message, PartialMessage } from "discord.js";
import { Log } from "../logging";
import * as Discord from "../discord";

const deleteTriggerMessage = async (message: Message | PartialMessage) => {
  try {
    if (message.channel.type !== "DM") {
      if (!Discord.isBotDeletedMessage(message.id)) {
        Discord.addDeletedMessageId(message.id);

        await message.delete();
      }
    }
  } catch (e) {
    Log.error(e);
  }
};

export default deleteTriggerMessage;
