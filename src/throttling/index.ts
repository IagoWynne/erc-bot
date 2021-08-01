import { filter, find, forEach, hasPath, ifElse, includes } from "ramda";
import * as Discord from "../discord";
import config from "../config";
import ChannelConfig from "../types/config/discord/channelConfig";
import { Message } from "discord.js";
import {
  createRateLimiterForChannel,
  isUserLimitedInChannel,
  onUserLimitedInChannel,
} from "./rateLimiting";
import { hasBrokenRules, onRulesBroken } from "./channelRules";

let throttledChannels: string[] = [];

const initThrottling = () => {
  const getThrottledChannels = filter<ChannelConfig>(hasPath(["throttling"]));

  forEach((channel) => {
    createRateLimiterForChannel(channel);
    throttledChannels = [...throttledChannels, channel.channelId];
  }, getThrottledChannels(config.discord.channels));

  const client = Discord.getClient();
  client.on(
    "message",
    ifElse(isInThrottledChannel, handleThrottledChannelMessage, () => {})
  );
};

const isInThrottledChannel = (message: Message): boolean =>
  includes(message.channel.id, throttledChannels);

const handleThrottledChannelMessage = (message: Message) => {
  const throttlingConfig = find(
    (channel) => channel.channelId === message.channel.id,
    config.discord.channels
  )!.throttling!;

  const rulesBroken = hasBrokenRules(message, throttlingConfig);

  if (rulesBroken.charLimit || rulesBroken.newLineLimit) {
    onRulesBroken(message, rulesBroken, throttlingConfig);
  } else if (isUserLimitedInChannel(message)) {
    onUserLimitedInChannel(message);
  }
};

export default initThrottling;
