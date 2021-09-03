import { Message, PartialMessage, User } from "discord.js";
import { any, find, includes } from "ramda";
import config from "../config";
import * as Discord from "../discord";
import { Log } from "../logging";
import { deleteTriggerMessage, sendMessageToLogChannel } from "../messages";

const initAutoBan = () => {
  const client = Discord.getClient();

  client.on("messageCreate", onMessageCreatedOrUpdated);
  client.on("messageUpdate", onMessageCreatedOrUpdated);
};

const onMessageCreatedOrUpdated = async (
  message: Message | PartialMessage
): Promise<void> => {
  message = await message.fetch(true);
  if (!hasBlacklistedPhrase(message)) {
    return;
  }
  console.log("CHEESE");

  const actions = [deleteTriggerMessage(message), banUser(message.author)];

  await Promise.all(actions);
};

const hasBlacklistedPhrase = (message: Message | PartialMessage): boolean =>
  config.blacklistedPhrases.some((bl) => message.content?.includes(bl));

const banUser = async (user: User | null) => {
  console.log("CHEESE 2");
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
