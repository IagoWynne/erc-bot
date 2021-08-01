import { TextChannel } from "discord.js";
import { compose, filter, forEach, hasPath } from "ramda";
import config from "../../config";
import * as Discord from "../../discord";
import hasBrokenLfmRules from "../../messages/hasBrokenRules";
import ChannelConfig from "../../types/config/discord/channelConfig";
import ThrottlingConfig from "../../types/config/discord/throttlingConfig";

const constructInitialReplyMessage = (
  totalChars: number,
  newLines: number
): string =>
  `Your message has ${totalChars} characters and ${newLines} new lines`;

const addAllChannelDetailsToReply = (advert: string, reply: string): string => {
  let finalReply = reply;
  forEach((channel: ChannelConfig) => {
    (finalReply = appendNewLine(finalReply)),
      (finalReply = constructChannelDetailsMessage(
        advert,
        channel.channelId,
        channel.throttling!,
        finalReply
      ));
  }, filter(hasPath(["throttling"]), config.discord.channels));

  return finalReply;
};

const constructChannelDetailsMessage = (
  advert: string,
  channelId: string,
  throttlingConfig: ThrottlingConfig,
  reply: string
): string => {
  const brokenRules = hasBrokenLfmRules(advert, throttlingConfig);

  const channel = Discord.getGuild().channels.cache.get(
    channelId
  ) as TextChannel;

  if (brokenRules.charLimit || brokenRules.newLineLimit) {
    return constructFailureMessage(channel.name, throttlingConfig)(reply);
  }

  return constructSuccessMessage(channel.name, throttlingConfig)(reply);
};

const constructSuccessMessage = (
  channelName: string,
  throttlingConfig: ThrottlingConfig
) =>
  compose(
    throttlingConfig.newLineLimit
      ? appendNewLineLimit(throttlingConfig.newLineLimit!)
      : appendNoNewLineLimit,
    throttlingConfig.charLimit
      ? appendCharacterLimit(throttlingConfig.charLimit!)
      : appendNoCharacterLimit,
    appendSuccessMessage(channelName)
  );

const constructFailureMessage = (
  channelName: string,
  throttlingConfig: ThrottlingConfig
) =>
  compose(
    throttlingConfig.newLineLimit
      ? appendNewLineLimit(throttlingConfig.newLineLimit!)
      : appendNoNewLineLimit,
    throttlingConfig.charLimit
      ? appendCharacterLimit(throttlingConfig.charLimit!)
      : appendNoCharacterLimit,
    appendFailureMessage(channelName)
  );

const appendSuccessMessage =
  (channelName: string) =>
  (reply: string): string =>
    `${reply}:white_check_mark: Your message meets the requirements for channel **${channelName}**,`;

const appendFailureMessage =
  (channelName: string) =>
  (reply: string): string =>
    `${reply}❌ Your message does not meet the requirements for channel **${channelName}**,`;

const appendCharacterLimit =
  (limit: number) =>
  (reply: string): string =>
    `${reply} the character limit is ${limit},`;

const appendNoCharacterLimit = (reply: string): string =>
  `${reply} there is no character limit,`;

const appendNewLineLimit =
  (limit: number) =>
  (reply: string): string =>
    `${reply} and the new line limit is ${limit},`;

const appendNoNewLineLimit = (reply: string): string =>
  `${reply} and there is no new line limit,`;

const appendNewLine = (reply: string): string => `${reply}\n`;

export { constructInitialReplyMessage, addAllChannelDetailsToReply };
