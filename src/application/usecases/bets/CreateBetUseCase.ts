import { Inject, Service } from "typedi";
import { IBet } from "../../../domain/entities/IBet";
import { IBetsRepository } from "../../../domain/repositories/IBetsRepository";
import { BetsRepository } from "../../../infrastructure/adapters/repositories/BetsRepository";
import { CreateBetDTO } from "../../dtos/CreateBetDTO";

@Service()
export class CreateBetUseCase {
  constructor(
    @Inject(() => BetsRepository)
    private readonly betsRepository: IBetsRepository
  ) {}

  public async execute(input: CreateBetDTO): Promise<IBet> {
    const { userId, betAmount, chance, payout, win } = input;

    if (chance <= 0 || chance >= 1) {
      throw new Error("Chance must be between 0 and 1 (exclusive).");
    }

    const betToCreate: Omit<IBet, "id"> = {
      userId,
      betAmount,
      chance,
      payout,
      win,
    };

    return this.betsRepository.create(betToCreate);
  }
}
