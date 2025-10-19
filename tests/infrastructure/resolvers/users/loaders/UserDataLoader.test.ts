import { mock } from "jest-mock-extended";
import { UserDataLoader } from "../../../../../src/infrastructure/resolvers/users/loaders/UserDataLoader";
import { GetUserListUseCase } from "../../../../../src/application/usecases/users/GetUserListUseCase";
import { IUser } from "../../../../../src/domain/entities/IUser";

describe("UserDataLoader", () => {
  const mockGetUserListUseCase = mock<GetUserListUseCase>();
  const loader = new UserDataLoader(mockGetUserListUseCase);

  beforeEach(() => {
    jest.resetAllMocks();
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
    mockGetUserListUseCase.execute.mockResolvedValue([
      undefined as unknown as IUser,
    ]);

    const result = await loader.load(id);

    expect(result).toBeUndefined();
    expect(mockGetUserListUseCase.execute).toHaveBeenCalledWith([id]);
    expect(mockGetUserListUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it("should handle multiple sequential loads", async () => {
    const idA = 1;
    const idB = 2;
    const usersForA: IUser[] = [{ id: idA, name: "A", balance: 100 }];
    const usersForB: IUser[] = [{ id: idB, name: "B", balance: 200 }];

    mockGetUserListUseCase.execute
      .mockResolvedValueOnce(usersForA)
      .mockResolvedValueOnce(usersForB);

    const resA = await loader.load(idA);
    const resB = await loader.load(idB);

    expect(resA).toEqual(usersForA[0]);
    expect(resB).toEqual(usersForB[0]);
    expect(mockGetUserListUseCase.execute).toHaveBeenCalledWith([idA]);
    expect(mockGetUserListUseCase.execute).toHaveBeenCalledWith([idB]);
    expect(mockGetUserListUseCase.execute).toHaveBeenCalledTimes(2);
  });
});
