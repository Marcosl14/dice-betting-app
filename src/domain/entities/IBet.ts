export interface IBet {
  id: number;
  userId: number;
  betAmount: number;
  chance: number;
  payout: number;
  win: boolean;
}
