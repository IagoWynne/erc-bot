import ChannelConfig from "./channelConfig";
import LogMessageColours from "./logColours";

export default interface DiscordConfig {
  token: string;
  logChannelId: string;
  guildId: string;
  logColours: LogMessageColours;
  channels: ChannelConfig[];
}
