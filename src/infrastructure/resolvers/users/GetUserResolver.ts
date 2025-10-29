import { Resolver, Query, Arg, Int } from "type-graphql";
import { Service } from "typedi";
import { User } from "../../../application/models/User";
import { IUser } from "../../../domain/entities/IUser";
import { GetUserUseCase } from "../../../application/usecases/users/GetUserUseCase";
import { GraphQlErrorHandling } from "../errors/GraphQlErrorHandling";

@Service()
@Resolver(() => User)
export class GetUserResolver {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  @Query(() => User)
  async getUser(
    @Arg("id", () => Int, { nullable: false }) id: number
  ): Promise<IUser> {
    try {
      return await this.getUserUseCase.execute(id);
    } catch (error) {
      throw GraphQlErrorHandling.handle(error as Error);
    }
  }
}
