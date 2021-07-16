import Config from "./types/config/config";

const config: Config = {
  discord: {
    token: "SECRET TOKEN",
    logChannelId: "12345",
    guildId: "12345",
    logColours: {
      userJoined: 0,
      userLeft: 0,
      messageCreated: "blue",
      messageUpdated: 0x00ff00,
      messageDeleted: "#FF0000",
    },
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
  commands: {
    prefix: ".",
    helpMessage: "",
  },
};

export default config;
