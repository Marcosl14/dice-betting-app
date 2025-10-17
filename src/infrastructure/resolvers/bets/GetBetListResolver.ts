import { Resolver, Query } from "type-graphql";
import { Service } from "typedi";
import { Bet } from "../../../application/models/Bet";
import { IBet } from "../../../domain/entities/IBet";
import { GetBetListUseCase } from "../../../application/usecases/bets/GetBetListUseCase";

@Service()
@Resolver(() => Bet)
export class GetBetListResolver {
  constructor(private readonly getBetListUseCase: GetBetListUseCase) {}

  @Query(() => [Bet])
  async getBetList(): Promise<IBet[]> {
    return await this.getBetListUseCase.execute();
  }
}
