import { Inject, Service } from "typedi";
import { IBet } from "../../../domain/entities/IBet";
import { IBetsRepository } from "../../../domain/repositories/IBetsRepository";
import { BetsRepository } from "../../../infrastructure/adapters/repositories/BetsRepository";
import { CreateBetDTO } from "../../dtos/CreateBetDTO";
import { BadRequestError } from "../../erros/BadRequestError";

@Service()
export class CreateBetUseCase {
  constructor(
    @Inject(() => BetsRepository)
    private readonly betsRepository: IBetsRepository
  ) {}

  public async execute(input: CreateBetDTO): Promise<IBet> {
    const { userId, betAmount, chance, payout, win } = input;

    if (chance <= 0 || chance >= 1) {
      throw new BadRequestError("Chance must be between 0 and 1");
    }

    if (payout < betAmount) {
      throw new BadRequestError("Payout must be greater than bet amount.");
    }

    const betToCreate: Omit<IBet, "id"> = {
      userId,
      betAmount,
      chance,
      payout,
      win,
    };

    return await this.betsRepository.create(betToCreate);
  }
}
