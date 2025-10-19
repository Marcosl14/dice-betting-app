import { mock } from "jest-mock-extended";
import { GetBetUserResolver } from "../../../../src/infrastructure/resolvers/bets/GetBetUserResolver";
import { UserDataLoader } from "../../../../src/infrastructure/resolvers/users/loaders/UserDataLoader";
import { BetModel } from "../../../../src/infrastructure/database/sequelize-postgres/models/BetModel";
import { IUser } from "../../../../src/domain/entities/IUser";
import { GraphQLError } from "graphql";

describe("GetBetUserResolver", () => {
  const mockUserDataLoader = mock<UserDataLoader>();
  const getBetUserResolver = new GetBetUserResolver(mockUserDataLoader);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return the user for a given bet using the data loader", async () => {
    const mockBet = { userId: 1 } as BetModel;
    const mockUser: IUser = {
      id: 1,
      name: "John Doe",
      balance: 1000,
    };

    // Mock the DataLoader's load method
    mockUserDataLoader.load.mockResolvedValue(mockUser);

    const result = await getBetUserResolver.user(mockBet);

    expect(result).toEqual(mockUser);
    expect(mockUserDataLoader.load).toHaveBeenCalledWith(mockBet.userId);
    expect(mockUserDataLoader.load).toHaveBeenCalledTimes(1);
  });

  it("should throw a GraphQLError if the data loader fails", async () => {
    const mockBet = { userId: 1 } as BetModel;
    const errorMessage = "Failed to fetch user";
    const dataLoaderError = new Error(errorMessage);

    // Mock the DataLoader's load method to reject
    mockUserDataLoader.load.mockRejectedValue(dataLoaderError);

    await expect(getBetUserResolver.user(mockBet)).rejects.toThrow(
      new GraphQLError(errorMessage)
    );

    expect(mockUserDataLoader.load).toHaveBeenCalledWith(mockBet.userId);
    expect(mockUserDataLoader.load).toHaveBeenCalledTimes(1);
  });
});
