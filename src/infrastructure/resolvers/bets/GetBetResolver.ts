import { Resolver, Query, Arg, ID, FieldResolver, Root } from "type-graphql";
import { Service } from "typedi";
import { Bet } from "../../../application/models/Bet";
import { IBet } from "../../../domain/entities/IBet";
import { GetBetUseCase } from "../../../application/usecases/bets/GetBetUseCase";
import { User } from "../../../application/models/User";
import { GetUserUseCase } from "../../../application/usecases/users/GetUserUseCase";
import { IUser } from "../../../domain/entities/IUser";

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
    return await this.getBetUseCase.execute(id);
  }

  @FieldResolver(() => User, { name: "user" })
  async user(@Root() bet: Bet): Promise<IUser> {
    return this.getUserUseCase.execute(bet.userId);
  }
}
