import { mock } from "jest-mock-extended";
import { GetUserBetsResolver } from "../../../../src/infrastructure/resolvers/users/GetUserBetsResolver";
import { BetDataLoader } from "../../../../src/infrastructure/resolvers/bets/loaders/BetDataLoader";
import { IBet } from "../../../../src/domain/entities/IBet";
import { UserModel } from "../../../../src/infrastructure/database/sequelize-postgres/models/UserModel";
import { GraphQLError } from "graphql";

describe("GetUserBetsResolver", () => {
  const mockBetDataLoader = mock<BetDataLoader>();
  const getUserBetsResolver = new GetUserBetsResolver(mockBetDataLoader);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return a list of bets for a given user", async () => {
    const mockUser = { id: 1 } as UserModel;
    const mockBets: IBet[] = [
      {
        id: 1,
        userId: 1,
        betAmount: 10,
        chance: 50,
        payout: 20,
        win: true,
      },
      {
        id: 2,
        userId: 1,
        betAmount: 20,
        chance: 25,
        payout: 0,
        win: false,
      },
    ];

    mockBetDataLoader.load.mockResolvedValue(mockBets);

    const result = await getUserBetsResolver.bets(mockUser);

    expect(result).toEqual(mockBets);
    expect(mockBetDataLoader.load).toHaveBeenCalledWith(mockUser.id);
    expect(mockBetDataLoader.load).toHaveBeenCalledTimes(1);
  });

  it("should throw a GraphQLError if the data loader fails", async () => {
    const mockUser = { id: 1 } as UserModel;
    const errorMessage = "Failed to fetch bets";
    const dataLoaderError = new Error(errorMessage);
    mockBetDataLoader.load.mockRejectedValue(dataLoaderError);

    await expect(getUserBetsResolver.bets(mockUser)).rejects.toThrow(
      new GraphQLError(errorMessage)
    );

    expect(mockBetDataLoader.load).toHaveBeenCalledWith(mockUser.id);
    expect(mockBetDataLoader.load).toHaveBeenCalledTimes(1);
  });
});
