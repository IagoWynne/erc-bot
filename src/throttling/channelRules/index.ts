import { Message, TextChannel } from "discord.js";
import config from "../../config";
import { deleteTriggerMessage, sendDmToUser } from "../../messages";
import getUserName from "../../messages/getUserName";
import ThrottlingConfig from "../../types/config/discord/throttlingConfig";
import BrokenRulesInfo from "../../types/config/throttling/brokenRulesInfo";

const onRulesBroken = (
  message: Message,
  brokenRules: BrokenRulesInfo,
  throttlingConfig: ThrottlingConfig
) => {
  deleteTriggerMessage(message);
  sendDmToUser(
    message.author,
    `Hello, ${getUserName(
      null,
      message.author
    )}, this is an automated message. Your latest message on ERC has been deleted because: ${
      brokenRules.charLimit
        ? `\n- it is too long. The limit is ${throttlingConfig.charLimit} while your message is ${brokenRules.totalChars} characters long.`
        : ""
    }${
      brokenRules.newLineLimit
        ? `\n- it has too many new lines. The limit is ${throttlingConfig.newLineLimit} while your message has ${brokenRules.newLines}.`
        : ""
    }\nTo check the length of your ad, reply to this message with \`.check [your ad]\``,
    {
      author: {
        name: "ERC Bot",
      },
      colour: config.discord.logColours.botUpdate,
      title: "Removed LFG/LFM Message",
      description: `Removed message in ${
        (message.channel as TextChannel).name
      } as it broke the rules on message length and/or new lines.\n${
        message.author.tag
      } - ${message.author.id}`,
    }
  );
};

export { onRulesBroken };
