import { GuildMember, PartialGuildMember } from "discord.js";
import { compose } from "ramda";
import config from "../../config";
import { Log } from "../../logging";
import LogChannelMessage from "../../types/monitor/LogChannelMessage";
import { makeBold } from "../chatLog/formatMessages";
import getUserName from "../../messages/getUserName";
import { sendMessageToLogChannel } from "../../messages";

const handleLeftServer = (
  member: GuildMember | PartialGuildMember
): LogChannelMessage => {
  const memberUsername = getUserName(member, member.user);

  Log.debug(
    `Member Left: ${memberUsername}${
      member.user ? ` (${member.user?.tag})` : ""
    }`
  );

  return {
    author: {
      name: memberUsername,
      iconURL: member.user?.avatarURL() || undefined,
    },
    title: "User Left",
    colour: config.discord.logColours.userLeft,
    description: makeBold("User Left"),
    content: member.user
      ? `ID: ${member.user.id}\nTag: ${member.user.tag}`
      : "Could not retrieve user details",
  };
};

const onLeftServer = compose(sendMessageToLogChannel, handleLeftServer);

export default onLeftServer;
