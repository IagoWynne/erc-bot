export type LogLevel = "debug" | "verbose" | "info" | "warn" | "error";

export interface Config {
  discord: DiscordConfig;
  logging: LoggingConfig;
}

export interface DiscordConfig {
  token: string;
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
