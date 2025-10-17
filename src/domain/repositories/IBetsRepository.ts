import { CreateBetDTO } from "../../application/dtos/CreateBetDTO";
import { IBet } from "../entities/IBet";

export interface IBetsRepository {
  create(data: CreateBetDTO): Promise<IBet>;
  find(id: number): Promise<IBet>;
  findAll(): Promise<IBet[]>;
  findBestBetPerUser(limit: number): Promise<IBet[]>;
}
