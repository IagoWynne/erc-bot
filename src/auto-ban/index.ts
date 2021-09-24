import { Message, PartialMessage, User } from "discord.js";
import config from "../config";
import * as Discord from "../discord";
import { Log } from "../logging";
import { deleteTriggerMessage, sendMessageToLogChannel } from "../messages";
import { Blacklist } from "../data";

const initAutoBan = async () => {
  Log.debug("Initiating auto-ban...");
  Log.debug("Retrieving blacklisted phrases...");

  await Blacklist.fetch();

  Log.debug("Blacklisted phrases retrieved!");

  if (Blacklist.get().length === 0) {
    Log.debug("No blacklisted phrases in database. Adding from config...");
    await Blacklist.bulkAdd(config.blacklistedPhrases);
    Log.debug("Blacklisted phrases added to database!");
  }

  const client = Discord.getClient();

  client.on("messageCreate", onMessageCreatedOrUpdated);
  client.on("messageUpdate", onMessageCreatedOrUpdated);
  Log.debug("Auto-ban initiated!");
};

const onMessageCreatedOrUpdated = async (
  message: Message | PartialMessage
): Promise<void> => {
  try {
    message = await message.fetch(true);
  } catch (e) {
    // message already deleted, do nothing
    return;
  }

  if (!hasBlacklistedPhrase(message)) {
    return;
  }
  const actions = [deleteTriggerMessage(message), banUser(message.author)];

  await Promise.all(actions);
};

const hasBlacklistedPhrase = (message: Message | PartialMessage): boolean => {
  if (!message.content) {
    return false;
  }
  const lowerMessageContent = message.content.toLowerCase();
  return Blacklist.get().some((bl) =>
    lowerMessageContent.includes(bl.toLowerCase())
  );
};

const banUser = async (user: User | null) => {
  if (!user) {
    return;
  }

  try {
    const guildMember = await Discord.findGuildMember(user.id);

    await guildMember.ban({
      reason: "Sent message(s) with blacklisted phrase(s).",
    });

    sendSuccessfulBanMessage(user);
  } catch (e) {
    Log.error(e);
    sendFailedBanMessage(user);
  }
};

const sendSuccessfulBanMessage = (user: User) =>
  sendMessageToLogChannel({
    author: {
      name: "ERC Bot",
    },
    colour: config.discord.logColours.botUpdate,
    title: "Banned User",
    description: `Banned user for message(s) with blacklisted phrase(s).\n${user.tag} - ${user.id}`,
  });

const sendFailedBanMessage = (user: User) =>
  sendMessageToLogChannel({
    author: {
      name: "ERC Bot",
    },
    colour: config.discord.logColours.commandError,
    title: "Ban User Failed",
    description: `Could not ban user for message(s) with blacklisted phrase(s). Check error logs for further details.\n${user.tag} - ${user.id}`,
  });

export default initAutoBan;
