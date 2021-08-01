import { Message } from "discord.js";
import { replace, match } from "ramda";
import { deleteTriggerMessage, sendDmToUser } from "../../messages";
import getUserName from "../../messages/getUserName";
import ThrottlingConfig from "../../types/config/discord/throttlingConfig";

const hasTooManyCharacters = (charCount: number, charLimit?: number): boolean =>
  charLimit ? charCount > charLimit : false;

const hasTooManyNewLines = (
  newLines: number,
  newLinesLimit?: number
): boolean => (newLinesLimit ? newLines > newLinesLimit : false);

const getMessageCharacters = replace(/\<(.*?)\>/, "");

const hasBrokenRules = (
  message: Message,
  throttlingConfig: ThrottlingConfig
): {
  charLimit: boolean;
  totalChars: number;
  newLineLimit: boolean;
  newLines: number;
} => {
  const messageContent = getMessageCharacters(message.content);
  console.log(messageContent);
  const totalChars = messageContent.length;
  const newLines = match(/\n/g, message.content).length;
  console.log(newLines);
  console.log(throttlingConfig.newLineLimit);

  return {
    charLimit: hasTooManyCharacters(totalChars, throttlingConfig.charLimit),
    totalChars,
    newLineLimit: hasTooManyNewLines(newLines, throttlingConfig.newLineLimit),
    newLines,
  };
};

const onRulesBroken = (
  message: Message,
  brokenRules: {
    charLimit: boolean;
    totalChars: number;
    newLineLimit: boolean;
    newLines: number;
  },
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
    }\nTo check the length of your ad, reply to this message with \`.check [your ad]\``
  );
};

export { hasBrokenRules, onRulesBroken };
