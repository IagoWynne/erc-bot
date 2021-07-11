import { compose } from "ramda";
import * as winston from "winston";
import { LOGGING } from "../constants/env";

const getTimestampFormatting = (): winston.Logform.Format =>
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  });

const getColourisedFormatting = (): winston.Logform.Format =>
  winston.format.colorize({
    all: true,
  });

const getPrintFromatting = (): winston.Logform.Format =>
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  );

const setupConsoleLogging = () =>
  winston.add(
    new winston.transports.Console({
      level: LOGGING.CONSOLE_LOG_LEVEL,
      format: winston.format.combine(
        getTimestampFormatting(),
        getColourisedFormatting(),
        getPrintFromatting()
      ),
    })
  );

const setupFileLogging = () =>
  winston.add(
    new winston.transports.File({
      filename: LOGGING.LOGFILE,
      level: "info",
      format: winston.format.combine(
        getTimestampFormatting(),
        getPrintFromatting()
      ),
    })
  );

const setupLogging = compose(
  LOGGING.ENABLE_CONSOLE_LOGS ? setupConsoleLogging : () => {},
  setupFileLogging
);

export default setupLogging;
