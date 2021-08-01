export default interface ThrottlingConfig {
  tokenRefreshHours: number;
  charLimit?: number;
  newLineLimit?: number;
}
