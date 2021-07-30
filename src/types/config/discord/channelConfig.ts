import ThrottlingConfig from "./throttlingConfig";

export default interface ChannelConfig {
  channelId: string;
  throttling?: ThrottlingConfig;
}
