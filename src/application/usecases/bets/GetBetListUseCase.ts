import { Inject, Service } from "typedi";
import { IBet } from "../../../domain/entities/IBet";
import {
  IBetsRepository,
  IGetBetList,
} from "../../../domain/repositories/IBetsRepository";
import { BetsRepository } from "../../../infrastructure/adapters/repositories/BetsRepository";

@Service()
export class GetBetListUseCase {
  constructor(
    @Inject(() => BetsRepository)
    private readonly betsRepository: IBetsRepository
  ) {}

  public async execute(params?: IGetBetList): Promise<IBet[]> {
    return await this.betsRepository.findAll(params);
  }
}
