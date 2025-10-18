import { Inject, Service } from "typedi";
import { IUser } from "../../../domain/entities/IUser";
import { IUsersRepository } from "../../../domain/repositories/IUsersRepository";
import { UsersRepository } from "../../../infrastructure/adapters/repositories/UsersRepository";
import { NotFoundError } from "../../erros/NotFoundError";

@Service()
export class GetUserUseCase {
  constructor(
    @Inject(() => UsersRepository)
    private readonly usersRepository: IUsersRepository
  ) {}

  public async execute(id: number): Promise<IUser> {
    const user = await this.usersRepository.find(id);

    if (!user) {
      throw new NotFoundError(`User id ${id} not found`);
    }

    return user;
  }
}
