import { compose } from "ramda";
import * as winston from "winston";
import { LOGGING } from "../constants/env";

const timestampFormatting = winston.format.timestamp({
  format: "YYYY-MM-DD HH:mm:ss",
});

const colourisedFormatting = winston.format.colorize({
  all: true,
});

const printFromatting = winston.format.printf(
  (info) => `${info.timestamp} ${info.level}: ${info.message}`
);

const setupConsoleLogging = () =>
  winston.add(
    new winston.transports.Console({
      level: LOGGING.CONSOLE_LOG_LEVEL,
      format: winston.format.combine(
        timestampFormatting,
        colourisedFormatting,
        printFromatting
      ),
    })
  );

const setupFileLogging = () =>
  winston.add(
    new winston.transports.File({
      filename: LOGGING.LOGFILE,
      level: "info",
      format: winston.format.combine(timestampFormatting, printFromatting),
    })
  );

const setupLogging = compose(
  LOGGING.ENABLE_CONSOLE_LOGS ? setupConsoleLogging : () => {},
  setupFileLogging
);

export default setupLogging;
