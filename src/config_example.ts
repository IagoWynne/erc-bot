import { Config } from "./types/config";

const config: Config = {
  discord: {
    token: "SECRET TOKEN",
  },
  logging: {
    enableConsoleLogs: true,
    consoleLogLevel: "debug",
    files: [
      {
        path: "./",
        filename: "errors.log",
        logLevel: "error",
      },
      {
        path: "./",
        filename: "info.log",
        logLevel: "info",
      },
    ],
  },
};

export default config;
