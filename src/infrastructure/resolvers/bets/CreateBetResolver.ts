import { Resolver, Mutation, Arg, Float, Int } from "type-graphql";
import { Service } from "typedi";
import { Bet } from "../../../application/models/Bet";
import { IBet } from "../../../domain/entities/IBet";
import { CreateBetUseCase } from "../../../application/usecases/bets/CreateBetUseCase";
import { CreateBetDTO } from "../../../application/dtos/CreateBetDTO";
import { GraphQlErrorHandling } from "../errors/GraphQlErrorHandling";

@Service()
@Resolver(() => Bet)
export class CreateBetResolver {
  constructor(private readonly createBetUseCase: CreateBetUseCase) {}

  @Mutation(() => Bet)
  async createBet(
    @Arg("userId", () => Int) userId: number,
    @Arg("betAmount", () => Float) betAmount: number,
    @Arg("chance", () => Float) chance: number,
    @Arg("payout", () => Float) payout: number,
    @Arg("win", () => Boolean) win: boolean
  ): Promise<IBet> {
    try {
      return await this.createBetUseCase.execute(
        new CreateBetDTO(userId, betAmount, chance, payout, win)
      );
    } catch (error) {
      GraphQlErrorHandling.handle(error as Error);
      throw error;
    }
  }
}
