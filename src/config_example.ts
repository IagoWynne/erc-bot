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
    welcomeMessage:
      "***PLEASE READ THE FOLLOWING!***\r\n \r\nHello :NAME:! I am the Europe Raiding Central Bot. Please make sure to read the rules in #announcements before posting.\r\n \r\nIn order to identify yourself and post on our channels, you need to assign yourself a job role and a datacenter role. Please reply to this private message with one of the following commands based on your primary role in FFXIV (exactly as written below):\r\n \r\n```\r\n.iam PLD\r\n.iam WAR\r\n.iam DRK\r\n.iam GNB\r\n.iam WHM\r\n.iam SCH\r\n.iam AST\r\n.iam MCH\r\n.iam BRD\r\n.iam DNC\r\n.iam BLM\r\n.iam SMN\r\n.iam RDM\r\n.iam MNK\r\n.iam DRG\r\n.iam NIN\r\n.iam SAM\r\n```\r\n \r\nYou will also need to assign your relevant datacenter in order to see the recruitment categories:\r\n \r\n```\r\n.iam Light\r\n.iam Chaos\r\n```\r\n \r\nTo learn more about adding/removing roles, type:\r\n`.help`\r\n \r\nDo not hesitate to contact the admins should you have any questions.\r\n \r\nSee you soon!",
  },
  logging: {
    enableConsoleLogs: true,
    consoleLogLevel: "debug",
    files: [
      {
        path: ".",
        filename: "%DATE%-errors.log",
        logLevel: "error",
        datePattern: "YYYY-MM-DD",
      },
      {
        path: "./",
        filename: "%DATE%-info.log",
        logLevel: "info",
        datePattern: "YYYY-MM-DD",
        maxFiles: 5,
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
