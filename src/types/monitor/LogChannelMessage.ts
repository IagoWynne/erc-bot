import { ColorResolvable } from "discord.js";
import ChatLogAuthor from "./chatLogAuthor";

export default interface LogChannelMessage {
  author: ChatLogAuthor;
  colour: ColorResolvable;
  title: string;
  description: string;
  content?: string;
  url?: string;
  attachmentUrls?: string[];
}
