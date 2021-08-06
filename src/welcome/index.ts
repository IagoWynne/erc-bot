import { GuildMember } from "discord.js";
import { replace } from "ramda";
import config from "../config";
import { sendDmToUser } from "../messages";
import getUserName from "../messages/getUserName";
import * as Discord from "../discord";
import { Log } from "../logging";

const initWelcomeMessage = async () => {
  Log.debug("Initiating welcome message...");

  await Discord.fetchGuild();
  Discord.getClient().on("guildMemberAdd", sendWelcomeMessage);

  Log.debug("Welcome message initiated!");
};

const sendWelcomeMessage = async (member: GuildMember) => {
  const guild = Discord.getGuild();
  await guild.members.fetch(member);
  await sendDmToUser(
    member.user,
    formatWelcomeMessage(getUserName(member, member.user)),
    {
      author: {
        name: "ERC Bot",
      },
      colour: config.discord.logColours.botUpdate,
      title: "Welcome Message Sent",
      description: `${member.user.tag} - ${member.user.id}`,
    }
  );
};

const formatWelcomeMessage = (username: string): string =>
  insertUserName(username)(config.discord.welcomeMessage);

const insertUserName = (username: string) => replace(":NAME:", username);

export default initWelcomeMessage;
