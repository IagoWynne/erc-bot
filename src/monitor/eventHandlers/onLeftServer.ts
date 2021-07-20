import { GuildMember, PartialGuildMember } from "discord.js";
import { compose } from "ramda";
import config from "../../config";
import { Log } from "../../logging";
import ChatLogInfo from "../../types/monitor/chatLogInfo";
import { makeBold } from "../chatLog/formatMessages";
import getUserName from "../chatLog/getUserName";
import sendChatlogMessage from "../chatLog/sendChatLogMessage";

const handleLeftServer = (
  member: GuildMember | PartialGuildMember
): ChatLogInfo => {
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
    colour: config.discord.logColours.userLeft,
    description: makeBold("User Left"),
    content: member.user
      ? `ID: ${member.user.id}\nTag: ${member.user.tag}`
      : "Could not retrieve user details",
  };
};

const onLeftServer = compose(sendChatlogMessage, handleLeftServer);

export default onLeftServer;
