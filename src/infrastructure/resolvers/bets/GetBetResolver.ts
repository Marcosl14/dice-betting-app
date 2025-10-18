import { Resolver, Query, Arg, ID, FieldResolver, Root } from "type-graphql";
import { Service } from "typedi";
import { Bet } from "../../../application/models/Bet";
import { IBet } from "../../../domain/entities/IBet";
import { GetBetUseCase } from "../../../application/usecases/bets/GetBetUseCase";
import { User } from "../../../application/models/User";
import { GetUserUseCase } from "../../../application/usecases/users/GetUserUseCase";
import { IUser } from "../../../domain/entities/IUser";
import { GraphQlErrorHandling } from "../errors/GraphQlErrorHandling";
import { BetModel } from "../../database/sequelize-postgres/models/BetModel";

@Service()
@Resolver(() => Bet)
export class GetBetResolver {
  constructor(
    private readonly getBetUseCase: GetBetUseCase,
    private readonly getUserUseCase: GetUserUseCase
  ) {}

  @Query(() => Bet)
  async getBet(
    @Arg("id", () => ID, { nullable: false }) id: number
  ): Promise<IBet> {
    try {
      return await this.getBetUseCase.execute(id);
    } catch (error) {
      GraphQlErrorHandling.handle(error as Error);
      throw error;
    }
  }

  @FieldResolver(() => User, { name: "user" })
  async user(@Root() bet: BetModel): Promise<IUser> {
    try {
      return await this.getUserUseCase.execute(bet.userId);
    } catch (error) {
      GraphQlErrorHandling.handle(error as Error);
      throw error;
    }
  }
}
