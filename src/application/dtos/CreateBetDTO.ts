export class CreateBetDTO {
  constructor(
    public userId: number,
    public betAmount: number,
    public chance: number,
    public payout: number,
    public win: boolean
  ) {}
}
