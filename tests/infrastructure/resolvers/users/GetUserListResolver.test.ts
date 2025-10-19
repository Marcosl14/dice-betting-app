import { mock } from "jest-mock-extended";
import { GetUserListResolver } from "../../../../src/infrastructure/resolvers/users/GetUserListResolver";
import { IUser } from "../../../../src/domain/entities/IUser";
import { GetUserListUseCase } from "../../../../src/application/usecases/users/GetUserListUseCase";
import { GraphQLError } from "graphql";

describe("GetUserListResolver", () => {
  const mockGetUserListUseCase = mock<GetUserListUseCase>();
  const getUserListResolver = new GetUserListResolver(mockGetUserListUseCase);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return a list of users", async () => {
    const mockUsers: IUser[] = [
      { id: 1, name: "John Doe", balance: 1000 },
      { id: 2, name: "Jane Doe", balance: 1500 },
    ];

    mockGetUserListUseCase.execute.mockResolvedValue(mockUsers);

    const result = await getUserListResolver.getUserList();

    expect(result).toEqual(mockUsers);
    expect(mockGetUserListUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if the use case fails", async () => {
    const errorMessage = "Failed to fetch users";
    const useCaseError = new Error(errorMessage);
    mockGetUserListUseCase.execute.mockRejectedValue(useCaseError);

    let err: Error | undefined = undefined;
    try {
      await getUserListResolver.getUserList();
    } catch (error) {
      err = error as Error;
    } finally {
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(GraphQLError);
      expect(err?.message).toEqual(errorMessage);
      expect(mockGetUserListUseCase.execute).toHaveBeenCalledTimes(1);
    }
  });
});
