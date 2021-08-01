import { LogLevel } from "./logLevel";

export default interface LogFile {
  path: string;
  filename: string;
  logLevel: LogLevel;
  datePattern: string;
  maxFiles?: number;
}
