import { mock } from "jest-mock-extended";
import { UserDataLoader } from "../../../../../src/infrastructure/resolvers/users/loaders/UserDataLoader";
import { GetUserListUseCase } from "../../../../../src/application/usecases/users/GetUserListUseCase";
import { IUser } from "../../../../../src/domain/entities/IUser";

describe("UserDataLoader", () => {
  const mockGetUserListUseCase = mock<GetUserListUseCase>();
  let loader: UserDataLoader;

  beforeEach(() => {
    jest.resetAllMocks();
    loader = new UserDataLoader(mockGetUserListUseCase);
  });

  it("should return a user for the given id", async () => {
    const id = 1;
    const users: IUser[] = [{ id, name: "Alice", balance: 500 }];

    mockGetUserListUseCase.execute.mockResolvedValue(users);

    const result = await loader.load(id);

    expect(result).toEqual(users[0]);
    expect(mockGetUserListUseCase.execute).toHaveBeenCalledWith([id]);
    expect(mockGetUserListUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it("should return undefined when no user is found", async () => {
    const id = 2;
    mockGetUserListUseCase.execute.mockResolvedValue([]);

    const result = await loader.load(id);

    expect(result).toBeUndefined();
    expect(mockGetUserListUseCase.execute).toHaveBeenCalledWith([id]);
    expect(mockGetUserListUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it("should batch load when multiple loads are performed (DataLoader behaviour)", async () => {
    const idA = 1;
    const idB = 2;
    const users: IUser[] = [
      { id: idA, name: "A", balance: 100 },
      { id: idB, name: "B", balance: 200 },
    ];

    mockGetUserListUseCase.execute.mockResolvedValue(users);

    const [resA, resB] = await Promise.all([
      loader.load(idA),
      loader.load(idB),
    ]);

    expect(resA).toEqual(users.find((u) => u.id === idA));
    expect(resB).toEqual(users.find((u) => u.id === idB));

    // The use case should have been called only once with both IDs
    expect(mockGetUserListUseCase.execute).toHaveBeenCalledWith([idA, idB]);
    expect(mockGetUserListUseCase.execute).toHaveBeenCalledTimes(1);
  });
});
