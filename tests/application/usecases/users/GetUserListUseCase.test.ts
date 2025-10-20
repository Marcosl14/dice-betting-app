import { mock } from "jest-mock-extended";
import { GetUserListUseCase } from "../../../../src/application/usecases/users/GetUserListUseCase";
import { IUsersRepository } from "../../../../src/domain/repositories/IUsersRepository";
import { IUser } from "../../../../src/domain/entities/IUser";

describe("GetUserListUseCase", () => {
  const mockUsersRepository = mock<IUsersRepository>();
  const getUserListUseCase = new GetUserListUseCase(mockUsersRepository);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return users array when repository resolves", async () => {
    const userIds = [1, 2];
    const users: IUser[] = [{ id: 1, name: "A", balance: 10 } as IUser];

    mockUsersRepository.findAll.mockResolvedValue(users);

    const result = await getUserListUseCase.execute(userIds);

    expect(result).toEqual(users);
    expect(mockUsersRepository.findAll).toHaveBeenCalledWith(userIds);
  });

  it("should handle repository errors using try/catch/finally", async () => {
    const userIds = [3];
    const error = new Error("db err");
    mockUsersRepository.findAll.mockRejectedValue(error);

    let err: Error | undefined = undefined;
    try {
      await getUserListUseCase.execute(userIds);
    } catch (error) {
      err = error as Error;
    } finally {
      expect(err).toBeDefined();
      expect(err).toBe(error);
      expect(mockUsersRepository.findAll).toHaveBeenCalledWith(userIds);
    }
  });
});
