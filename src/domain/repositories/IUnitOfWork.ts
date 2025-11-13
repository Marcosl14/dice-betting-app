import { Transaction } from "sequelize";
import { IBetsRepository } from "./IBetsRepository";
import { IUsersRepository } from "./IUsersRepository";

export interface IUnitOfWork {
  betsRepository: IBetsRepository;
  usersRepository: IUsersRepository;

  beginTransaction(): Promise<Transaction>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
