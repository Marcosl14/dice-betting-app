import { IBet } from "../entities/IBet";

export interface IBetsRepository {
  find(id: number): Promise<IBet>;
}
