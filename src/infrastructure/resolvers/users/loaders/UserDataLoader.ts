import DataLoader from "dataloader";
import { GetUserListUseCase } from "../../../../application/usecases/users/GetUserListUseCase";
import { IUser } from "../../../../domain/entities/IUser";
import { Service } from "typedi";

@Service()
export class UserDataLoader {
  private loader = new DataLoader<number, IUser>(async (userIds) => {
    const users = await this.getUserListUseCase.execute([...userIds]);
    return users;
  });

  constructor(private readonly getUserListUseCase: GetUserListUseCase) {}

  public async load(id: number): Promise<IUser> {
    return await this.loader.load(id);
  }
}
