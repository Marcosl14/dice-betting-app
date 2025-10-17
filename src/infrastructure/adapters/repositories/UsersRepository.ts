import { Service } from "typedi";
import { IUser } from "../../../domain/entities/IUser";
import { IUsersRepository } from "../../../domain/repositories/IUsersRepository";

@Service()
export class UsersRepository implements IUsersRepository {
  async find(id: number): Promise<IUser> {
    return {
      id,
      name: "John Doe",
      balance: 100.1,
    };
  }
}
