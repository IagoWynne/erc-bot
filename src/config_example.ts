import Config from "./types/config/config";

const config: Config = {
  discord: {
    token: "SECRET TOKEN",
    logChannelId: "12345",
    roleChannelId: "12345",
    guildId: "12345",
    logColours: {
      userJoined: 0,
      userLeft: 0,
      messageCreated: 0,
      messageUpdated: 0x000000,
      messageDeleted: 0x000000,
      channelPurged: 0x000000,
      commandUsed: 0x000000,
      botUpdate: 0x000000,
      commandError: 0xff0000,
    },
    channels: [
      {
        channelId: "12345",
        throttling: {
          tokenRefreshHours: 24,
          charLimit: 600,
          newLineLimit: 1,
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
    helpMessage:
      "*Add a role*\n`.iam ROLE`\n\n*Remove a role:*\n`.iamnot ROLE`\n(ROLE being job acronym, DRK, SAM, BLM, etc.)\n\n*Add raid leader tag (to post on #clear_screenshots)*\n`.iam RL`\n\n*Add guest tag (to not receive pings anymore)*\n`.iam guest`\n\nPlease note that you still need to remove your previous roles manually.\nIf you've accidentally deleted your message in LFG/LFM channel, please note that the moderation team cannot help you bypass the posting limit. Please post on #party_finder until your limit is lifted.",
  },
  buttons: {
    buttonRows: [
      {
        message: {
          title: "Datacenter Choice",
          content: "Example text that can be removed or replaced",
        },
        buttons: [
          {
            id: "chaos_data_center",
            label: "Chaos",
            roleId: "12345",
            emoji: "black_heart",
          },
          {
            id: "light_data_center",
            label: "Light",
            roleId: "12345",
            emoji: "white_heart",
          },
        ],
      },
      {
        message: {
          title: "Role Choice",
          content: "Example text that can be removed or replaced",
        },
        buttons: [
          {
            id: "tank_role",
            label: "Tank",
            roleId: "12345",
            emoji: "blue_heart",
          },
          {
            id: "healer_role",
            label: "Healer",
            roleId: "12345",
            emoji: "green_heart",
          },
          {
            id: "melee_role",
            label: "Melee",
            roleId: "12345",
            emoji: "heart",
          },
          {
            id: "ranged_role",
            label: "Ranged",
            roleId: "12345",
            emoji: "yellow_heart",
          },
          {
            id: "caster_role",
            label: "Caster",
            roleId: "12345",
            emoji: "purple_heart",
          },
        ],
      },
      {
        message: {
          title: "Raid Leader Selection",
          content: "Example text that can be removed or replaced",
        },
        buttons: [
          {
            id: "raid_leader_role",
            label: "Raid Leader",
            roleId: "",
            emoji: "crown",
          },
        ],
      },
    ],
  },
};

export default config;
