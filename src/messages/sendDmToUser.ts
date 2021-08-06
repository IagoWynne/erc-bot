import { User } from "discord.js";
import { Log } from "../logging";
import LogChannelMessage from "../types/monitor/LogChannelMessage";
import sendMessageToLogChannel from "./sendMessageToLogChannel";

const sendDmToUser = async (
  user: User,
  message: string,
  chatLogEntry: LogChannelMessage
) => {
  Log.debug(`Sending DM to user ${user.tag}: ${message}`);

  try {
    await user.send(message);
    sendMessageToLogChannel(chatLogEntry);
  } catch (e) {
    Log.error(e);
  }
};

export default sendDmToUser;
