import { replace, toLower } from "ramda";

const getCommandContent = (content: string): string =>
  toLower(replace(/([^\s]+)\s/, "", content));

export default getCommandContent;
