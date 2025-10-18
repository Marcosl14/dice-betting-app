import { Inject, Service } from "typedi";
import { IBet } from "../../../domain/entities/IBet";
import { IBetsRepository } from "../../../domain/repositories/IBetsRepository";
import { BetsRepository } from "../../../infrastructure/adapters/repositories/BetsRepository";

@Service()
export class GetBetListUseCase {
  constructor(
    @Inject(() => BetsRepository)
    private readonly betsRepository: IBetsRepository
  ) {}

  public async execute(userIds?: number[]): Promise<IBet[]> {
    const bets = await this.betsRepository.findAll(userIds);

    return bets;
  }
}
