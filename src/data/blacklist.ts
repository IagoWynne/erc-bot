import { indexOf, remove } from "ramda";

let blacklistedPhrases: string[];

const add = async (newPhrase: string): Promise<void> => {
  const idx = indexOf(newPhrase.toLowerCase(), blacklistedPhrases);

  if (idx === -1) {
    blacklistedPhrases.push(newPhrase.toLowerCase());
  }
};

const bulkAdd = async (phrases: string[]): Promise<void> => {
  blacklistedPhrases = [...blacklistedPhrases, ...phrases];
};

const get = (): string[] => blacklistedPhrases;

const fetch = async (): Promise<string[]> => {
  if (!blacklistedPhrases) {
    // temporary until hooked up to database
    blacklistedPhrases = [];
  }
  return blacklistedPhrases;
};

const removeItem = async (phraseToRemove: string): Promise<void> => {
  const idx = indexOf(phraseToRemove.toLowerCase(), blacklistedPhrases);

  if (idx > -1) {
    blacklistedPhrases = remove(idx, 1, blacklistedPhrases);
  }
};

export { add, bulkAdd, fetch, get, removeItem as remove };
