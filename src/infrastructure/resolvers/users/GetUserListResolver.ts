import { Resolver, Query } from "type-graphql";
import { Service } from "typedi";
import { User } from "../../../application/models/User";
import { IUser } from "../../../domain/entities/IUser";
import { GetUserListUseCase } from "../../../application/usecases/users/GetUserListUseCase";
import { GraphQlErrorHandling } from "../errors/GraphQlErrorHandling";

@Service()
@Resolver(() => User)
export class GetUserListResolver {
  constructor(private readonly getUserListUseCase: GetUserListUseCase) {}

  @Query(() => [User])
  async getUserList(): Promise<IUser[]> {
    try {
      return await this.getUserListUseCase.execute();
    } catch (error) {
      throw GraphQlErrorHandling.handle(error as Error);
    }
  }
}
