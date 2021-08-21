import {
  MessageButton,
  InteractionButtonOptions,
  Interaction,
  TextChannel,
  MessageActionRow,
  MessageOptions,
} from "discord.js";
import { Log } from "../logging";
import * as Discord from "../discord";
import config from "../config";
import { string } from "yargs";

const createButton = (id: string, label: string): MessageButton =>
  new MessageButton({
    customId: id,
    style: "PRIMARY",
    label: label,
  });

const createButtonRow = (
  buttonDetails: { id: string; label: string }[]
): MessageButton[] =>
  buttonDetails.map((detail) => createButton(detail.id, detail.label));

const createButtonMessage = (
  content: string,
  buttonDetails: { id: string; label: string }[]
): MessageOptions => ({
  embeds: [
    {
      title: content,
    },
  ],
  components: [
    new MessageActionRow({ components: createButtonRow(buttonDetails) }),
  ],
});

const sendButtonMessage = (messageOptions: MessageOptions) => {
  const client = Discord.getClient();

  const roleChannel = client.channels.cache.get(
    config.discord.roleChannelId
  ) as TextChannel;

  roleChannel.send(messageOptions);
};

const initButtons = () => {
  Log.debug("Initiating buttons...");

  const dataCenterMessage = createButtonMessage("Choose your datacenter", [
    { id: "chaos_data_center", label: "Chaos" },
    { id: "light_data_center", label: "Light" },
  ]);
  sendButtonMessage(dataCenterMessage);

  const rolesMessage = createButtonMessage("Choose your role(s)", [
    { id: "tank_role", label: "Tank" },
    { id: "healer_role", label: "Healer" },
    { id: "melee_dps_role", label: "Melee" },
    { id: "ranged_dps_role", label: "Ranged" },
    { id: "caster_dps_role", label: "Caster" },
  ]);
  sendButtonMessage(rolesMessage);

  const raidLeadMessage = createButtonMessage("Add or remove raid leader", [
    { id: "raid_leader", label: "Raid Leader" },
  ]);
  sendButtonMessage(raidLeadMessage);

  const client = Discord.getClient();
  client.on("interactionCreate", (interaction: Interaction) => {
    Log.debug(JSON.stringify(interaction));
  });

  Log.debug("Buttons initiated!");
};

export default initButtons;
