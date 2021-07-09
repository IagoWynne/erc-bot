import {Client} from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();
const client = new Client();

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}`);
});

const token = process.env.TOKEN;
console.log(token);

client.login(process.env.TOKEN);