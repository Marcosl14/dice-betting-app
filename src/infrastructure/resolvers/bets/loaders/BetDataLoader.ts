import DataLoader from "dataloader";
import { IBet } from "../../../../domain/entities/IBet";
import { Service } from "typedi";
import { GetBetListUseCase } from "../../../../application/usecases/bets/GetBetListUseCase";

@Service()
export class BetDataLoader {
  private loader: DataLoader<number, IBet[]>;

  constructor(private readonly getBetListUseCase: GetBetListUseCase) {
    this.loader = new DataLoader<number, IBet[]>(
      async (userIds) => {
        const foundBets = await this.getBetListUseCase.execute({
          userIds: [...userIds],
        });

        const betMap = new Map<number, IBet[]>();
        for (const bet of foundBets) {
          const list = betMap.get(bet.userId);
          if (list) {
            list.push(bet);
          } else {
            betMap.set(bet.userId, [bet]);
          }
        }

        return userIds.map((userId) => betMap.get(userId) ?? []);
      },
      {
        cache: false,
      }
    );
  }

  public async load(userId: number): Promise<IBet[]> {
    return await this.loader.load(userId);
  }
}
