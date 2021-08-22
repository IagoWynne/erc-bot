import RoleCommandConfig from "./roleMatchConfig";

export default interface CommandsConfig {
  prefix: string;
  helpMessage: string;
  roles: RoleCommandConfig[];
}
