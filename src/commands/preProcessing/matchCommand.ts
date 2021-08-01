import { Message } from "discord.js";
import { split } from "ramda";
import { Log } from "../../logging";
import handleCheckCommand from "../check";
import handleHelpCommand from "../handleHelpCommand";
import { handleAddRoleCommand, handleRemoveRoleCommand } from "../roles";

const matchCommand = (
  messageContent: string
): ((m: Message) => void) | undefined => {
  Log.debug(`Received potential command: ${messageContent}`);

  switch (split(" ", messageContent)[0]) {
    case "help": {
      Log.debug(`Matched ${messageContent} to help command`);
      return handleHelpCommand;
    }
    case "iam": {
      Log.debug(`Matched ${messageContent} to iam command`);
      return handleAddRoleCommand;
    }
    case "iamnot": {
      Log.debug(`Matched ${messageContent} to iamnot command`);
      return handleRemoveRoleCommand;
    }
    case "check": {
      Log.debug(`Matched ${messageContent} to check command`);
      return handleCheckCommand;
    }
  }

  Log.debug(`${messageContent} did not match any command`);

  return;
};

export default matchCommand;
