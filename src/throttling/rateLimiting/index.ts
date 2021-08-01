import { Message } from "discord.js";
import { deleteTriggerMessage, sendDmToUser } from "../../messages";
import getUserName from "../../messages/getUserName";
import ChannelConfig from "../../types/config/discord/channelConfig";
import { RateLimiter } from "./rateLimiter";

let rateLimiters: { [key: string]: RateLimiter } = {};

const getTokenRefreshMilliseconds = (tokenRefresh: number) =>
  tokenRefresh * 60 * 60 * 1000;

const createRateLimiterForChannel = (channelConfig: ChannelConfig) => {
  rateLimiters[channelConfig.channelId] = new RateLimiter(
    1,
    getTokenRefreshMilliseconds(channelConfig.throttling!.tokenRefreshHours)
  );
};

const isUserLimitedInChannel = (message: Message): boolean =>
  rateLimiters[message.channel.id]?.take(message.author.id) ?? false;

const getRemainingTokenTime = (channelId: string, userId: string): number =>
  Date.now() + (rateLimiters[channelId]?.getRemainingMilliseconds(userId) ?? 0);

const onUserLimitedInChannel = (message: Message) => {
  deleteTriggerMessage(message);
  sendDmToUser(
    message.author,
    `Hello, ${getUserName(
      null,
      message.author
    )}, this is an automated message. Your latest message on ERC has been deleted due to our 24-hour repost rule.
    
    You will be able to post again in the LFG/LFM channel <t:${Math.floor(
      getRemainingTokenTime(message.channel.id, message.author.id) / 1000
    )}:R>.
    
    If you have deleted your message by accident, the admin team cannot help you lift the limit.
    
    If your previous post was removed by a moderator for breaking the rules then you will have to wait for the 24 hours to pass. Please do not repost on another account to get around this. For more information, please read #announcements and the pins in the relevant channels.`
  );
};

export {
  createRateLimiterForChannel,
  isUserLimitedInChannel,
  onUserLimitedInChannel,
};
