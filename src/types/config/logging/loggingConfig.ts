import LogFile from "./logFile";
import { LogLevel } from "./logLevel";

export default interface LoggingConfig {
  enableConsoleLogs: boolean;
  consoleLogLevel: LogLevel;
  files: LogFile[];
}
