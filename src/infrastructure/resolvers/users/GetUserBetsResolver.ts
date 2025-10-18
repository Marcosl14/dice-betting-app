import { Resolver, FieldResolver, Root } from "type-graphql";
import { Service } from "typedi";
import { Bet } from "../../../application/models/Bet";
import { GraphQlErrorHandling } from "../errors/GraphQlErrorHandling";
import { BetDataLoader } from "../bets/loaders/BetDataLoader";
import { IBet } from "../../../domain/entities/IBet";
import { User } from "../../../application/models/User";
import { UserModel } from "../../database/sequelize-postgres/models/UserModel";

@Service()
@Resolver(() => User)
export class GetUserBetsResolver {
  constructor(private readonly betDataLoader: BetDataLoader) {}

  @FieldResolver(() => [Bet], { name: "bets" })
  async bets(@Root() user: UserModel): Promise<IBet[]> {
    try {
      return await this.betDataLoader.load(user.id);
    } catch (error) {
      GraphQlErrorHandling.handle(error as Error);
      throw error;
    }
  }
}
