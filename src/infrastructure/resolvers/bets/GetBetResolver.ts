import { Resolver, Query, Arg, Int } from "type-graphql";
import { Service } from "typedi";
import { Bet } from "../../../application/models/Bet";
import { IBet } from "../../../domain/entities/IBet";
import { GetBetUseCase } from "../../../application/usecases/bets/GetBetUseCase";
import { GraphQlErrorHandling } from "../errors/GraphQlErrorHandling";

@Service()
@Resolver(() => Bet)
export class GetBetResolver {
  constructor(private readonly getBetUseCase: GetBetUseCase) {}

  @Query(() => Bet)
  async getBet(
    @Arg("id", () => Int, { nullable: false }) id: number
  ): Promise<IBet> {
    try {
      return await this.getBetUseCase.execute(id);
    } catch (error) {
      throw GraphQlErrorHandling.handle(error as Error);
    }
  }
}
