import { Resolver, FieldResolver, Root } from "type-graphql";
import { Service } from "typedi";
import { Bet } from "../../../application/models/Bet";
import { User } from "../../../application/models/User";
import { IUser } from "../../../domain/entities/IUser";
import { GraphQlErrorHandling } from "../errors/GraphQlErrorHandling";
import { BetModel } from "../../database/sequelize-postgres/models/BetModel";
import { UserDataLoader } from "../users/loaders/UserDataLoader";

@Service()
@Resolver(() => Bet)
export class GetBetUserResolver {
  constructor(private readonly userDataLoader: UserDataLoader) {}

  @FieldResolver(() => User, { name: "user" })
  async user(@Root() bet: BetModel): Promise<IUser> {
    try {
      return await this.userDataLoader.load(bet.userId);
    } catch (error) {
      throw GraphQlErrorHandling.handle(error as Error);
    }
  }
}
