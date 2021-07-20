import { User } from "discord.js";

const getUserTag = (user: User | null): string => {
  return user?.tag || "Could not retrieve tag";
};

export default getUserTag;
