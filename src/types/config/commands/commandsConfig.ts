import RoleMatchConfig from "./roleMatchConfig";

export default interface CommandsConfig {
  prefix: string;
  helpMessage: string;
  roles: RoleMatchConfig[];
}
