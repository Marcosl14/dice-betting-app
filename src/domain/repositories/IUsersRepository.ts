import { Transaction } from "sequelize";
import { IUser } from "../entities/IUser";

export interface IUsersRepository {
  find(id: number, transaction?: Transaction): Promise<IUser | undefined>;
  findAll(userIds?: number[], transaction?: Transaction): Promise<IUser[]>;
  updateBalance(
    id: number,
    amount: number,
    transaction?: Transaction
  ): Promise<IUser | null>;
}
