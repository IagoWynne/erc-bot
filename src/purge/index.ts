import { equals, filter, forEach, hasPath, includes } from "ramda";
import * as schedule from "node-schedule";
import ChannelConfig from "../types/config/discord/channelConfig";
import config from "../config";
import * as Discord from "../discord";
import { TextChannel } from "discord.js";
import { Log } from "../logging";
import { sendMessageToLogChannel } from "../messages";

let inProgressLock = false;
let inProgressChannelIds: string[] = [];

const initPurge = () => {
  Log.debug("Initiating purging...");

  const getPurgeChannels = filter<ChannelConfig>(hasPath(["purgeCron"]));

  forEach(createPurgeTimer, getPurgeChannels(config.discord.channels));

  Log.debug("Purging initiated!");
};

const createPurgeTimer = (channelConfig: ChannelConfig): void => {
  schedule.scheduleJob(channelConfig.purgeCron!, () =>
    purgeChannel(channelConfig.channelId)
  );
};

const isChannelBeingPurged = (channelId: string): boolean =>
  includes(channelId)(inProgressChannelIds);

const purgeChannel = async (channelId: string) => {
  const client = Discord.getClient();
  const channel = (await client.channels.fetch(channelId)) as TextChannel;

  Log.debug(`Purging channel ${channel.name} (ID: ${channelId}).`);

  addChannelToInProgress(channelId);
  const messagesDeleted = await deleteAllMessagesInChannel(channel);
  removeChannelFromInProgress(channelId);

  Log.info(
    `Purged channel ${channel.name} (ID: ${channelId}). Deleted ${messagesDeleted}`
  );

  sendMessageToLogChannel({
    author: { name: "" },
    title: `Channel Purged - ${channel.name}`,
    description: `${messagesDeleted} messages deleted`,
    colour: config.discord.logColours.channelPurged,
  });
};

const addChannelToInProgress = (channelId: string): void => {
  while (inProgressLock) {
    Log.debug("waiting for purge lock...");
  }

  inProgressLock = true;
  inProgressChannelIds = [...inProgressChannelIds, channelId];
  inProgressLock = false;
};

const fetch100Messages = async (channel: TextChannel) =>
  await channel.messages.fetch({ limit: 100 });

const deleteAllMessagesInChannel = async (
  channel: TextChannel
): Promise<number> => {
  let fetchedMessages = await fetch100Messages(channel);
  let messagesDeleted = fetchedMessages.size;

  while (fetchedMessages.size > 0) {
    await channel.bulkDelete(fetchedMessages);
    fetchedMessages = await fetch100Messages(channel);
    messagesDeleted += fetchedMessages.size;
  }

  return messagesDeleted;
};

const removeChannelFromInProgress = (channelId: string): void => {
  while (inProgressLock) {
    Log.debug("waiting for purge lock...");
  }

  inProgressLock = true;
  inProgressChannelIds = filter(equals(channelId), inProgressChannelIds);
  inProgressLock = false;
};

export { initPurge, isChannelBeingPurged };
