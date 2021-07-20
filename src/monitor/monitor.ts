import { Message, PartialMessage } from "discord.js";
import { Log } from "../logging";
import * as Discord from "../discord";
import onJoinedServer from "./eventHandlers/onJoinedServer";
import onLeftServer from "./eventHandlers/onLeftServer";
import shouldLogMessage from "./chatLog/shouldLogMessage";
import onCreatedMessage from "./eventHandlers/handleCreatedMessage";
import onDeletedMessage from "./eventHandlers/handleDeletedMessage";
import onUpdatedMessage from "./eventHandlers/handleUpdatedMessage";

const initMonitor = async () => {
  Log.debug("Initialising monitor");
  await Discord.fetchGuild();

  setupListeners();

  Log.debug("Monitor intiated");
};

const setupListeners = () => {
  const client = Discord.getClient();

  client.on("message", onMessageEvent(onCreatedMessage));
  client.on("messageDelete", onMessageEvent(onDeletedMessage));
  client.on("messageUpdate", onMessageEvent(onUpdatedMessage));
  client.on("guildMemberAdd", onJoinedServer);
  client.on("guildMemberRemove", onLeftServer);
};

//todo: refactor all this stuff into separate files for each event type

const onMessageEvent =
  (messageEventHandler: (message: Message | PartialMessage) => void) =>
  (message: Message | PartialMessage) =>
    shouldLogMessage(message) ? messageEventHandler(message) : null;

export default initMonitor;
