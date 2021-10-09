import { ApplicationCommandData } from "discord.js";
import config from "../../config";
import * as Discord from "../../discord";

const createCommandData = async (): Promise<void> => {
  const guild = Discord.getGuild();

  const command = await guild.commands.create(commandData);
  await command.permissions.add({
    permissions: [
      {
        id: config.discord.adminRoleId,
        type: "ROLE",
        permission: true,
      },
    ],
  });
};

const commandData: ApplicationCommandData = {
  name: "blacklist",
  description: "Blacklisted words/phrases information and options",
  type: "CHAT_INPUT",
  options: [
    {
      name: "add",
      description: "Add word/phrase to the blacklist",
      type: "SUB_COMMAND",
      options: [
        {
          name: "item",
          description: "Word/phrase to be added",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "view",
      description: "View the blacklist",
      type: "SUB_COMMAND",
    },
    {
      name: "remove",
      description: "Remove word/phrase from the blacklist",
      type: "SUB_COMMAND",
      options: [
        {
          name: "item",
          description: "Word/phrase to be removed",
          type: "STRING",
          required: true,
        },
      ],
    },
  ],
  defaultPermission: false,
};

export default createCommandData;
