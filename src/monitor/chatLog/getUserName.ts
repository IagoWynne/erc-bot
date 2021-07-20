import { GuildMember, PartialGuildMember, User } from "discord.js";

const getUserName = (
  member?: GuildMember | PartialGuildMember | null,
  user?: User | null
): string => {
  const name = member?.nickname || user?.username || "";

  return user?.bot ? `${name} [BOT]` : name;
};

export default getUserName;
