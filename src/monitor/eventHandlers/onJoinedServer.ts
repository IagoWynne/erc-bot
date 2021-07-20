import { GuildMember } from "discord.js";
import { compose } from "ramda";
import config from "../../config";
import { Log } from "../../logging";
import ChatLogInfo from "../../types/monitor/chatLogInfo";
import { makeBold } from "../chatLog/formatMessages";
import getUserName from "../../messages/getUserName";
import sendChatlogMessage from "../chatLog/sendChatLogMessage";

const handleJoinedServer = (member: GuildMember): ChatLogInfo => {
  const memberUsername = getUserName(member, member.user);

  Log.debug(`New Member: ${memberUsername} (${member.user.tag})`);

  return {
    author: {
      name: memberUsername,
      iconURL: member.user.avatarURL() || undefined,
    },
    colour: config.discord.logColours.userJoined,
    description: makeBold("User Joined"),
    content: `ID: ${member.user.id}\nTag: ${member.user.tag}`,
  };
};

const onJoinedServer = compose(sendChatlogMessage, handleJoinedServer);

export default onJoinedServer;
