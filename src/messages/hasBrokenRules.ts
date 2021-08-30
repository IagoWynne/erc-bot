import { replace, match } from "ramda";
import { Log } from "../logging";
import ThrottlingConfig from "../types/config/discord/throttlingConfig";
import BrokenRulesInfo from "../types/config/throttling/brokenRulesInfo";

const hasTooManyCharacters = (charCount: number, charLimit?: number): boolean =>
  charLimit ? charCount > charLimit : false;

const hasTooManyNewLines = (
  newLines: number,
  newLinesLimit?: number
): boolean => (newLinesLimit ? newLines > newLinesLimit : false);

export const getMessageCharacters = replace(/\<(.*?)\>/g, "e");

const hasBrokenLfmRules = (
  advert: string,
  throttlingConfig: ThrottlingConfig
): BrokenRulesInfo => {
  const messageContent = getMessageCharacters(advert);
  const totalChars = messageContent.length;
  const newLines = match(/\n/g, advert).length;

  return {
    charLimit: hasTooManyCharacters(totalChars, throttlingConfig.charLimit),
    totalChars,
    newLineLimit: hasTooManyNewLines(newLines, throttlingConfig.newLineLimit),
    newLines,
  };
};

export default hasBrokenLfmRules;
