import DataLoader from "dataloader";
import { IBet } from "../../../../domain/entities/IBet";
import { Service } from "typedi";
import { GetBetListUseCase } from "../../../../application/usecases/bets/GetBetListUseCase";

@Service()
export class BetDataLoader {
  constructor(private readonly getBetListUseCase: GetBetListUseCase) {}

  public async load(userId: number): Promise<IBet[]> {
    const loader = new DataLoader<number, IBet[]>(async (userIds) => {
      const allBets = await this.getBetListUseCase.execute({
        userIds: [...userIds],
      });

      const betsByUserId = userIds.map((userId) =>
        allBets.filter((bet) => bet.userId === userId)
      );

      return betsByUserId;
    });

    return await loader.load(userId);
  }
}
