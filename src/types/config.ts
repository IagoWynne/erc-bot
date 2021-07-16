import { ColorResolvable } from "discord.js";

export type LogLevel = "debug" | "verbose" | "info" | "warn" | "error";

export interface Config {
  discord: DiscordConfig;
  logging: LoggingConfig;
}

export interface DiscordConfig {
  token: string;
  logChannelId: string;
  guildId: string;
  logColours: LogMessageColours;
}

export interface LoggingConfig {
  enableConsoleLogs: boolean;
  consoleLogLevel: LogLevel;
  files: LogFile[];
}

export interface LogFile {
  path: string;
  filename: string;
  logLevel: LogLevel;
}

export interface LogMessageColours {
  userJoined: ColorResolvable;
  userLeft: ColorResolvable;
  messageCreated: ColorResolvable;
  messageUpdated: ColorResolvable;
  messageDeleted: ColorResolvable;
}
