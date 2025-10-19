import { mock } from "jest-mock-extended";
import { GetUserResolver } from "../../../../src/infrastructure/resolvers/users/GetUserResolver";
import { IUser } from "../../../../src/domain/entities/IUser";
import { GetUserUseCase } from "../../../../src/application/usecases/users/GetUserUseCase";
import { NotFoundError } from "../../../../src/application/erros/NotFoundError";
import { GraphQLError } from "graphql";

describe("GetUserResolver", () => {
  const mockGetUserUseCase = mock<GetUserUseCase>();
  const getUserResolver = new GetUserResolver(mockGetUserUseCase);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return a user when a valid id is provided", async () => {
    const userId = 1;
    const mockUser: IUser = {
      id: userId,
      name: "John Doe",
      balance: 1000,
    };

    mockGetUserUseCase.execute.mockResolvedValue(mockUser);

    const result = await getUserResolver.getUser(userId);

    expect(result).toEqual(mockUser);
    expect(mockGetUserUseCase.execute).toHaveBeenCalledWith(userId);
    expect(mockGetUserUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it("should return not found error when an invalid id is provided", async () => {
    const userId = 1;
    const notFoundError = new NotFoundError("User not found");
    mockGetUserUseCase.execute.mockRejectedValue(notFoundError);

    let err: Error | undefined = undefined;
    try {
      await getUserResolver.getUser(userId);
    } catch (error) {
      err = error as Error;
    } finally {
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(GraphQLError);
      expect(err?.message).toEqual(notFoundError.message);
      expect(mockGetUserUseCase.execute).toHaveBeenCalledWith(userId);
      expect(mockGetUserUseCase.execute).toHaveBeenCalledTimes(1);
    }
  });
});
