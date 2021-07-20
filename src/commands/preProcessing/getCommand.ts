import { Message } from "discord.js";
import { compose, ifElse, slice, startsWith } from "ramda";
import config from "../../config";
import matchCommand from "./matchCommand";

const startsWithCommandPrefix = (messageContent: string): boolean =>
  startsWith(config.commands.prefix, messageContent);

const getContent = (message: Message): string => message.content;

const stripPrefix = (messageContent: string): string =>
  slice(1, Infinity)(messageContent);

const getCommand = compose(
  ifElse(startsWithCommandPrefix, compose(matchCommand, stripPrefix), () => {}),
  getContent
);

export default getCommand;
