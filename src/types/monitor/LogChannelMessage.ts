import { ColorResolvable } from "discord.js";
import ChatLogAuthor from "./chatLogAuthor";

export default interface LogChannelMessage {
  author: ChatLogAuthor;
  colour: ColorResolvable;
  description: string;
  content?: string;
}
