import ButtonsConfig from "./buttons/buttonsConfig";
import CommandsConfig from "./commands/commandsConfig";
import DatabaseConfig from "./database/databaseConfig";
import DiscordConfig from "./discord/discordConfig";
import LoggingConfig from "./logging/loggingConfig";

export default interface Config {
  discord: DiscordConfig;
  logging: LoggingConfig;
  commands: CommandsConfig;
  buttons: ButtonsConfig;
  blacklistedPhrases: string[];
  database: DatabaseConfig;
}
