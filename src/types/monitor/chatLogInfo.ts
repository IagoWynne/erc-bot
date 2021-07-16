import { ColorResolvable } from "discord.js";
import ChatLogAuthor from "./chatLogAuthor";

export default interface ChatLogInfo {
  author: ChatLogAuthor;
  colour: ColorResolvable;
  description: string;
  content?: string;
}
