import { User } from "discord.js";
import { Log } from "../../logging";

const sendDmToUser = async (user: User, message: string) => {
  Log.debug(`Sending DM to user ${user.tag}: ${message}`);

  try {
    await user.send(message);
  } catch (e) {
    Log.error(e);
  }
};

export default sendDmToUser;
