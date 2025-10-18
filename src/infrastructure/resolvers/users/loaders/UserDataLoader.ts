import DataLoader from "dataloader";
import { GetUserListUseCase } from "../../../../application/usecases/users/GetUserListUseCase";
import { IUser } from "../../../../domain/entities/IUser";
import { Service } from "typedi";

@Service()
export class UserDataLoader {
  constructor(private readonly getUserListUseCase: GetUserListUseCase) {}

  public async load(id: number): Promise<IUser> {
    const loader = new DataLoader<number, IUser>(async (userIds) => {
      const users = await this.getUserListUseCase.execute([...userIds]);
      return users;
    });

    return await loader.load(id);
  }
}
