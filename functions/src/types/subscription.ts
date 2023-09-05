export type Subscription = {
  active: boolean;
  subscription_start: Date;
  current_period_start: Date;
  current_period_end: Date;
  id: string;
};
