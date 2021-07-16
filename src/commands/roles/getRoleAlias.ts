import { split } from "ramda";

const getRoleAlias = (content: string) => split(" ", content)[1];

export default getRoleAlias;
