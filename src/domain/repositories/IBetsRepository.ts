import { Transaction } from "sequelize";
import { IBet } from "../entities/IBet";

export interface IBetsRepository {
  create(data: CreateBetI, transaction?: Transaction): Promise<IBet>;
  find(id: number, transaction?: Transaction): Promise<IBet | undefined>;
  findAll(params?: IGetBetList, transaction?: Transaction): Promise<IBet[]>;
  findBestBetPerUser(limit: number, transaction?: Transaction): Promise<IBet[]>;
}

export type CreateBetI = Omit<IBet, "id">;

export interface IGetBetList {
  userIds?: number[];
  page?: number;
  limit?: number;
}
