import { Inject, Service } from "typedi";
import { IUser } from "../../../domain/entities/IUser";
import { IUsersRepository } from "../../../domain/repositories/IUsersRepository";
import { UserModel } from "../../database/sequelize-postgres/models/UserModel";
import { QueryTypes, Transaction } from "sequelize"; // Import Op for operators like greater than or equal to
import { NotFoundError } from "../../../application/erros/NotFoundError";
import { ConflictError } from "../../../application/erros/ConflictError";

@Service()
export class UsersRepository implements IUsersRepository {
  constructor(@Inject("userModel") private userModel: typeof UserModel) {}

  async find(
    id: number,
    transaction?: Transaction
  ): Promise<IUser | undefined> {
    const user = await this.userModel.findByPk(id, { transaction });
    return user?.dataValues;
  }

  async findAll(
    userIds?: number[],
    transaction?: Transaction
  ): Promise<IUser[]> {
    let users: UserModel[];
    if (userIds) {
      users = await this.userModel.findAll({
        where: {
          id: userIds,
        },
        transaction,
      });
    } else {
      users = await this.userModel.findAll({
        transaction,
      });
    }
    return users.map((user) => user.dataValues);
  }

  async updateBalance(
    id: number,
    amount: number,
    transaction?: Transaction
  ): Promise<IUser> {
    if (amount > 0) {
      return this.increaseBalance(id, amount, transaction);
    } else if (amount < 0) {
      return this.decreaseBalance(id, amount, transaction);
    } else {
      const user = await this.userModel.findByPk(id, { transaction });

      if (!user) {
        throw new NotFoundError(`User with id ${id} not found`);
      }

      return user.dataValues;
    }
  }

  private async increaseBalance(
    id: number,
    amount: number,
    transaction?: Transaction
  ): Promise<IUser> {
    const [updatedUsers] = await this.userModel.increment(["balance"], {
      by: amount,
      where: { id },
      transaction,
    });

    if (updatedUsers && updatedUsers.length > 0) {
      return updatedUsers[0].dataValues;
    }

    throw new NotFoundError(`User with id ${id} not found`);
  }

  private async decreaseBalance(
    id: number,
    amount: number,
    transaction?: Transaction
  ): Promise<IUser> {
    const absoluteAmount = Math.abs(amount);

    const user = await this.userModel.findByPk(id, { transaction });

    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    const [rawUpdatedUsers] = await this.userModel.sequelize!.query(
      `UPDATE users 
     SET balance = balance - :amount 
     WHERE id = :id AND balance >= :amount 
     RETURNING *`,
      {
        replacements: { id, amount: absoluteAmount },
        type: QueryTypes.UPDATE,
      }
    );

    const updatedUsers: UserDataFromDb | undefined = rawUpdatedUsers
      ? (rawUpdatedUsers[0] as UserDataFromDb)
      : undefined;

    if (updatedUsers && updatedUsers.balance) {
      user.balance = parseInt(updatedUsers.balance) | 0;
      return user;
    }

    throw new ConflictError("Insufficient balance");
  }
}

interface UserDataFromDb {
  id: number;
  name: string;
  balance: string;
  createdAt: Date;
  updatedAt: Date;
}
