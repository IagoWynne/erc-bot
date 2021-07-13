import { Client } from "discord.js";
import { Log } from "../logging";
import onMessageCreated from "./onMessageCreated";

const initMonitor = (client: Client) => {
  Log.debug("Initiating monitor");
  client.on("message", onMessageCreated);
};

export default initMonitor;
