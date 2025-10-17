import { Inject, Service } from "typedi";
import { IUser } from "../../../domain/entities/IUser";
import { IUsersRepository } from "../../../domain/repositories/IUsersRepository";
import { UsersRepository } from "../../../infrastructure/adapters/repositories/UsersRepository";

@Service()
export class GetUserUseCase {
  constructor(
    @Inject(() => UsersRepository)
    private readonly usersRepository: IUsersRepository
  ) {}

  public async execute(id: number): Promise<IUser> {
    return this.usersRepository.find(id);
  }
}
