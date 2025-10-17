import { Resolver, Query, Arg, ID } from "type-graphql";
import { Service } from "typedi";
import { User } from "../../../application/models/User";
import { IUser } from "../../../domain/entities/IUser";
import { GetUserUseCase } from "../../../application/usecases/users/GetUserUseCase";

@Service()
@Resolver(() => User)
export class GetUserResolver {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  @Query(() => User)
  async getUser(
    @Arg("id", () => ID, { nullable: false }) id: number
  ): Promise<IUser> {
    return await this.getUserUseCase.execute(id);
  }
}
