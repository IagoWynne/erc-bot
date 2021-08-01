import { replace } from "ramda";

const getCommandContent = (content: string): string =>
  replace(/([^\s]+)\s/, "", content);

export default getCommandContent;
