import { Inject, Service } from "typedi";
import { Sequelize } from "sequelize-typescript";
import { IUnitOfWork } from "../../../domain/repositories/IUnitOfWork";
import { IBetsRepository } from "../../../domain/repositories/IBetsRepository";
import { BetsRepository } from "./BetsRepository";
import { UsersRepository } from "./UsersRepository";
import { IUsersRepository } from "../../../domain/repositories/IUsersRepository";
import { Transaction } from "sequelize";

@Service()
export class UnitOfWork implements IUnitOfWork {
  private transaction: Transaction | null = null;

  constructor(
    @Inject() private readonly sequelizeClient: Sequelize,
    @Inject(() => BetsRepository)
    public readonly betsRepository: IBetsRepository,
    @Inject(() => UsersRepository)
    public readonly usersRepository: IUsersRepository
  ) {}

  async beginTransaction(): Promise<Transaction> {
    if (this.transaction) {
      throw new Error("Transaction already in progress");
    }
    this.transaction = await this.sequelizeClient.transaction();
    return this.transaction;
  }

  async commit(): Promise<void> {
    if (!this.transaction) {
      throw new Error("No transaction in progress");
    }
    await this.transaction.commit();
    this.transaction = null;
  }

  async rollback(): Promise<void> {
    if (!this.transaction) {
      throw new Error("No transaction in progress");
    }
    await this.transaction.rollback();
    this.transaction = null;
  }
}
