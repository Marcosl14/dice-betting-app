import { Inject, Service } from "typedi";
import { IUser } from "../../../domain/entities/IUser";
import { IUsersRepository } from "../../../domain/repositories/IUsersRepository";
import { UsersRepository } from "../../../infrastructure/adapters/repositories/UsersRepository";

@Service()
export class GetUserListUseCase {
  constructor(
    @Inject(() => UsersRepository)
    private readonly usersRepository: IUsersRepository
  ) {}

  public async execute(userIds?: number[]): Promise<IUser[]> {
    return await this.usersRepository.findAll(userIds);
  }
}
