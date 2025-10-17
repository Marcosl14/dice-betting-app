import { Inject, Service } from "typedi";
import { IBet } from "../../../domain/entities/IBet";
import { BetsRepository } from "../../../infrastructure/adapters/repositories/BetsRepository";
import { IBetsRepository } from "../../../domain/repositories/IBetsRepository";

@Service()
export class GetBestBetPerUserUseCase {
  constructor(
    @Inject(() => BetsRepository)
    private readonly betsRepository: IBetsRepository
  ) {}

  public async execute(limit: number): Promise<IBet[]> {
    return this.betsRepository.findBestBetPerUser(limit);
  }
}
