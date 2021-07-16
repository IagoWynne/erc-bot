import CommandsConfig from "./commands/commandsConfig";
import DiscordConfig from "./discord/discordConfig";
import LoggingConfig from "./logging/loggingConfig";

export default interface Config {
  discord: DiscordConfig;
  logging: LoggingConfig;
  commands: CommandsConfig;
}
