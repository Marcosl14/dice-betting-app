import { IUser } from "../entities/IUser";

export interface IUsersRepository {
  find(id: number): Promise<IUser>;
}
