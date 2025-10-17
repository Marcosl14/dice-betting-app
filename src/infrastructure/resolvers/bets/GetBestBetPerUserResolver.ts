import { Resolver, Query, Arg, Int } from "type-graphql";
import { Service } from "typedi";
import { Bet } from "../../../application/models/Bet";
import { IBet } from "../../../domain/entities/IBet";
import { GetBestBetPerUserUseCase } from "../../../application/usecases/bets/GetBestBetPerUserUseCase";

@Service()
@Resolver(() => Bet)
export class GetBestBetPerUserResolver {
  constructor(
    private readonly getBestBetPerUserUseCase: GetBestBetPerUserUseCase
  ) {}

  @Query(() => [Bet])
  async getBestBetPerUser(
    @Arg("limit", () => Int, { nullable: false }) limit: number
  ): Promise<IBet[]> {
    return await this.getBestBetPerUserUseCase.execute(limit);
  }
}
