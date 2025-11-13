import { Inject, Service } from "typedi";
import { IBet } from "../../../domain/entities/IBet";
import { CreateBetI } from "../../../domain/repositories/IBetsRepository";
import { CreateBetDTO } from "../../dtos/CreateBetDTO";
import { BadRequestError } from "../../erros/BadRequestError";
import { RedlockService } from "../../../infrastructure/database/redlock-redis/RedlockService";
import { ILock, ILockService } from "../../../domain/database/ILockService";
import { IUnitOfWork } from "../../../domain/repositories/IUnitOfWork";
import { UnitOfWork } from "../../../infrastructure/adapters/repositories/UnitOfWork";
import { Transaction } from "sequelize";

@Service()
export class CreateBetUseCase {
  constructor(
    @Inject(() => UnitOfWork)
    private readonly unitOfWork: IUnitOfWork,
    @Inject(() => RedlockService)
    private readonly lockingService: ILockService
  ) {}

  public async execute(input: CreateBetDTO): Promise<IBet> {
    const lockingKey = `user:create-bet:${input.userId}`;
    let lock: ILock | null = null;

    try {
      lock = await this.lockingService.lock(lockingKey, 1000);

      const { userId, betAmount, chance } = input;

      if (chance <= 0 || chance >= 1) {
        throw new BadRequestError("Chance must be between 0 and 1");
      }

      const win = this.generateRandomNumber() < chance;
      const payout = betAmount / chance;

      const betToCreate: CreateBetI = {
        userId,
        betAmount,
        chance,
        payout,
        win,
      };

      const transaction = await this.unitOfWork.beginTransaction();
      const bet = await this.createBetTransaction(betToCreate, transaction);
      await this.unitOfWork.commit();
      return bet;
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    } finally {
      if (lock) {
        await this.lockingService.unlock(lock);
      }
    }
  }

  private generateRandomNumber(): number {
    return Math.random();
  }

  private async createBetTransaction(
    betToCreate: CreateBetI,
    transaction: Transaction
  ): Promise<IBet> {
    await this.unitOfWork.usersRepository.updateBalance(
      betToCreate.userId,
      -betToCreate.betAmount,
      transaction
    );

    const bet = await this.unitOfWork.betsRepository.create(
      {
        ...betToCreate,
      },
      transaction
    );

    if (betToCreate.win) {
      await this.unitOfWork.usersRepository.updateBalance(
        betToCreate.userId,
        betToCreate.payout,
        transaction
      );
    }

    return bet;
  }
}
