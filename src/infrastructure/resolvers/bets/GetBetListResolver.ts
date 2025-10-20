import { Resolver, Query, Arg, Int } from "type-graphql";
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
  async getBetList(
    @Arg("page", () => Int, { nullable: true }) page?: number,
    @Arg("limit", () => Int, { nullable: true }) limit?: number
  ): Promise<IBet[]> {
    try {
      if (!page) page = 1;
      if (!limit) limit = 100;

      return await this.getBetListUseCase.execute({
        page,
        limit,
      });
    } catch (error) {
      throw GraphQlErrorHandling.handle(error as Error);
    }
  }
}
