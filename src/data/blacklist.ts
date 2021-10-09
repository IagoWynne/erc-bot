import { MongoClient } from "mongodb";
import { indexOf, remove } from "ramda";
import config from "../config";
import { Log } from "../logging";
import { sendMessageToLogChannel } from "../messages";

let blacklistedPhrases: string[];

const updateMongoDocument = async () => {
  Log.debug("Updating blacklist mongodb document...");
  try {
    const mongoClient = new MongoClient(`mongodb://${config.database.url}`);

    await mongoClient.connect();
    const db = mongoClient.db();
    const collection = db.collection("config");
    await collection.findOneAndUpdate(
      { name: "blacklist" },
      { $set: { data: blacklistedPhrases } }
    );
    await mongoClient.close();
    Log.debug("Blacklist update complete.");
  } catch (e) {
    sendMessageToLogChannel({
      author: {
        name: "ERC Bot",
      },
      colour: config.discord.logColours.commandError,
      title: "Database error",
      description:
        "Blacklist update failed. Added/removed phrase(s) will persist until next restart. Please check error logs for details.",
    });
    Log.error(e);
  }
};

const add = async (newPhrase: string): Promise<void> => {
  const idx = indexOf(newPhrase.toLowerCase(), blacklistedPhrases);

  if (idx === -1) {
    blacklistedPhrases.push(newPhrase.toLowerCase());
  }

  await updateMongoDocument();
};

const bulkAdd = async (phrases: string[]): Promise<void> => {
  blacklistedPhrases = [...blacklistedPhrases, ...phrases];

  await updateMongoDocument();
};

const get = (): string[] => blacklistedPhrases;

const fetch = async (): Promise<string[]> => {
  const mongoClient = new MongoClient(`mongodb://${config.database.url}`);

  await mongoClient.connect();
  const db = mongoClient.db();
  const collection = db.collection("config");
  const blacklistDoc = await collection.findOne({ name: "blacklist" });

  if (!blacklistDoc) {
    await collection.insertOne({ name: "blacklist", data: [] });
  }
  await mongoClient.close();

  blacklistedPhrases = blacklistDoc ? (blacklistDoc.data as string[]) : [];

  return blacklistedPhrases;
};

const removeItem = async (phraseToRemove: string): Promise<void> => {
  const idx = indexOf(phraseToRemove.toLowerCase(), blacklistedPhrases);

  if (idx > -1) {
    blacklistedPhrases = remove(idx, 1, blacklistedPhrases);
  }

  await updateMongoDocument();
};

export { add, bulkAdd, fetch, get, removeItem as remove };
