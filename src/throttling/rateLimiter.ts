import { RateLimiter as Limiter } from "limiter";

export class RateLimiter {
  private userLimiters: {
    [key: string]: Limiter;
  } = {};

  private amount: number;
  private interval: number;

  constructor(amount: number, interval: number) {
    this.amount = amount;
    this.interval = interval;
  }

  public take(key: string): boolean {
    let userLimiter = this.userLimiters[key];

    if (!userLimiter) {
      userLimiter = new Limiter({
        tokensPerInterval: this.amount,
        interval: this.interval,
      });

      this.userLimiters[key] = userLimiter;
    }

    if (userLimiter.getTokensRemaining() < 1) {
      return true;
    }

    userLimiter.tryRemoveTokens(1);

    return false;
  }

  public getRemainingMilliseconds(key: string): number {
    const userLimiter = this.userLimiters[key];

    const remainingMilliseconds = userLimiter
      ? this.interval - this.interval * userLimiter.getTokensRemaining()
      : 0;

    return remainingMilliseconds;
  }

  public clearExpiredLimiters() {
    Object.keys(this.userLimiters).forEach((key) => {
      delete this.userLimiters[key];
    });
  }
}
