import { find, includes } from "ramda";
import config from "../../config";
import RoleMatchConfig from "../../types/config/commands/roleMatchConfig";

const getRoleId = (roleAlias: string) =>
  find(
    (roleMatchConfig: RoleMatchConfig) =>
      includes(roleAlias, roleMatchConfig.aliases),
    config.commands.roles
  )?.roleId;

export default getRoleId;
