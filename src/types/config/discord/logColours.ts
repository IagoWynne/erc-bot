import { ColorResolvable } from "discord.js";

export default interface LogMessageColours {
  userJoined: ColorResolvable;
  userLeft: ColorResolvable;
  messageCreated: ColorResolvable;
  messageUpdated: ColorResolvable;
  messageDeleted: ColorResolvable;
  channelPurged: ColorResolvable;
  commandUsed: ColorResolvable;
  commandError: ColorResolvable;
  botUpdate: ColorResolvable;
}
