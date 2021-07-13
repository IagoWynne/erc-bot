import { compose, forEach } from "ramda";
import * as winston from "winston";
import config from "../config";
import { LogFile } from "../types/config";

const timestampFormatting = winston.format.timestamp({
  format: "YYYY-MM-DD HH:mm:ss",
});

const colourisedFormatting = winston.format.colorize({
  all: true,
});

const printFromatting = winston.format.printf(
  (info) => `[${info.timestamp}][${info.level}]: ${info.message}`
);

const initConsoleLogging = () =>
  winston.add(
    new winston.transports.Console({
      level: config.logging.consoleLogLevel,
      format: winston.format.combine(
        timestampFormatting,
        colourisedFormatting,
        printFromatting
      ),
    })
  );

const addLogFile = (fileConfig: LogFile) =>
  winston.add(
    new winston.transports.File({
      filename: `${fileConfig.path}${fileConfig.filename}`,
      level: fileConfig.logLevel,
      format: winston.format.combine(timestampFormatting, printFromatting),
    })
  );

const initFileLogging = () =>
  forEach((fileConfig: LogFile) => addLogFile(fileConfig))(
    config.logging.files
  );

const initLogging = compose(
  config.logging.enableConsoleLogs ? initConsoleLogging : () => {},
  initFileLogging
);

export default initLogging;
