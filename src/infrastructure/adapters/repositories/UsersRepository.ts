import { Inject, Service } from "typedi";
import { IUser } from "../../../domain/entities/IUser";
import { IUsersRepository } from "../../../domain/repositories/IUsersRepository";
import { UserModel } from "../../database/sequelize-postgres/models/UserModel";

@Service()
export class UsersRepository implements IUsersRepository {
  constructor(@Inject("userModel") private userModel: typeof UserModel) {}

  async find(id: number): Promise<IUser | undefined> {
    const user = await this.userModel.findByPk(id);
    return user?.dataValues;
  }

  async findAll(userIds?: number[]): Promise<IUser[]> {
    let users: UserModel[];
    if (userIds) {
      users = await this.userModel.findAll({
        where: {
          id: userIds,
        },
      });
    } else {
      users = await this.userModel.findAll();
    }
    return users.map((user) => user.dataValues);
  }
}
