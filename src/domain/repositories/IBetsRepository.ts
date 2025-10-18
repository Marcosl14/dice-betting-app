import { IBet } from "../entities/IBet";

export interface IBetsRepository {
  create(data: CreateBetI): Promise<IBet>;
  find(id: number): Promise<IBet | undefined>;
  findAll(userIds?: number[]): Promise<IBet[]>;
  findBestBetPerUser(limit: number): Promise<IBet[]>;
}

export type CreateBetI = Omit<IBet, "id">;
