import { Message } from "discord.js";
import { Log } from "../logging";

const onMessageCreated = (message: Message) => {
  Log.debug(message.content);
};

export default onMessageCreated;
