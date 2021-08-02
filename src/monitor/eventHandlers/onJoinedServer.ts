import { GuildMember } from "discord.js";
import { compose } from "ramda";
import config from "../../config";
import { Log } from "../../logging";
import LogChannelMessage from "../../types/monitor/LogChannelMessage";
import { makeBold } from "../chatLog/formatMessages";
import getUserName from "../../messages/getUserName";
import { sendMessageToLogChannel } from "../../messages";

const handleJoinedServer = (member: GuildMember): LogChannelMessage => {
  const memberUsername = getUserName(member, member.user);

  Log.debug(`New Member: ${memberUsername} (${member.user.tag})`);

  return {
    author: {
      name: memberUsername,
      iconURL: member.user.avatarURL() || undefined,
    },
    title: "User Joined",
    colour: config.discord.logColours.userJoined,
    description: makeBold("User Joined"),
    content: `ID: ${member.user.id}\nTag: ${member.user.tag}`,
  };
};

const onJoinedServer = compose(sendMessageToLogChannel, handleJoinedServer);

export default onJoinedServer;
