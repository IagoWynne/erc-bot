import { Message, PartialMessage, User } from "discord.js";
import config from "../config";
import * as Discord from "../discord";
import { Log } from "../logging";
import { deleteTriggerMessage, sendMessageToLogChannel } from "../messages";
import { Blacklist } from "../data";
import { Collection, MongoClient } from "mongodb";

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
  } catch (e: any) {
    // message already deleted, do nothing
    return;
  }

  if (!hasBlacklistedPhrase(message)) {
    return;
  }

  const actions = [
    deleteTriggerMessage(message),
    kickOrBanUser(message.author),
  ];

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

const kickOrBanUser = async (user: User | null) => {
  if (!user) {
    return;
  }

  const mongoClient = new MongoClient(`mongodb://${config.database.url}`);

  await mongoClient.connect();
  const db = mongoClient.db();
  const collection = db.collection("blacklistedUsers");

  if (!(await hasUserPostedBlacklistedPhrasesRecently(user, collection))) {
    await kickUser(user);
    await logUserBlacklistPost(user, collection);
  } else {
    await banUser(user);
    await logUserBlacklistPost(user, collection);
  }

  mongoClient.close();
};

const hasUserPostedBlacklistedPhrasesRecently = async (
  user: User,
  collection: Collection
): Promise<boolean> => {
  const blacklistRecord = await collection.findOne({ userId: user.id });

  if (!blacklistRecord) {
    await collection.insertOne({ userId: user.id });
    return false;
  }

  const recent = new Date();
  recent.setHours(
    recent.getHours() - config.discord.blacklistKickCooldownHours
  );

  return blacklistRecord.timestamp > recent;
};

const logUserBlacklistPost = async (user: User, collection: Collection) => {
  await collection.findOneAndUpdate(
    { userId: user.id },
    { $set: { timestamp: new Date() } }
  );
};

const kickUser = async (user: User) => {
  try {
    const guildMember = await Discord.findGuildMember(user.id);

    await guildMember.kick("Sent message(s) with blacklisted phrase(s)");

    Log.info(`Kicked user ${user.tag} (${user.id}) for blacklist violation.`);

    sendSuccessfulKickMessage(user);
  } catch (e: any) {
    Log.error(e);
    sendFailedKickMessage(user);
  }
};

const banUser = async (user: User) => {
  try {
    const guildMember = await Discord.findGuildMember(user.id);

    await guildMember.ban({
      reason: "Repeatedly sent message(s) with blacklisted phrase(s).",
    });

    Log.info(`Banned user ${user.tag} (${user.id}) for blacklist violation.`);

    sendSuccessfulBanMessage(user);
  } catch (e: any) {
    Log.error(e);
    sendFailedBanMessage(user);
  }
};

const sendSuccessfulKickMessage = (user: User) => {
  sendMessageToLogChannel({
    author: {
      name: "ERC Bot",
    },
    colour: config.discord.logColours.botUpdate,
    title: "Kicked User",
    description: `Kicked user for message(s) with blacklisted phrase(s).\n${user.tag} - ${user.id}`,
    alertAdmin: true,
  });
};

const sendFailedKickMessage = (user: User) =>
  sendMessageToLogChannel({
    author: {
      name: "ERC Bot",
    },
    colour: config.discord.logColours.commandError,
    title: "Kick User Failed",
    description: `Could not kick user for message(s) with blacklisted phrase(s). Check error logs for further details.\n${user.tag} - ${user.id}`,
    alertAdmin: true,
  });

const sendSuccessfulBanMessage = (user: User) =>
  sendMessageToLogChannel({
    author: {
      name: "ERC Bot",
    },
    colour: config.discord.logColours.botUpdate,
    title: "Banned User",
    description: `Banned user for message(s) with blacklisted phrase(s).\n${user.tag} - ${user.id}`,
    alertAdmin: true,
  });

const sendFailedBanMessage = (user: User) =>
  sendMessageToLogChannel({
    author: {
      name: "ERC Bot",
    },
    colour: config.discord.logColours.commandError,
    title: "Ban User Failed",
    description: `Could not ban user for message(s) with blacklisted phrase(s). Check error logs for further details.\n${user.tag} - ${user.id}`,

    alertAdmin: true,
  });

export default initAutoBan;
