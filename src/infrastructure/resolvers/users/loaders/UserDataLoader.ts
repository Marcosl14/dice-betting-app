import DataLoader from "dataloader";
import { GetUserListUseCase } from "../../../../application/usecases/users/GetUserListUseCase";
import { IUser } from "../../../../domain/entities/IUser";
import { Service } from "typedi";

@Service()
export class UserDataLoader {
  private loader: DataLoader<number, IUser | undefined>;

  constructor(private readonly getUserListUseCase: GetUserListUseCase) {
    this.loader = new DataLoader<number, IUser | undefined>(
      async (userIds) => {
        const foundUsers = await this.getUserListUseCase.execute([...userIds]);

        const userMap = new Map<number, IUser>();
        for (const u of foundUsers) {
          userMap.set(u.id, u);
        }

        return userIds.map((id) => userMap.get(id));
      },
      {
        cache: false,
      }
    );
  }

  public async load(id: number): Promise<IUser | undefined> {
    return await this.loader.load(id);
  }
}
