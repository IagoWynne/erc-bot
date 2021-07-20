import { RateLimiter } from "discord.js-rate-limiter";

export default interface ChannelRateLimiter {
  channelId: string;
  rateLimiter: RateLimiter;
}
