import { Resolver, Query, Arg, Int } from "type-graphql";
import { Service } from "typedi";
import { Bet } from "../../../application/models/Bet";
import { IBet } from "../../../domain/entities/IBet";
import { GetBetListUseCase } from "../../../application/usecases/bets/GetBetListUseCase";
import { GraphQlErrorHandling } from "../errors/GraphQlErrorHandling";
import { ValidationError } from "../../../application/erros/ValidationError";

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

      this.validatePaginationParams(page, limit);

      return await this.getBetListUseCase.execute({
        page,
        limit,
      });
    } catch (error) {
      throw GraphQlErrorHandling.handle(error as Error);
    }
  }

  private validatePaginationParams(page: number, limit: number): void {
    if (isNaN(page) || isNaN(limit)) {
      throw new ValidationError("Page and limit must be numbers.");
    }

    if (page <= 0) {
      throw new ValidationError("Page number must be greater than 0.");
    }
    if (limit <= 0 || limit > 1000) {
      throw new ValidationError("Limit must be between 1 and 1000.");
    }
  }
}
