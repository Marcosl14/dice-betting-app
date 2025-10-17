import { IBet } from "../entities/IBet";

export interface IBetsRepository {
  find(id: number): Promise<IBet>;
  findAll(): Promise<IBet[]>;
  findBestBetPerUser(limit: number): Promise<IBet[]>;
}
