import { Service } from "typedi";
import { IBet } from "../../../domain/entities/IBet";
import { IBetsRepository } from "../../../domain/repositories/IBetsRepository";

@Service()
export class BetsRepository implements IBetsRepository {
  async find(id: number): Promise<IBet> {
    return {
      id,
      userId: 1,
      betAmount: 100,
      chance: 0.5,
      payout: 50,
      win: true,
    };
  }

  async findAll(): Promise<IBet[]> {
    return [
      {
        id: 1,
        userId: 1,
        betAmount: 100,
        chance: 0.5,
        payout: 50,
        win: true,
      },
      {
        id: 2,
        userId: 1,
        betAmount: 200,
        chance: 0.4,
        payout: 40,
        win: false,
      },
    ];
  }
}
