import { Resolver, Query } from "type-graphql";
import { Service } from "typedi";
import { User } from "../../../application/models/User";
import { IUser } from "../../../domain/entities/IUser";
import { GetUserListUseCase } from "../../../application/usecases/users/GetUserListUseCase";

@Service()
@Resolver(() => User)
export class GetUserListResolver {
  constructor(private readonly getUserListUseCase: GetUserListUseCase) {}

  @Query(() => [User])
  async getUserList(): Promise<IUser[]> {
    return await this.getUserListUseCase.execute();
  }
}
