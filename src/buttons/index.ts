import {
  MessageButton,
  TextChannel,
  MessageActionRow,
  MessageOptions,
  MessageEmbed,
  Client,
} from "discord.js";
import { Log } from "../logging";
import * as Discord from "../discord";
import config from "../config";
import ButtonRowConfig from "../types/config/buttons/buttonRowConfig";
import ButtonConfig from "../types/config/buttons/buttonConfig";
import onButtonInteraction from "./onInteraction";

const buttonRoleMap: { [key: string]: string } = {};

const createButton = (config: ButtonConfig): MessageButton =>
  new MessageButton({
    customId: config.id,
    style: "PRIMARY",
    label: config.label,
    emoji: config.emoji,
  });

const createButtons = (buttonsConfig: ButtonConfig[]): MessageButton[] =>
  buttonsConfig.map((config) => createButton(config));

const createButtonMessage = (
  buttonRowConfig: ButtonRowConfig
): MessageOptions => {
  const embed = new MessageEmbed();

  if (buttonRowConfig.message.content) {
    embed.addField(
      buttonRowConfig.message.title,
      buttonRowConfig.message.content
    );
  }

  return {
    embeds: [embed],
    components: [
      new MessageActionRow({
        components: createButtons(buttonRowConfig.buttons),
      }),
    ],
  };
};

const createButtonMessages = async (client: Client) => {
  const roleChannel = client.channels.cache.get(
    config.discord.roleChannelId
  ) as TextChannel;

  const messagesExist =
    (await roleChannel.messages.fetch({ limit: 1 })).size > 0;

  config.buttons.buttonRows.forEach((row: ButtonRowConfig) => {
    row.buttons.forEach((b) => (buttonRoleMap[b.id] = b.roleId));

    if (!messagesExist) {
      const message = createButtonMessage(row);
      roleChannel.send(message);
    }
  });
};

const initButtons = async () => {
  Log.debug("Initiating buttons...");

  const client = Discord.getClient();

  await createButtonMessages(client);

  client.on("interactionCreate", onButtonInteraction(buttonRoleMap));

  Log.debug("Buttons initiated!");
};

export default initButtons;
