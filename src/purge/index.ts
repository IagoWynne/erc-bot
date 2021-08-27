import { filter, forEach, hasPath } from "ramda";
import * as schedule from "node-schedule";
import ChannelConfig from "../types/config/discord/channelConfig";
import config from "../config";
import * as Discord from "../discord";
import { TextChannel } from "discord.js";
import { Log } from "../logging";
import { sendMessageToLogChannel } from "../messages";

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

const purgeChannel = async (channelId: string) => {
  const client = Discord.getClient();
  const channel = (await client.channels.fetch(channelId)) as TextChannel;

  Log.debug(`Purging channel ${channel.name} (ID: ${channelId}).`);

  const messagesDeleted = await deleteAllMessagesInChannel(channel);
  let timeout: NodeJS.Timeout | undefined = setTimeout(() => {
    Discord.clearChannelPurgedMessages(channel.id), (timeout = undefined);
  }, 10000);

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

const fetch100Messages = async (channel: TextChannel) =>
  await channel.messages.fetch({ limit: 100 });

const deleteAllMessagesInChannel = async (
  channel: TextChannel
): Promise<number> => {
  let fetchedMessages = await fetch100Messages(channel);
  let messagesDeleted = fetchedMessages.size;

  const minBulkDeletableTimestamp = Date.now() - (13 * 24 + 23) * 3600 * 1000;

  while (fetchedMessages.size > 0) {
    const oldMessages = fetchedMessages.filter(
      (m) => m.createdTimestamp < minBulkDeletableTimestamp
    );

    if (oldMessages) {
      oldMessages.forEach((m) => channel.messages.delete(m));
    }

    const fetchedMessageIds = fetchedMessages.map((m) => m.id);
    Discord.addPurgedMessageIds(channel.id, fetchedMessageIds);
    await channel.bulkDelete(fetchedMessages, true);
    fetchedMessages = await fetch100Messages(channel);
    messagesDeleted += fetchedMessages.size;
  }

  return messagesDeleted;
};

export default initPurge;
