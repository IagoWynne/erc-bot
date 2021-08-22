import ButtonConfig from "./buttonConfig";

export default interface ButtonRowConfig {
  message: {
    title: string;
    content: string;
  };
  buttons: ButtonConfig[];
}
