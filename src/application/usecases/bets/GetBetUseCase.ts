import { Inject, Service } from "typedi";
import { IBet } from "../../../domain/entities/IBet";
import { IBetsRepository } from "../../../domain/repositories/IBetsRepository";
import { BetsRepository } from "../../../infrastructure/adapters/repositories/BetsRepository";
import { NotFoundError } from "../../erros/NotFoundError";

@Service()
export class GetBetUseCase {
  constructor(
    @Inject(() => BetsRepository)
    private readonly betsRepository: IBetsRepository
  ) {}

  public async execute(id: number): Promise<IBet> {
    const bet = await this.betsRepository.find(id);

    if (!bet) {
      throw new NotFoundError(`Bet id ${id} not found`);
    }

    return bet;
  }
}
