import { find, includes } from "ramda";
import config from "../../config";
import RoleCommandConfig from "../../types/config/commands/roleMatchConfig";

const getRoleId = (roleAlias: string) =>
  find(
    (roleMatchConfig: RoleCommandConfig) =>
      includes(roleAlias, roleMatchConfig.aliases),
    config.commands.roles
  )?.roleId;

export default getRoleId;
