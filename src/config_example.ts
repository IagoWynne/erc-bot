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
      channelPurged: 0x000000,
      commandUsed: 0x000000,
    },
    channels: [
      {
        channelId: "12345",
        throttling: {
          tokenRefreshHours: 1,
        },
      },
      {
        channelId: "12345",
        throttling: {
          tokenRefreshHours: 2,
        },
      },
    ],
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
    roles: [
      {
        roleId: "123",
        aliases: ["casters", "caster", "mage", "smn", "blm", "rdm"],
      },
      {
        roleId: "123",
        aliases: ["ranged", "rangeds", "mch", "brd", "dnc"],
      },
      {
        roleId: "123",
        aliases: ["melee", "melees", "mnk", "nin", "sam", "drg"],
      },
      { roleId: "123", aliases: ["healer", "whm", "sch", "ast"] },
      { roleId: "123", aliases: ["tanks", "pld", "drk", "war", "tank", "gnb"] },
      { roleId: "Guest", aliases: ["guest"] },
      {
        roleId: "123",
        aliases: ["chaos", "datacenter chaos", "data center chaos", "dc chaos"],
      },
      {
        roleId: "123",
        aliases: ["datacenter light", "data center light", "light", "dc light"],
      },
      {
        roleId: "123",
        aliases: ["raidlead", "raidleader", "rl", "raidleaders", "raid lead"],
      },
    ],
    helpMessage: "",
  },
};

export default config;
