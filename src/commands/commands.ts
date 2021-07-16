import { Client, Guild, GuildMember, Message, Role, User } from "discord.js";
import { compose, curry, ifElse, slice, split, startsWith } from "ramda";
import config from "../config";
import { Log } from "../logging";
import handleAddRoleCommand from "./roles/handleAddRoleCommand";
import handleHelpCommand from "./handleHelpCommand";
import handleRemoveRoleCommand from "./roles/handleRemoveRoleCommand";

let discordClient: Client;
let guild: Guild;

const initCommands = async (client: Client) => {
  Log.debug("Initialising command handlers...");
  discordClient = client;
  guild = await discordClient.guilds.fetch(config.discord.guildId);

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

  switch (split(" ", messageContent)[0]) {
    case "help": {
      Log.debug(`Matched ${messageContent} to help command`);
      return curry(handleHelpCommand)(findUser, sendDmToUser);
    }
    case "iam": {
      Log.debug(`Matched ${messageContent} to iam command`);
      return curry(handleAddRoleCommand)(
        findGuildMember,
        findGuildRole,
        sendDmToUser
      );
    }
    case "iamnot": {
      Log.debug(`Matched ${messageContent} to iamnot command`);
      return curry(handleRemoveRoleCommand)(
        findGuildMember,
        findGuildRole,
        sendDmToUser
      );
    }
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
    deleteTriggerMessage(message);
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

const findGuildMember = async (id: string): Promise<GuildMember> => {
  const guildMember = await guild.members.fetch(id);

  if (!guildMember) {
    Log.warn(`Could not find user with id ${id} in server`);
  }

  return guildMember;
};

const findGuildRole = async (id: string): Promise<Role | null> => {
  const role = await guild.roles.fetch(id);

  if (!role) {
    Log.warn(`Could not find role with id ${id} in server`);
  }

  return role;
};

export default initCommands;
