import { Inject, Service } from "typedi";
import { IBet } from "../../../domain/entities/IBet";
import {
  CreateBetI,
  IBetsRepository,
} from "../../../domain/repositories/IBetsRepository";
import { BetsRepository } from "../../../infrastructure/adapters/repositories/BetsRepository";
import { CreateBetDTO } from "../../dtos/CreateBetDTO";
import { BadRequestError } from "../../erros/BadRequestError";
import { RedlockService } from "../../../infrastructure/database/redlock-redis/RedlockService";
import { ILock, ILockService } from "../../../domain/database/ILockService";

@Service()
export class CreateBetUseCase {
  constructor(
    @Inject(() => BetsRepository)
    private readonly betsRepository: IBetsRepository,
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

      return await this.betsRepository.create(betToCreate);
    } finally {
      if (lock) {
        await this.lockingService.unlock(lock);
      }
    }
  }

  private generateRandomNumber(): number {
    return Math.random();
  }
}
