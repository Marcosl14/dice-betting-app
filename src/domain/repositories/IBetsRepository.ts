import { IBet } from "../entities/IBet";

export interface IBetsRepository {
  create(data: CreateBetI): Promise<IBet>;
  find(id: number): Promise<IBet | undefined>;
  findAll(params?: IGetBetList): Promise<IBet[]>;
  findBestBetPerUser(limit: number): Promise<IBet[]>;
}

export type CreateBetI = Omit<IBet, "id">;

export interface IGetBetList {
  userIds?: number[];
  page?: number;
  limit?: number;
}
