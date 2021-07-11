import * as dotenv from "dotenv";

dotenv.config();

export const DISCORD = {
  TOKEN: process.env.TOKEN,
};

export const LOGGING = {
  LOGFILE: process.env.LOGFILE,
  ENABLE_CONSOLE_LOGS: process.env.ENABLE_CONSOLE_LOGS == "true",
  CONSOLE_LOG_LEVEL: process.env.CONSOLE_LOG_LEVEL,
};
