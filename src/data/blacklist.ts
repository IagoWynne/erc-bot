import { MongoClient, Document } from "mongodb";
import { indexOf, remove } from "ramda";
import config from "../config";
import { Log } from "../logging";

let blacklistedPhrases: string[];

const updateMongoDocument = async () => {
  const mongoClient = new MongoClient(`mongodb://${config.database.url}`);

  await mongoClient.connect();
  const db = mongoClient.db();
  const collection = db.collection("config");
  await collection.findOneAndUpdate(
    { name: "blacklist" },
    { $set: { data: blacklistedPhrases } }
  );
  await mongoClient.close();
};

const add = async (newPhrase: string): Promise<void> => {
  const idx = indexOf(newPhrase.toLowerCase(), blacklistedPhrases);

  if (idx === -1) {
    blacklistedPhrases.push(newPhrase.toLowerCase());
    Log.debug(blacklistedPhrases.join(", "));
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
