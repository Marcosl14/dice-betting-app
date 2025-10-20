import { mock } from "jest-mock-extended";
import { GetUserUseCase } from "../../../../src/application/usecases/users/GetUserUseCase";
import { IUsersRepository } from "../../../../src/domain/repositories/IUsersRepository";
import { IUser } from "../../../../src/domain/entities/IUser";
import { NotFoundError } from "../../../../src/application/erros/NotFoundError";

describe("GetUserUseCase", () => {
  const mockUsersRepository = mock<IUsersRepository>();
  const getUserUseCase = new GetUserUseCase(mockUsersRepository);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return a user when repository resolves", async () => {
    const id = 1;
    const user: IUser = { id, name: "Jane", balance: 500 } as IUser;
    mockUsersRepository.find.mockResolvedValue(user);

    const result = await getUserUseCase.execute(id);

    expect(result).toEqual(user);
    expect(mockUsersRepository.find).toHaveBeenCalledWith(id);
    expect(mockUsersRepository.find).toHaveBeenCalledTimes(1);
  });

  it("should throw NotFoundError when user not found (try/catch/finally)", async () => {
    const id = 2;
    mockUsersRepository.find.mockResolvedValue(undefined);

    let err: Error | undefined = undefined;
    try {
      await getUserUseCase.execute(id);
    } catch (error) {
      err = error as Error;
    } finally {
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(NotFoundError);
      expect(mockUsersRepository.find).toHaveBeenCalledWith(id);
    }
  });
});
