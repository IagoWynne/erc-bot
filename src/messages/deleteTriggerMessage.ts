import { Message } from "discord.js";
import { Log } from "../logging";
import * as Discord from "../discord";

const deleteTriggerMessage = async (message: Message) => {
  try {
    if (message.channel.type !== "dm") {
      Discord.addDeletedMessageId(message.id);
      await message.delete();
    }
  } catch (e) {
    Log.error(e);
  }
};

export default deleteTriggerMessage;
