import { Resolver, Query } from "type-graphql";
import { Service } from "typedi";
import { Bet } from "../../../application/models/Bet";
import { IBet } from "../../../domain/entities/IBet";
import { GetBetListUseCase } from "../../../application/usecases/bets/GetBetListUseCase";
import { GraphQlErrorHandling } from "../errors/GraphQlErrorHandling";

@Service()
@Resolver(() => Bet)
export class GetBetListResolver {
  constructor(private readonly getBetListUseCase: GetBetListUseCase) {}

  @Query(() => [Bet])
  async getBetList(): Promise<IBet[]> {
    try {
      return await this.getBetListUseCase.execute();
    } catch (error) {
      throw GraphQlErrorHandling.handle(error as Error);
    }
  }
}
