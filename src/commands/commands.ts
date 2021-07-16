import { Client, Message, User } from "discord.js";
import { compose, curry, ifElse, slice, startsWith } from "ramda";
import config from "../config";
import { Log } from "../logging";
import handleHelpCommand from "./help/handleHelpCommand";

let discordClient: Client;

const initCommands = (client: Client) => {
  Log.debug("Initialising command handlers...");
  discordClient = client;

  client.on(
    "message",
    ifElse(shouldProcess, handleMessage, () => {})
  );
  Log.debug("Command handlers initiated!");
};

const shouldProcess = (message: Message): boolean =>
  message.channel.id !== config.discord.logChannelId &&
  message.author?.id !== discordClient?.user?.id;

const getContent = (message: Message): string => message.content;

const startsWithCommandPrefix = (messageContent: string): boolean =>
  startsWith(config.commands.prefix, messageContent);

const stripPrefix = (messageContent: string): string =>
  slice(1, Infinity)(messageContent);

const matchCommand = (
  messageContent: string
): ((m: Message) => void) | undefined => {
  Log.debug(`Received potential command: ${messageContent}`);

  if (messageContent === "help") {
    Log.debug(`Matched ${messageContent} to help command`);
    return curry(handleHelpCommand)(
      findUser,
      sendDmToUser,
      deleteTriggerMessage
    );
  }

  Log.debug(`${messageContent} did not match any command`);

  return;
};

const getCommand = compose(
  ifElse(startsWithCommandPrefix, compose(matchCommand, stripPrefix), () => {}),
  getContent
);

const handleMessage = (message: Message) => {
  const command: ((m: Message) => void) | undefined = getCommand(message);

  if (command) {
    command(message);
  }
};

const findUser = async (id: string): Promise<User> => {
  const user = await discordClient.users.fetch(id);

  if (!user) {
    Log.warn(`Could not find user with id ${id}`);
  }

  return user;
};

const sendDmToUser = async (user: User, message: string) => {
  Log.debug(`Sending DM to user ${user.tag}: ${message}`);

  try {
    await user.send(message);
  } catch (e) {
    Log.debug(e);
    Log.error(e);
  }
};

const deleteTriggerMessage = async (message: Message) => {
  try {
    if (message.channel.type !== "dm") {
      message.delete();
    }
  } catch (e) {
    Log.error(e);
  }
};

export default initCommands;
