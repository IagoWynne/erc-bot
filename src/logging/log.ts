import * as winston from "winston";

const debug = (message: string) => winston.debug(message);

const verbose = (message: string) => winston.verbose(message);

const info = (message: string) => winston.info(message);

const warn = (message: string) => winston.warn(message);

const error = (error: Error) => winston.error(error.stack);

export default { debug, verbose, info, warn, error };
