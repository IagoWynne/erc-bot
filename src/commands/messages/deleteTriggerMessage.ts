import { Message } from "discord.js";
import { Log } from "../../logging";

const deleteTriggerMessage = async (message: Message) => {
  try {
    if (message.channel.type !== "dm") {
      message.delete();
    }
  } catch (e) {
    Log.error(e);
  }
};

export default deleteTriggerMessage;
